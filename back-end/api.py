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

filelist = ['workfile.csv', 'workfile_train.csv',
            'workfile_test.csv', 'workfile_test_predictions.csv']
models_dir = 'agModels-predictClass'
protected_attributes = ['age', 'sex', 'race', 'gender', 'ethnicity',
                        'marital status', 'religion', 'national origin',
                        'public assistance', 'disability', 'pregnancy', 'maternity']

@app.route('/')
def index():
    return render_template('test_api.html')


@app.route('/generate/model', methods=['POST'])
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

        predictor = TabularPredictor(label=label, path=models_dir).fit(
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
            {'Model': predictor.get_model_best(), 'Evaluation': eval, 'ModelPath': models_dir})
        return(my_json_string)

# before generating a new model


@app.route('/purge', methods=['POST'])
def purge_data():
    # remove generated directories and files from run
    if path.isdir(models_dir):
        # shutil recursively removes files and directories residing in given path
        shutil.rmtree('agModels-predictClass')
    for file in filelist:
        if path.isfile(file):
            os.remove(file)
    return

# On loading interactive page


@app.route('/generate/default', methods=['POST'])
def get_default_data_score():
    df = pd.read_csv(filelist[3])
    # select a single row from test csv predictions
    df = df.sample()
    return(df.to_json(orient="default"))


# When a user puts in their own values a clicks 'Calculate Score'
@app.route('/generate/calculate_score', methods=['POST'])
def calculate_user_data_score():
    # get json input of features
    req = request.get_json
    df = pd.read_json(req)
    predictor = TabularPredictor.load(models_dir)
    y_pred = predictor.predict(df)
    return(y_pred.to_json(orient="prediction"))


@app.route('/protected/attributes', methods=['POST'])
def get_protected_attributes():
    # get the csv's protected attributes
    df = pd.read_csv(filelist[3])
    attribute_list = list(df)
    # we don't know if the strings will be exactly the same so we will see 
    # if any attributes contain attributes from the protected list
    present_protected_attributes = []
    for attr in attribute_list:
        for prot in protected_attributes:
            if prot in attr:
                present_protected_attributes.append(attr)
    my_json_string = json.dumps(
            {'Protected': present_protected_attributes})
    return(my_json_string)

if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=105)
