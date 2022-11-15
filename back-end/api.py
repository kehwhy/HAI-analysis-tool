from flask import Flask, render_template, request
from autogluon.tabular import TabularPredictor
import pandas as pd
from sklearn.model_selection import train_test_split
import json
import os
import shutil
import os.path
from os import path
import csv

app = Flask(__name__)

filelist = ['workfile.csv', 'workfile_train.csv', 'workfile_test.csv', 'workfile_test_predictions.csv']

@app.route('/')
def index():
    return render_template('test_api.html')


@app.route('/', methods=['POST'])
def generate_model_from_input():
    # get the uploaded file
    uploaded_file = request.files['file']
    if uploaded_file.filename[-4:] != '.csv':
        return("file must be of type .csv")
    label = request.form['label']
    if uploaded_file.filename != '' and label != '':
        df = pd.read_csv(uploaded_file)
        # make all headers lowercase
        df.columns = df.columns.str.lower()
        # make client label input all lowercase
        label = label.lower()
        # save uploaded csv to workfile
        df.to_csv(filelist[0], encoding='utf-8', index=False)

        # split the csv into train and test data
        train_data, test_data = train_test_split(df, test_size=0.2)
        # save test and train csv's
        train_data.to_csv(filelist[1], encoding='utf-8', index=False)
        test_data.to_csv(filelist[2], encoding='utf-8', index=False)

        save_path = 'agModels-predictClass'  # specifies folder to store trained models
        predictor = TabularPredictor(label=label, path=save_path).fit(
            train_data=train_data, presets='best_quality')
        y_test = test_data[label]  # values to predict
        # delete label column
        test_data_nolabel = test_data.drop(columns=[label])
        # predict
        y_pred = predictor.predict(test_data_nolabel)
        # save predictions
        test_data_nolabel[label] = y_pred
        test_data_nolabel.to_csv(filelist[3],
                  encoding='utf-8', index=False)

        eval = predictor.evaluate_predictions(
            y_true=y_test, y_pred=y_pred, auxiliary_metrics=True)
        my_json_string = json.dumps(
            {'Model': predictor.get_model_best(), 'Evaluation': eval, 'ModelPath': save_path})
        return(my_json_string)

# before generating a new model
@app.route('/remove_existing_data_and_model', methods=['POST'])
def remove_existing_model():
    # remove generated directories and files from run
    model_path = 'agModels-predictClass'
    if path.isdir(model_path):
        # shutil recursively removes files and directories residing in given path
        shutil.rmtree('agModels-predictClass')
    for file in filelist:
        if path.isfile(file):
            os.remove(file)
    return

# On loading interactive page
@app.route('/populate_default_data', methods=['POST'])
def generate_default_data_score():
    df = pd.read_csv("workfile_test_predictions.csv")
    # select a single row from test csv
    df = df.sample()
    print(df.to_json(orient = "records"))


# # When a user puts in their own values a clicks 'Calculate Score'
# @app.route('/calculate_score', methods=['POST'])
# def calculate_score_user_data_score():
#     # get json input of features
#     req = request.get_json
#     df = pd.read_json(req)
#     predictor = TabularPredictor.load('agModels-predictClass')

# @app.route('/get_model_bias', methods=['POST'])
# def get_model_bias():
#     # get the model
#     path = request.form['save_path']
#     predictor = TabularPredictor.load(path)


if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=105)
