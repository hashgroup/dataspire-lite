import os

import numpy as np
import pandas as pd
from pandas import DataFrame

def guest_type_detector(folder_path: str):
    # Load data
    DF = dict()
    DF['guest_ltv'] = pd.read_csv(str(folder_path) + "data_input_with_guest_id.csv")
    DF['guest_ltv'].drop(columns=['LastName', 'FirstName', 'Email'], inplace=True)

    # Preprocess
    time_cols = [col for col in DF['guest_ltv'].columns if 'date' in col.lower()]
    DF['guest_ltv'][time_cols] = DF['guest_ltv'][time_cols].apply(pd.to_datetime, errors='ignore')

    visitors_df = DF['guest_ltv'].copy()

    visits_counter = visitors_df[['GuestID', 'ArrivalDate']].groupby(by=['GuestID']).agg({'ArrivalDate': 'nunique'})
    visits_counter.reset_index(inplace=True)
    visits_counter.rename(columns={'ArrivalDate': 'NumberOfArrivals'}, inplace=True)
    DF['guest_ltv'] = DF['guest_ltv'].merge(visits_counter, how='outer', on='GuestID', sort=False)

    rooms_counter = visitors_df[['GuestID', 'ArrivalDate']].groupby(by=['GuestID', 'ArrivalDate']).agg({'ArrivalDate': 'count'})
    rooms_counter.rename(columns={'ArrivalDate': 'NumberOfRooms'}, inplace=True)
    rooms_counter.reset_index(inplace=True)
    DF['guest_ltv'] = DF['guest_ltv'].merge(rooms_counter, how='outer', on=['GuestID', 'ArrivalDate'], sort=False)

    # Build DataFrame for 1st Reservations
    DF['1st_reservation'] = DF['guest_ltv'].groupby(by=['GuestID']).first()
    DF['1st_reservation'].reset_index(inplace=True)
    DF['1st_reservation']['is1stVisit'] = DF['1st_reservation'].NumberOfArrivals == 1
    DF['1st_reservation'].drop(columns=['NumberOfArrivals'],inplace=True)
    DF['1st_reservation'].to_csv(folder_path + "1st_reservation.csv", index=False)

    # Build DataFrame for Returning Guests
    DF['frequent_guests'] = DF['guest_ltv'][DF['guest_ltv'].NumberOfArrivals > 1]
    DF['frequent_guests'].to_csv(folder_path + "returning_guests.csv", index=False)

# if __name__ == "__main__":
#     file_path = "C:/Users/HCG/Hash Consulting Grp Pte Ltd/AIML - Documents/General/DSKPO1 - Research and Development/3. Develop/DEVrupt Hospitality/sincq-dataset/SINCQ_final.csv"
#     guest_type_detector(file_path)


