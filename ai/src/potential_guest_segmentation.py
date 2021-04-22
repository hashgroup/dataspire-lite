import numpy as np
import pandas as pd
from pandas import DataFrame
from sklearn.cluster import DBSCAN
from sklearn import preprocessing

import traceback
from datetime import datetime


def LTV_class_probability(value_series):
    value_list = value_series.values.tolist()
    class_1_prob = value_list.count(1)
    class_2_prob = value_list.count(2)*2
    class_3_prob = value_list.count(3)*5
    total_prob = class_1_prob + class_2_prob + class_3_prob + 1e-10
    output_dict = {
        "Low_Class": round(class_1_prob/total_prob,2),
        "Mid_Class": round(class_2_prob/total_prob,2),
        "High_Class": round(class_3_prob/total_prob,2)
    }
    return output_dict


def generated_final_cluster(low_class_prob, mid_class_prob, high_class_prob):
    max_prob = max(low_class_prob, mid_class_prob, high_class_prob)
    if high_class_prob >= max_prob:
        return 3
    elif mid_class_prob >= max_prob:
        return 2
    elif low_class_prob>= max_prob:
        return 1
    else:
        return -1

    
def guest_type_cols(LTV_Class, Final_Cluster):
    if LTV_Class >= 1:
        return "Returning Guest"
    elif Final_Cluster == -1:
        return "Ignore 1st-Time Guest"
    else:
        return "1st-Time Guest"


