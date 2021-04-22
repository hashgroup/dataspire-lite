import os

from glob import glob
from tqdm import tqdm as print_progress
from datetime import datetime, timedelta, date
import dateutil

import math
import numpy as np
import pandas as pd
import featuretools as ft
from featuretools.variable_types import Id, Numeric, Categorical, Datetime

import ai.src.utils as utils
from ai.src.utils.utils import *
from ai.src.utils.customized_variable_types import *


START_DATE = pd.to_datetime('2000-01-01', format='%Y-%m-%d')
END_DATE = pd.to_datetime(datetime.now().strftime("%Y-%m-%d"), format='%Y-%m-%d')


def data_impute(df: pd.DataFrame) -> pd.DataFrame:
    df = utils.feature_engineering.filter_out_minor_categoricals(df=df, 
                                                                 column_names=['Channel', 'Country'])

    # Drop missing-valued samples
    df.dropna(subset=['TotalPayment', 'ArrivalDate', 'DepartureDate'], inplace=True)

    # Normalize
    df.Status = df.Status.str.upper()

    return df


def generate_features_recency(guest_data: pd.DataFrame, END_DATE):
    most_recent_date = guest_data.DepartureDate.max()
    inactive_days = int((END_DATE-most_recent_date) / pd.Timedelta(days=1))
    active_months = list(guest_data.ArrivalDate.dt.month) + \
                    list(guest_data.DepartureDate.dt.month)
                    # list(guest_data.CreatedDate.dt.month) + \
    most_active_month = max(set(active_months), key=active_months.count)
    most_active_quarter = month_to_quarter(most_active_month)
    least_active_month = min(set(active_months), key=active_months.count)
    least_active_quarter = month_to_quarter(least_active_month)
    
    return inactive_days, most_active_month, least_active_month, most_active_quarter, least_active_quarter


def generate_features_frequency(guest_data: pd.DataFrame, customer_lifetime,
                                date_1st_booking, END_DATE, MAM_data):
    n_orders = len(guest_data.groupby(by=['ArrivalDate']))
    average_orders = int(n_orders/customer_lifetime) if customer_lifetime>1 else n_orders
    n_orders_in_MAM = len(MAM_data)
    average_orders_in_MAM = int(n_orders_in_MAM/customer_lifetime) if customer_lifetime>1 else n_orders_in_MAM
    
    return n_orders, average_orders, average_orders_in_MAM


def generate_features_monetary(guest_data: pd.DataFrame, customer_lifetime, MAM_data):
    total_revenue = guest_data.TotalPayment.sum()
    average_revenue = total_revenue/customer_lifetime if customer_lifetime>1 else total_revenue
    revenue_in_MAM = MAM_data.TotalPayment.sum()
    average_revenue_in_MAM = revenue_in_MAM/int(customer_lifetime) if customer_lifetime>1 else revenue_in_MAM
    
    return total_revenue, average_revenue, average_revenue_in_MAM


def generate_features_nonRFM(guest_data: pd.DataFrame, n_orders, total_revenue):
    nights_in_house = int(np.mean(guest_data.Nights))
    arrdates = guest_data.ArrivalDate.sort_values()
    days_between_orders = (arrdates.values[1:] - arrdates.values[:-1]) / pd.Timedelta(days=1)
    days_between_orders = np.mean(days_between_orders) if len(days_between_orders)>0 \
                            else (START_DATE-END_DATE) / pd.Timedelta(days=1)
    days_between_orders = int(days_between_orders)

    n_rooms = len(guest_data)
    average_rooms = int(n_rooms/n_orders) 
    average_revenue_per_order = total_revenue / n_orders
    average_revenue_per_room = total_revenue / n_rooms

    return days_between_orders, nights_in_house, n_rooms, \
                average_rooms, average_revenue_per_order, average_revenue_per_room


