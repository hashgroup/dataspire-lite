from flask import Flask, request
import ast
import json
import pandas as pd
import traceback
from datetime import datetime
import os
import sys
import shutil
from glob import glob

from ai.src.guest_identification import guest_identification_process
from ai.src.guest_type_detection import guest_type_detector
from ai.src.feature_engineering import feature_engineering_pipeline
from ai.src.modeling_for_LTV import LTV_model
from ai.src.potential_guest_segmentation import Potential_model

app = Flask(__name__)
parent_directory = "/ai/storage/"
def return_object(dataList_output, return_code = 200, return_status = "SUCCESS", return_message = "Returns success", error_log = ""):
    return_body = json.dumps(
        {
            "code": return_code,
            "status": return_status,
            "message": return_message,
            "dataList": dataList_output,
            "errorlog": error_log
        }
    )
    return return_body

def clean_up_storage():
    folder_path = parent_directory + "*"
    list_sub_folder = glob(folder_path)
    for folder in list_sub_folder:
        folder_lifetime = (datetime.now().timestamp() - os.stat(folder).st_ctime)/3600
        ## Try to remove tree; if failed show an error using try...except on screen
        if folder_lifetime > 1.5:
            try:
                shutil.rmtree(folder)
            except OSError as e:
                print ("Error: %s - %s." % (e.filename, e.strerror))

@app.route('/send-input-data', methods=['POST'])
def get_input_data():
    # Clean up the storage
    try:
        clean_up_storage()
    except Exception as error_sum:
        print("Error summary: ", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: ", str(error_log))

    try:
        req_data = request.get_json()

        file_id = request.headers['FileID']
        try:
            force_run = request.headers['ForceRun']
        except:
            force_run = 0
        if force_run != 0:
            print(f"\n\n*************************************************************************")
            print(f"!!! WARNING !!! RUNNING WITH FORCE RUN MAY OCCURED ERRORS WHEN PROCESSING")
            print(f"*************************************************************************\n\n")

        try:
            current_year = request.headers['CurrentYear']
            if len(str(current_year)) != 4 or current_year < 2000:
                current_year = 0
        except:
            current_year = 0

        folder_path = parent_directory + str(file_id) + "/"
        # Create Directory with Header FileID
        print(f"Current directory: {os.getcwd()}")

        try:
            os.mkdir(os.path.join(parent_directory, str(file_id)))
        except Exception as error_sum:
            print("Error summary: ", error_sum)
            error_log = traceback.format_exc()
            print("Error Details: ", str(error_log))

        # RUN THE MAIN PROCESS
        df_guest_identification = guest_identification_process(req_data, str(folder_path), force_run)

        if len(df_guest_identification) < 1000 and force_run == 0:
            json_return_output = return_object(dataList_output = [], return_code = 400, return_status = "ERROR", return_message = "File is too small, required at least 1,000 observations for running the model.")
            return json_return_output
        elif len(df_guest_identification) > 75000 and force_run == 0:
            json_return_output = return_object(dataList_output = [], return_code = 400, return_status = "ERROR", return_message = "File is too large, the maximum observations supported is 75,000.")
            return json_return_output
        elif len(df_guest_identification) < 300 and force_run == 1:
            json_return_output = return_object(dataList_output = [], return_code = 400, return_status = "ERROR", return_message = "File is too small, the force-run only run with at least 300 observations.")
            return json_return_output

        guest_type_detector(str(folder_path))

        feature_engineering_pipeline(str(folder_path), current_year)

        LTV_model(str(folder_path), True)

        Potential_model(str(folder_path))

        json_return_output = return_object(dataList_output = [], return_code = 200, return_status = "SUCCESS", return_message = "Successfully Run.")
    except Exception as error_sum:
        print("Error summary: ", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: ", str(error_log))

        with open(folder_path + "error_log.txt", "w") as text_file:
            text_file.write(str(error_log))

        json_return_output = return_object(dataList_output = [], return_code = 400, return_status = "ERROR", return_message = "Fail when processing", error_log = str(error_log))
    return json_return_output

@app.route('/check-process-status', methods=['GET'])
def check_process_status():
    try:
        fileID = request.headers['FileID']
        directory_path = parent_directory + str(fileID)

        if os.path.isfile(directory_path + '/final_output.json'):
            return_status = "READY"
            return_message = "File is ready."
            error_log = ""
        elif os.path.isfile(directory_path + '/error_log.txt'):
            return_status = "ERROR"
            file_content = open(directory_path + '/error_log.txt', "r")
            error_log = str(file_content.read())
            return_message = "File occured error when processing."
        elif os.path.isfile(directory_path + '/data_input_with_guest_id.csv'):
            return_status = "PROCESSING"
            return_message = "File is processing."
            error_log = ""
        else:
            return_status = "PROCESSING"
            return_message = "File was not found yet."
            error_log = ""

        json_return_output = return_object(dataList_output = [], return_code = 200, return_status = return_status, return_message = return_message, error_log = str(error_log))
    except Exception as error_sum:
        print("Error summary: ", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: ", str(error_log))
        json_return_output = return_object(dataList_output = [], return_code = 400, return_status = "ERROR", return_message = "Fail when processing", error_log = str(error_log))
    return json_return_output

@app.route('/get-prediction-file', methods=['GET'])
def send_prediction_file():
    try:
        fileID = request.headers['FileID']
        directory_path = parent_directory + str(fileID)
        # Opening JSON file
        file_name = open(directory_path + '/final_output.json',)
        # returns JSON object as 
        # a dictionary
        data = json.load(file_name)
        json_return_output = return_object(dataList_output = data, return_code = 200, return_status = "SUCCESS", return_message = "Successfully Run.")
    except Exception as error_sum:
        print("Error summary: ", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: ", str(error_log))
        json_return_output = return_object(dataList_output = [], return_code = 400, return_status = "ERROR", return_message = "Fail when processing. ", error_log = str(error_log))
    return json_return_output

@app.route('/get-file-details', methods=['GET'])
def get_file_details():
    try:
        fileID = request.headers['FileID']
        directory_path = parent_directory + str(fileID)
        file_name = directory_path + '/data_input_with_guest_id.csv'
        try:
            df_input = pd.read_csv(file_name)
        except:
            df_input = pd.DataFrame()
        return_total_records = {"TotalRecords": len(df_input)}
        json_return_output = return_object(dataList_output = [return_total_records], return_code = 200, return_status = "SUCCESS", return_message = "Successfully Retrieve Input File.")
    except Exception as error_sum:
        print("Error summary: ", error_sum)
        error_log = traceback.format_exc()
        print("Error Details: ", str(error_log))
        json_return_output = return_object(dataList_output = [], return_code = 400, return_status = "ERROR", return_message = "Fail when processing. ", error_log = str(error_log))
    return json_return_output

@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
