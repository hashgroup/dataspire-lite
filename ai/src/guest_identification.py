import numpy as np
import pandas as pd
from pandas import DataFrame
import fuzzymatcher

import traceback
from datetime import datetime

def load_data_file(file_path:str, nrows:int = 10e10):
    """
        Load datafile from directory and return output as Dataframe Pandas for processing
        
        Parameters
        ----------
        file_path : str
            Path to load the data file            
    """
    print(f"Start Loading Data File")

    df_input = pd.DataFrame()

    try:
        df_input = pd.read_csv(file_path, nrows = nrows)
    except Exception as error_sum:
        print("___")
        print("Error summary: \n", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: \n", str(error_log))
        print("___")
    
    print(f"Loading File With Total {len(df_input)} Observations")
    print(f"__________________________")
    return df_input 

def preprocess_data_file(df_input: DataFrame):
    """
        Preprocess the dataframe input for fuzzy matching algorihtm in next step. Output of the function is the processed dataframe
        
        Parameters
        ----------
        df_input : DataFrame
            Input DataFrame 
    """
    print(f"Start Preprocess Data File")
    start_time = datetime.now()

    df_input_processed = df_input.copy()
    
    df_input_processed['RoomNo'] = df_input_processed['RoomNo'].fillna("")
    df_input_processed['Children'] = df_input_processed['Children'].fillna(0)

    try:
        df_input_processed["orderid"] = df_input_processed.index

        df_input_processed["LastName"] = df_input_processed["LastName"].fillna("")
        df_input_processed["LastName"] = df_input_processed["LastName"].str.lower()
        df_input_processed["LastName"] = df_input_processed["LastName"].str.strip()

        df_input_processed["FirstName"] = df_input_processed["FirstName"].fillna("")
        df_input_processed["FirstName"] = df_input_processed["FirstName"].str.lower()
        df_input_processed["FirstName"] = df_input_processed["FirstName"].str.strip()

        df_input_processed["tmp_name"] = df_input_processed["FirstName"] + " " + df_input_processed["LastName"]

        df_input_processed["Email"] = df_input_processed["Email"].fillna("")
        df_input_processed["Email"] = df_input_processed["Email"].str.lower()
        df_input_processed["Email"] = df_input_processed["Email"].str.strip()
    except Exception as error_sum:
        print("___")
        print("Error summary: \n", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: \n", str(error_log))
        print("___")
    
    end_time = datetime.now()
    process_time = str(end_time - start_time)
    print(f"Preprocess Data File Time Consuming: {process_time}")
    print(f"__________________________")

    return df_input_processed

def fuzzy_matching_algorithm(df_input_processed: DataFrame):
    """
        Run the fuzzy matching algorithm to return dataframe with guest id
        
        Parameters
        ----------
        df_input_processed : DataFrame
            Input DataFrame 
    """
    cols_on_matching = ['tmp_name', 'Email']

    print(f"Start Apply Fuzzy Matching Algorithm")
    start_time = datetime.now()

    df_output = pd.DataFrame()
    try:
        DF = dict()
        id_features = cols_on_matching + ['orderid']
        DF['guest_id_left'] = df_input_processed[id_features]
        DF['guest_id_right'] = df_input_processed[id_features]

        matched_results = fuzzymatcher.fuzzy_left_join(DF['guest_id_left'],
                                                    DF['guest_id_right'],
                                                    cols_on_matching,
                                                    cols_on_matching,
                                                    left_id_col='orderid',
                                                    right_id_col='orderid')
        
        print(f"Guest Identification Output")
        print(matched_results.sort_values(by="best_match_score", ascending=False).head(10))
        print(f"__________________________")

        df_matched = matched_results[matched_results["best_match_score"]>=0.05].copy().sort_values(by="best_match_score", ascending=True)
        df_matched = df_matched[["__id_left", "__id_right"]]

        df_output = pd.merge(df_input_processed, df_matched,  how="left", left_on="orderid", right_on="__id_left")
        df_output['__id_right'] = df_output['__id_right'].mask(pd.isnull, df_output['orderid'])
        df_output = df_output.drop(columns = ["__id_left", "tmp_name", "orderid"])
        df_output = df_output.rename(columns={"__id_right": "GuestID"})
        df_output['GuestID'] = df_output['GuestID'].astype(int).astype(str)

    except Exception as error_sum:
        print("___")
        print("Error summary: \n", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: \n", str(error_log))
        print("___")

    end_time = datetime.now()
    process_time = str(end_time - start_time)
    print(f"Fuzzy Matching Algorithm Time Consuming: {process_time}")
    print(f"__________________________")

    return df_output

def guest_identification_process(data_input: str, folder_path: str, force_run: int=0):
    try:
        df_input = pd.read_json(data_input)
    except:
        df_input = pd.DataFrame(data_input)
    print(f"\nInput DataFrame with total {len(df_input)} observations")
    print(df_input.columns)
    print(df_input.head(10))
    print(f"__________________________")
    if len(df_input) < 1000 and force_run == 0:
        return df_input
    elif len(df_input) > 75000 and force_run == 0:
        return df_input
    elif len(df_input) < 300:
        return df_input
    
    df_input_processed = preprocess_data_file(df_input)
    df_output = fuzzy_matching_algorithm(df_input_processed)
    df_output.to_csv(str(folder_path) + "data_input_with_guest_id.csv", index = False)
    
    return df_output
    
if __name__ == "__main__":
    file_path = "../sincq-dataset/SINCQ_merged_without_id.csv"
    df_input = load_data_file(file_path, 10000)
    df_input_processed = preprocess_data_file(df_input)
    df_output = fuzzy_matching_algorithm(df_input_processed)
    print(df_output.head(10))