def feature_engineering_manual_for_LTV(df: pd.DataFrame) -> pd.DataFrame:
    global START_DATE, END_DATE

    features = [
        # Recency features
        'InactiveDays', 'MostActiveMonth', 'LeastActiveMonth', 'MostActiveQuarter', 'LeastActiveQuarter',
        
        # Frequency features
        'NumberOfOrders', 'AverageOrdersPerYear', 'AverageOrdersInMostActiveMonth',
        
        # Monetary features
        'TotalRevenue', 'AverageRevenuePerYear', 'AverageRevenueInMostActiveMonth',
        
        # Non-RFM features
        'AverageDaysBetweenOrders', 'AverageNightsInHouse', 'NumberOfRooms', 
        'AverageRoomsPerOrder', 'AverageRevenuePerOrder', 'AverageRevenuePerRoom',
        
        # Personal features
        'Lifetime', 'Country',
    ]
    guests_df = pd.DataFrame(columns=features)

    for guest_id, guest_data in print_progress(df.groupby(by=['GuestID'])):
    
        # Filter by time window
        # date_1st_booking = guest_data.CreatedDate.min()
        date_1st_booking = guest_data.ArrivalDate.min()
        customer_lifetime = (END_DATE-date_1st_booking).days / 365.25
        
        # Generate features for RECENCY
        inactive_days, most_active_month, least_active_month, \
                    most_active_quarter, least_active_quarter = generate_features_recency(guest_data, END_DATE)
        
        # Filter Most Active Month
        MAM_data = guest_data.loc[
            # (guest_data.CreatedDate.dt.month == most_active_month) |
            (guest_data.ArrivalDate.dt.month == most_active_month) |
            (guest_data.DepartureDate.dt.month == most_active_month)
        ]
        
        # Generate features for FREQUENCY
        n_orders, average_orders, average_orders_in_MAM = generate_features_frequency(
            guest_data, customer_lifetime, date_1st_booking, END_DATE, MAM_data
        )

        # Generate features for MONETARY
        total_revenue, average_revenue, average_revenue_in_MAM = generate_features_monetary(
            guest_data, customer_lifetime, MAM_data
        )
        
        # Generate features for LTV classification
        days_between_orders, nights_in_house, n_rooms, \
        average_rooms, average_revenue_per_order, average_revenue_per_room = generate_features_nonRFM(
            guest_data, n_orders, total_revenue
        )
        
        # Feed generated features into DataFrame
        guests_df.loc[guest_id] = [
            inactive_days, most_active_month, least_active_month, most_active_quarter, least_active_quarter,
            n_orders, average_orders, average_orders_in_MAM,
            total_revenue, average_revenue, average_revenue_in_MAM,
            days_between_orders, nights_in_house, n_rooms, average_rooms, average_revenue_per_order, average_revenue_per_room,
            customer_lifetime, guest_data.Country.unique()[0]
        ]

    guests_df['GuestID'] = list(guests_df.index)
    guests_df.reset_index(drop=True, inplace=True)

    for col in guests_df.columns:
        if col == 'Country':
            continue
        guests_df[col] = guests_df[col].astype(float)

    return guests_df


def feature_engineering_auto_for_LTV(df: pd.DataFrame) -> pd.DataFrame:
    df_name = 'returning_guests'
    EntitySet = ft.EntitySet(id=df_name)
    EntitySet = EntitySet.entity_from_dataframe(
        entity_id=df_name,
        dataframe=df,
        make_index=False, 
        index='GuestID',
        variable_types={
            'GuestID': Id,
            'Country': Categorical,
            'Lifetime': Age,
            
            'TotalRevenue': Price,
            'AverageRevenuePerYear': Price,
            'AverageRevenueInMostActiveMonth': Price,
            
            'InactiveDays': Numeric,
            'NumberOfRooms': Numeric,
            'NumberOfOrders': Numeric,
            'AverageNightsInHouse': Numeric, 
            'AverageDaysBetweenOrders': Numeric, 
            'AverageRevenuePerOrder': Numeric,
            'AverageRevenuePerRoom': Numeric,
            'AverageRoomsPerOrder': Numeric,
            'AverageOrdersPerYear': Numeric,
            'AverageOrdersInMostActiveMonth': Numeric,
            
            'MostActiveMonth': Categorical,
            'LeastActiveMonth': Categorical,
            'MostActiveQuarter': Categorical,
            'LeastActiveQuarter': Categorical,
        }
    )
    
    feature_matrix, feature_definitions = utils.feature_engineering.auto_feature_engineering(
        entity_set=EntitySet, table_name=df_name, verbose=True
    )
    
    return feature_matrix


