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
from aif360.datasets import StandardDataset
from aif360.metrics import BinaryLabelDatasetMetric
from aif360.datasets import StandardDataset
from aif360.metrics import BinaryLabelDatasetMetric
from sklearn.preprocessing import OrdinalEncoder

app = Flask(__name__)

filelist = ['workfile.csv', 'workfile_train.csv',
            'workfile_test.csv', 'workfile_test_predictions.csv', 'workfile_train_processed']
models_dir = 'agModels-predictClass'
protected_attributes = ['age_cat', 'sex', 'race']
compas_catagorical_feature_list = [
    "sex", "age_cat", "race", "c_days_from_compas", "c_charge_degree", "c_charge_desc"]

# Have to put these here for now
pocessed_data_full = {'Male': 1, 'Female': 0, 'age_cat_greater_than_45': 1,
                 'age_cat_25_to_45': 0, 'age_cat_less_than_45': 2, 'African-American': 0, 'Asian': 1,
                 'Caucasion': 2, 'Hispanic': 3, 'Native-American': 4, 'Other': 5}

# split them up so we can return the correct list of values to frontend
pocessed_data_sex = {'Male': 1, 'Female': 0}
processed_data_age_cat = {'age_cat_greater_than_45': 1,
                          'age_cat_25_to_45': 0, 'age_cat_less_than_45': 2}
processed_data_race = {'African-American': 0, 'Asian': 1,
                       'Caucasion': 2, 'Hispanic': 3, 'Native American': 4, 'Other': 5}


@app.route('/')
def index():
    return render_template('test_api.html')


# generate model on upload
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


# get protected features on loading interactive page
@app.route('/protected', methods=['POST'])
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

# get protected attributes on loading interactive page
@app.route('/protected/values', methods=['POST'])
def get_protected_attribute_values():
    # get json input of protected attribute
    req = request.get_json
    # get the feature
    protected_attr = req.get('protected')
    if protected_attr is 'sex':
        json = json.dumps(
        {'Values': pocessed_data_sex})
        return(json)
    if protected_attr is 'age_cat':
        json = json.dumps(
        {'Values': processed_data_age_cat})
        return(json)
    if protected_attr is 'race':
        json = json.dumps(
        {'Values': processed_data_race})
        return(json)


# When a user puts in their own values a clicks 'Calculate Score'
@app.route('/generate/calculate_score', methods=['POST'])
def calculate_user_data_score():
    # get json input of features
    req = request.get_json
    df = pd.read_json(req)
    predictor = TabularPredictor.load(models_dir)
    y_pred = predictor.predict(df)
    return(y_pred.to_json(orient="prediction"))


# calculate bias metrics
@app.route('/generate/bias', methods=['POST'])
def calculate_bias():
    # get json input of features
    req = request.get_json

    # We need the potected attribute and the label
    protected_attr = req.get('protected')
    label = req.get('label')
    # We also need the attribute values they want to compare, rely on frontend to match the correct dict
    priveledged = req.get('priveledged')
    unpriveledged = req.get('unpriveledged')
    

    # Only create this processed data once
    if not path.isfile(filelist[4]):
        df = pd.read_csv(filelist[2])
        # 0 is desirable, 1 is not desirable
        df[label].mask(df[label] <= 4, 0, inplace=True)
        df[label].mask(df[label] >= 5, 1, inplace=True)
        df.fillna(0)
        # process catagorial data into numerical data
        oe = OrdinalEncoder()
        df[compas_catagorical_feature_list] = oe.fit_transform(
            df[[compas_catagorical_feature_list]])
        # save it
        df.to_csv(filelist[4], encoding='utf-8', index=False)

    # now that we have the binary encoding for scores we can calculate bias metrics
    dataset = StandardDataset(df,
                              label_name=label,
                              # 0 represents low recidivism score
                              favorable_classes=[0],
                              protected_attribute_names=[protected_attr],
                              # for priveleged class we will use our dict
                              privileged_classes=[[pocessed_data_full.get(priveledged)]])
    # Again using our dict
    privileged_groups = [{protected_attr: pocessed_data_full.get(priveledged)}]
    unprivileged_groups = [{protected_attr: pocessed_data_full.get(unpriveledged)}]
    metric_orig_train = BinaryLabelDatasetMetric(dataset,
                                                 unprivileged_groups=unprivileged_groups,
                                                 privileged_groups=privileged_groups)
    mean_diff = metric_orig_train.mean_difference()
    disparate_impact = metric_orig_train.disparate_impact()
    my_json_string = json.dumps(
        {'MeanDifference': mean_diff, 'DisparateImpact': disparate_impact})
    return(my_json_string)


if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=105)