def construct_ground_truth_file(folder_path: str):
    """
        Load datafile from directory and contruct the ground truth Dataframe Pandas for processing
    """
    print(f"Start Construct Ground Truth File")

    df_long_time_guests = DataFrame()
    df_short_time_guests = DataFrame()
    df_ground_truth = DataFrame()
    try:
        df_long_time_guests = pd.read_csv(folder_path + "LTV_class_of_long_time_guests.csv")
        df_short_time_guests = pd.read_csv(folder_path + "LTV_class_of_short_time_guests.csv")

        df_returning_guest = pd.concat([df_long_time_guests, df_short_time_guests]).reset_index()
        df_returning_guest["LTV_Class"].replace({"CLV_Low_Prob": "1", "CLV_Mid_Prob": "2", "CLV_High_Prob": "3"}, inplace=True)

        df_ground_truth = df_returning_guest.drop(columns = ["index", "CLV_Low_Prob", "CLV_Mid_Prob", "CLV_High_Prob"])
        
        df_ground_truth["GuestID"] = df_ground_truth["GuestID"].astype(int)
        df_ground_truth["LTV_Class"] = df_ground_truth["LTV_Class"].astype(int)
    except Exception as error_sum:
        print("___")
        print("Error summary: \n", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: \n", str(error_log))
        print("___")
    
    print(f"Construct Ground-Truth File With Total {len(df_ground_truth)} observations. ({len(df_long_time_guests)} observations from segmentations and {len(df_short_time_guests)} observations from classification.)")
    if len(df_ground_truth) > 0:
        print(f"\t* LTV Low-Class Guest: {len(df_ground_truth[df_ground_truth['LTV_Class']==1])} observations")
        print(f"\t* LTV Mid-Class Guest: {len(df_ground_truth[df_ground_truth['LTV_Class']==2])} observations")
        print(f"\t* LTV High-Class Guest: {len(df_ground_truth[df_ground_truth['LTV_Class']==3])} observations")
    print(f"__________________________")

    return df_ground_truth, df_returning_guest


def construct_1st_time_reservation_file(folder_path: str):
    """
        Load datafile from directory and contruct the 1st-time reservation Dataframe Pandas for processing
    """

    print(f"Start Construct 1st-time Reservation File")

    df_1st_reservation_returning_guest = DataFrame()
    df_1st_reservation_1st_time_guest = DataFrame()
    df_1st_reservation_combine = DataFrame()

    try:
        df_1st_reservation_combine = pd.read_csv(folder_path + "1st_reservation_processed.csv")
        df_1st_reservation_returning_guest = df_1st_reservation_combine[df_1st_reservation_combine["is1stVisit"]==False]
        df_1st_reservation_1st_time_guest = df_1st_reservation_combine[df_1st_reservation_combine["is1stVisit"]==True]

        # df_1st_reservation_combine = pd.concat([df_1st_reservation_returning_guest, df_1st_reservation_1st_time_guest]).reset_index().drop(columns = ['index'])
    except Exception as error_sum:
        print("___")
        print("Error summary: \n", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: \n", str(error_log))
        print("___")
    
    print(f"Construct 1st-time Reservation File With Total {len(df_1st_reservation_combine)} Observations.\n\
    * Returning Guest: {len(df_1st_reservation_returning_guest)} observations\n\
    * 1st-time Guest: {len(df_1st_reservation_1st_time_guest)} observations")
    print(f"__________________________")

    return df_1st_reservation_combine


def DBSCAN_clustering(df_input: DataFrame):
    """
        Run the DBSCAN clustering algorithm to return dataframe with cluster group
        
        Parameters
        ----------
        Input
            df_input : DataFrame
        
        Output: 
            DataFrame with cluster group by guest ID
    """
    print(f"Start Apply DBSCAN Clustering Algorithm")
    start_time = datetime.now()
    try:
        X = np.array(df_input.drop(['GuestID', 'LTV_Class', 'is1stVisit'], 1).astype(float))
        X = preprocessing.StandardScaler().fit_transform(X)

        clf = DBSCAN(min_samples=2, eps=100, algorithm='kd_tree', n_jobs=-1)
        clf.fit(X)

        labels = clf.labels_

        df_input['cluster_group'] = np.nan
        for i in range(len(X)):
            df_input['cluster_group'].iloc[i] = labels[i]

    except Exception as error_sum:
        print("___")
        print("Error summary: \n", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: \n", str(error_log))
        print("___")

    end_time = datetime.now()
    process_time = str(end_time - start_time)
    print(f"DBSCAN Clustering Algorithm Time Consuming: {process_time} with total {len(df_input)} observations")
    print(f"__________________________")

    return df_input


def probability_applied(df_input: DataFrame):
    """
        Run the Probability clustering algorithm to return dataframe with cluster group
        
        Parameters
        ----------
        Input
            df_input : DataFrame
        
        Output: DataFrame with cluster group by guest ID
    """
    print(f"Start Apply Probability Algorithm")

    df_output = DataFrame()

    try:
        df_simplify_input = df_input[['GuestID', 'LTV_Class', 'cluster_group']].copy()

        df_filter = df_input[df_input['cluster_group']!=-1][['GuestID', 'LTV_Class', 'cluster_group']].sort_values(by=['cluster_group'])
        df_filter['LTV_Class'] = df_filter['LTV_Class'].fillna(-1)
        df_filter = df_filter[df_filter['LTV_Class']!=-1]
        
        df_groupby_cluster_group = df_filter.groupby('cluster_group')['LTV_Class'].apply(LTV_class_probability)
        df_groupby_cluster_group = df_groupby_cluster_group.reset_index()

        df_groupby_cluster_group = df_groupby_cluster_group.rename(columns={'LTV_Class':'Final_Cluster', 'level_1': 'Returning_Cluster'})
        df_groupby_cluster_group = df_groupby_cluster_group.pivot(index='cluster_group', columns='Returning_Cluster', values='Final_Cluster').reset_index()

        df_output = df_simplify_input.merge(df_groupby_cluster_group, left_on="cluster_group", right_on="cluster_group", how="left")
        df_output["Final_Cluster"] = df_output.apply(lambda df_output: generated_final_cluster(df_output["Low_Class"], df_output["Mid_Class"], df_output["High_Class"]), axis=1)
        df_output["Guest_Type"] = df_output.apply(lambda df_output: guest_type_cols(df_output["LTV_Class"], df_output["Final_Cluster"]), axis=1)

        df_output['LTV_Class'] = df_output['LTV_Class'].fillna(df_output['Final_Cluster'])
        df_output = df_output.drop(columns = ['cluster_group', 'Final_Cluster'])
    except Exception as error_sum:
        print("___")
        print("Error summary: \n", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: \n", str(error_log))
        print("___")

    print(f"Probability Algorithm Completed")
    print(f"__________________________")

    if len(df_output) > 0:
        Counter = df_output['Guest_Type'].value_counts()
        for guest_type in ['Returning Guest', '1st-Time Guest', 'Ignore 1st-Time Guest']:
            if guest_type not in Counter.index:
                Counter.loc[guest_type] = 0
        print(f"Data File Output: {len(df_output)} observations.\n\
            \t* Returning Guest: {Counter.loc['Returning Guest']} observations.\n\
            \t* 1st-Time Guest: {Counter.loc['1st-Time Guest'] + Counter.loc['Ignore 1st-Time Guest']} observations:\n\
            \t\t + Potential Guest: {Counter.loc['1st-Time Guest']} observations\n\
            \t\t + Ignore Guest: {Counter.loc['Ignore 1st-Time Guest']} observations")

    return df_output

def Potential_model(folder_path: str):
    df_ground_truth, df_returning_guest = construct_ground_truth_file(folder_path)
    df_1st_reservation_combine = construct_1st_time_reservation_file(folder_path)

    df_combine = df_1st_reservation_combine.merge(df_ground_truth, left_on="GuestID", right_on="GuestID", how="left")

    df_combine = DBSCAN_clustering(df_combine.copy())
    df_combine.to_csv(folder_path + "DBSCAN_output.csv", index=False)

    df_potential_model = probability_applied(df_combine.copy())
    df_potential_model.to_csv(folder_path + "potential_model_output.csv", index=False)

    df_potential_model = df_potential_model.rename(columns={'High_Class':'CLV_High_Prob', 'Low_Class': 'CLV_Low_Prob', 'Mid_Class': 'CLV_Mid_Prob'})
    df_potential_model = df_potential_model[df_potential_model['Guest_Type'] != 'Returning Guest']

    df_returning_guest['Guest_Type'] = "Returning Guest"
    
    df_all_guest_merge = pd.concat([df_returning_guest.drop(columns=["index"]), df_potential_model]).reset_index().drop(columns=["index"])
    df_input_guest_id = pd.read_csv(str(folder_path) + "data_input_with_guest_id.csv")
    
    df_final_output = df_input_guest_id.merge(df_all_guest_merge, left_on="GuestID", right_on="GuestID", how="left")
    
    df_final_output = df_final_output[df_final_output["Guest_Type"] != "Ignore 1st-Time Guest"]
    df_final_output = df_final_output[["LastName","FirstName","Email","GuestID","LTV_Class","CLV_Low_Prob","CLV_Mid_Prob","CLV_High_Prob","Guest_Type"]].drop_duplicates(subset=["LastName","FirstName","Email"])
    try:
        print(f"Return The DataFrame Output")
        print(df_final_output.head(10))
        print(f"__________________________")
    except:
        pass
    df_final_output[["LastName","FirstName","Email","GuestID","LTV_Class","CLV_Low_Prob","CLV_Mid_Prob","CLV_High_Prob","Guest_Type"]].to_json(folder_path + "final_output.json", orient='records')