def feature_engineering_auto_for_1stBooking(df: pd.DataFrame) -> pd.DataFrame:
    df_name = '1st_reservation'
    EntitySet = ft.EntitySet(id=df_name)
    EntitySet = EntitySet.entity_from_dataframe(
        entity_id=df_name,
        dataframe=df,
        make_index=False, 
        index='GuestID',
        variable_types={
            'GuestID': Id,
            
            'Adults': People,
            'Children': People,
            'TotalPayment': Price,
            'Nights': Numeric,
            'RoomPrice': Numeric,
            'NumberOfRooms': Numeric,
            
            'Channel': Categorical,
            'Status': Categorical,
            'RoomGroupID': Categorical,
            
            # 'CreatedDate': Datetime,
            'ArrivalDate': Datetime,
            'DepartureDate': Datetime,
        }
    )
    
    feature_matrix, feature_definitions = utils.feature_engineering.auto_feature_engineering(
        entity_set=EntitySet, table_name=df_name, verbose=True
    )
    
    return feature_matrix


def feature_engineering_pipeline(folder_path: str, current_year: int = 0):
    global END_DATE

    if current_year != 0:
        input_date = str(int(current_year)+1) + "-01-01"
        END_DATE = pd.to_datetime(input_date, format='%Y-%m-%d')
    else:
        input_date = str(int(datetime.now().year)+1) + "-01-01"
        END_DATE = pd.to_datetime(input_date, format='%Y-%m-%d')

    # Load data
    DF = dict()
    df_names = ['1st_reservation', 'returning_guests']
    for df_name in df_names:
        DF[df_name] = load_csv(folder_path+f"{df_name}.csv")
        for col in DF[df_name].columns:
            if 'date' in col.lower():
                DF[df_name][col] = pd.to_datetime(DF[df_name][col])

    # Preprocess for raw features
    for df_name in df_names:   
        # Data Imputation
        DF[df_name] = data_impute(DF[df_name])

        # Create feature `Nights`
        DF[df_name]['Nights'] = (DF[df_name].DepartureDate - DF[df_name].ArrivalDate) / pd.Timedelta(days=1)
        DF[df_name]['Nights'] = DF[df_name]['Nights'].astype(int)

        # Save
        DF[df_name].to_csv(folder_path+f"{df_name}_fillna.csv", index=False)

    # Feature Engineering
    DF['returning_guests'] = feature_engineering_manual_for_LTV(DF['returning_guests'])
    DF['returning_guests'] = feature_engineering_auto_for_LTV(DF['returning_guests'])
    DF['returning_guests'].to_csv(folder_path+"returning_guests_processed.csv")

    dsets = DF['1st_reservation']['is1stVisit']
    dsets.index = DF['1st_reservation'].GuestID
    Xs = DF['1st_reservation'].drop(columns=['is1stVisit'], axis=1)
    Xs = feature_engineering_auto_for_1stBooking(Xs)
    DF['1st_reservation'] = pd.concat([Xs, dsets.to_frame()], axis=1)
    DF['1st_reservation'].to_csv(folder_path+"1st_reservation_processed.csv")


if __name__ == "__main__":
    folder_path = "C:/Users/HCG/Hash Consulting Grp Pte Ltd/AIML - Documents/General/DSKPO1 - Research and Development/3. Develop/DEVrupt Hospitality/SourceCode/output/"
    feature_engineering_pipeline(folder_path)










