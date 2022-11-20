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
import ast
import itertools
from itertools import permutations

app = Flask(__name__)

filelist = ['workfile.csv', 'workfile_train.csv',
            'workfile_test.csv', 'workfile_test_predictions.csv', 'workfile_train_processed']
models_dir = 'agModels-predictClass'
protected_attributes = ['age_cat', 'sex', 'race']
compas_catagorical_feature_list = [
    "sex", "age_cat", "race", "c_days_from_compas", "c_charge_degree", "c_charge_desc"]

# Have to put these here for now
processed_data_full = {'Male': 1, 'Female': 0, 'age_cat_greater_than_45': 1,
                 'age_cat_25_to_45': 0, 'age_cat_less_than_25': 2, 'African-American': 0, 'Asian': 1,
                 'Caucasion': 2, 'Hispanic': 3, 'Native-American': 4, 'Other': 5}

# split them up so we can return the correct list of values to frontend
processed_data_sex = {'Male': 1, 'Female': 0}
processed_data_age_cat = {'age_cat_greater_than_45': 1,
                          'age_cat_25_to_45': 0, 'age_cat_less_than_25': 2}
processed_data_race = {'African-American': 0, 'Asian': 1,
                       'Caucasion': 2, 'Hispanic': 3, 'Native American': 4, 'Other': 5}

# For continuous page
sex_perms = ['Male', 'Female']
age_cat_perms = ['Greater than 45', '25-45', 'Less than 25']
race_perms = ['Other', 'African-American',
              'Hispanic', 'Asian', 'Native American']
protected_atrributes = [sex_perms, age_cat_perms, race_perms]

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

        # If we've already trained the model then lets just load it (REMOVE IF TOOL IS EXPANDED PAST COMPAS)
        if path.isdir(models_dir):
            predictor = TabularPredictor.load(models_dir)
        else:
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
    # KEEP COMMENTED BECAUSE TRAINING THE MODEL TAKES SO LONG
    # if path.isdir(models_dir):
        # shutil recursively removes files and directories residing in given path
        # shutil.rmtree('agModels-predictClass')
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
        {'Values': processed_data_sex})
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
        df[label].mask(df[label] == 0, 0, inplace=True)
        df[label].mask(df[label] >= 2, 1, inplace=True)
        df.fillna(0)
        # process catagorial data into numerical data
        oe = OrdinalEncoder()
        df[compas_catagorical_feature_list] = oe.fit_transform(
            df[[compas_catagorical_feature_list]])
        # save it
        df.to_csv(filelist[4], encoding='utf-8', index=False)

    # Read OE encoded dataset to use for standard dataset
    df = pd.read_csv(filelist[4])
    # now that we have the binary encoding for scores we can calculate bias metrics
    dataset = StandardDataset(df,
                              label_name=label,
                              # 0 represents low recidivism score
                              favorable_classes=[0],
                              protected_attribute_names=[protected_attr],
                              # for priveleged class we will use our dict
                              privileged_classes=[[processed_data_full.get(priveledged)]])
    # Again using our dict
    privileged_groups = [{protected_attr: processed_data_full.get(priveledged)}]
    unprivileged_groups = [{protected_attr: processed_data_full.get(unpriveledged)}]
    metric_orig_train = BinaryLabelDatasetMetric(dataset,
                                                 unprivileged_groups=unprivileged_groups,
                                                 privileged_groups=privileged_groups)
    mean_diff = metric_orig_train.mean_difference()
    disparate_impact = metric_orig_train.disparate_impact()
    my_json_string = json.dumps(
        {'MeanDifference': mean_diff, 'DisparateImpact': disparate_impact})
    return(my_json_string)

# calculate permutations
@app.route('/generate/continuous', methods=['POST'])
def calculate_permutation():
    # get json input
    req = request.get_json
    label = req.get('label')
    # this should be in the form of a dict from frontend of the default row generated earlier
    default_row = req.get('default')
    # make sure its in the form of a dict 
    default_row = ast.literal_eval(default_row)
    # get all permutations of protected attributes
    all_permutations = list(itertools.product(*protected_atrributes))

    output = pd.DataFrame()
    for permutation in all_permutations:
        default_row['sex'] = permutation[0]
        default_row['age_cat'] = permutation[1]
        default_row['race'] = permutation[2]
        output = output.append(default_row, ignore_index=True)
    # Now predict the y column
    predictor = TabularPredictor.load(models_dir)
    y_pred = predictor.predict(output)  
    # append predictions
    output[label] = y_pred

    return(output.to_json(orient = "records"))

# calculate proactive
@app.route('/generate/proactive', methods=['POST'])
def calculate_proactive():
    # get json input
    req = request.get_json
    label = req.get('label')

    # protected attributes who are the most unpriveledged overall
    total_dict_unpriveledged_mean = {}
    # protected attributes who have the highest benefit overall
    total_dict_higher_benefit = {}

    # Only create this processed data once
    if not path.isfile(filelist[4]):
        df = pd.read_csv(filelist[2])
        # 0 is desirable, 1 is not desirable
        df[label].mask(df[label] == 0, 0, inplace=True)
        df[label].mask(df[label] >= 2, 1, inplace=True)
        df.fillna(0)
        # process catagorial data into numerical data
        oe = OrdinalEncoder()
        df[compas_catagorical_feature_list] = oe.fit_transform(
            df[[compas_catagorical_feature_list]])
        # save it
        df.to_csv(filelist[4], encoding='utf-8', index=False)
    
    # Read OE encoded dataset to use for standard dataset
    df = pd.read_csv(filelist[4])

    # FIRST WE DO SEX
    dataset = StandardDataset(df,
                            label_name=label,
                            # 0 represents low recidivism score
                            favorable_classes=[0],
                            protected_attribute_names=['sex'],
                            # for priveleged class we will use our dict
                            privileged_classes=[[0]]) # Female
    # Again using our dict
    privileged_groups = [{'sex': 0}] # Female
    unprivileged_groups = [{'sex': 1}] # Male
    metric_orig_train = BinaryLabelDatasetMetric(dataset,
                                                    unprivileged_groups=unprivileged_groups,
                                                    privileged_groups=privileged_groups)
    # A negative value indicates less favorable outcomes for the unprivileged groups.
    mean_diff = metric_orig_train.mean_difference()
    # The ideal value of this metric is 1.0 A value < 1 implies higher benefit for the privileged group and a 
    # value >1 implies a higher benefit for the unprivileged group.
    disparate_impact = metric_orig_train.disparate_impact()
    if mean_diff < 0:
        sex_unpriveledged_mean = (list(processed_data_sex.keys())[list(processed_data_sex.values()).index(1)])
        total_dict_unpriveledged_mean[sex_unpriveledged_mean] = mean_diff
    if disparate_impact < 1:
        higher_benefit_priveledged = (list(processed_data_sex.keys())[list(processed_data_sex.values()).index(0)])
        total_dict_higher_benefit[higher_benefit_priveledged] = disparate_impact

    # !
    # NEXT WE DO AGE CATEGORY

    # These are all possible ordered pairs of age_cat
    permutations_age_cat = list( permutations( range( 3 ), 2 ) )
    # These 2 values are used while going through all combinations
    lowest_mean_diff = 0
    lowest_disparate_impact = 1 

    # These will be used to count the occurrences since we go through all combos
    # (might be fun to see in front end)
    mean_list_unpriveledged_age = []
    disparate_impact_list_benefit_age = []

    for combination in permutations_age_cat:
        dataset = StandardDataset(df,
                                label_name=label,
                                # 0 represents low recidivism score
                                favorable_classes=[0],
                                protected_attribute_names=['age_cat'],
                                # for priveleged class we will use our dict
                                privileged_classes=[[combination[0]]])
        # Again using our dict
        privileged_groups = [{'age_cat': combination[0]}]
        unprivileged_groups = [{'age_cat': combination[1]}]
        metric_orig_train = BinaryLabelDatasetMetric(dataset,
                                                        unprivileged_groups=unprivileged_groups,
                                                        privileged_groups=privileged_groups)
        
        mean_diff = metric_orig_train.mean_difference()
        disparate_impact = metric_orig_train.disparate_impact()
        
        if mean_diff < 0:
            if mean_diff < lowest_mean_diff:
                least_priveledged = combination[1]
                lowest_mean_diff = mean_diff
            age_unpriveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(combination[1])])
            mean_list_unpriveledged_age.append(age_unpriveledged)

        if disparate_impact < 1:
            if disparate_impact < lowest_disparate_impact:
                highest_priveledged = combination[0]
                lowest_disparate_impact = disparate_impact
            higher_benefit_priveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(combination[0])])
            disparate_impact_list_benefit_age.append(higher_benefit_priveledged)

    age_unpriveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(least_priveledged)])
    # Add to our total least priveledged list
    total_dict_unpriveledged_mean[age_unpriveledged] = lowest_mean_diff

    higher_benefit_priveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(highest_priveledged)])
    # Add to our total highest benefit list
    total_dict_higher_benefit[higher_benefit_priveledged] = lowest_disparate_impact   

    # Now we get number of occurences that each value was unpriveledged in mean_difference
    age_list = ['age_cat_greater_than_45', 'age_cat_25_to_45', 'age_cat_less_than_25']
    # To return
    age_mean_least_counts = {}
    for val in age_list:
        c = mean_list_unpriveledged_age.count(val)
        age_mean_least_counts[val] = c

    # To return
    age_highest_benefit_counts = {}
    for val in age_list:
        c = disparate_impact_list_benefit_age.count(val)
        age_highest_benefit_counts[val] = c
    
    # !
    # NOW FINALLY RACE

    permutations_race = permutations_age_cat = list( permutations( range( 6 ), 2 ) )
    # reset values
    lowest_mean_diff = 0
    lowest_disparate_impact = 1 

    mean_list_unpriveledged_race = []
    disparate_impact_list_benefit_race = []
    for combination in permutations_race:
        dataset = StandardDataset(df,
                                label_name=label,
                                # 0 represents low recidivism score
                                favorable_classes=[0],
                                protected_attribute_names=['race'],
                                # for priveleged class we will use our dict
                                privileged_classes=[[combination[0]]])
        # Again using our dict
        privileged_groups = [{'race': combination[0]}]
        unprivileged_groups = [{'race': combination[1]}]
        metric_orig_train = BinaryLabelDatasetMetric(dataset,
                                                        unprivileged_groups=unprivileged_groups,
                                                        privileged_groups=privileged_groups)
    
        mean_diff = metric_orig_train.mean_difference()
        disparate_impact = metric_orig_train.disparate_impact()


        if mean_diff < 0:
            if mean_diff < lowest_mean_diff:
                least_priveledged = combination[1]
                lowest_mean_diff = mean_diff
            race_unpriveledged = (list(processed_data_race.keys())[list(processed_data_race.values()).index(combination[1])])
            mean_list_unpriveledged_race.append(race_unpriveledged)

        if disparate_impact < 1:
            if disparate_impact < lowest_disparate_impact:
                highest_priveledged = combination[0]
                lowest_disparate_impact = disparate_impact
            higher_benefit_priveledged = (list(processed_data_race.keys())[list(processed_data_race.values()).index(combination[0])])
            disparate_impact_list_benefit_race.append(higher_benefit_priveledged)

    race_unpriveledged = (list(processed_data_race.keys())[list(processed_data_race.values()).index(least_priveledged)])
    total_dict_unpriveledged_mean[race_unpriveledged] = lowest_mean_diff

    higher_benefit_priveledged = (list(processed_data_race.keys())[list(processed_data_race.values()).index(highest_priveledged)])
    total_dict_higher_benefit[higher_benefit_priveledged] = lowest_disparate_impact   

    race_list = ['African-American', 'Asian', 'Caucasion', 'Hispanic', 'Native American', 'Other']
    race_mean_least_counts = {}
    for val in race_list:
        c = mean_list_unpriveledged_race.count(val)
        race_mean_least_counts[val] = c

    # To return
    race_highest_benefit_counts = {}
    for val in race_list:
        c = disparate_impact_list_benefit_race.count(val)
        race_highest_benefit_counts[val] = c


    my_json_string = json.dumps(
        {'Age_Negative_Mean_Occurences': age_mean_least_counts, 'Race_Negative_Mean_Occurences': race_mean_least_counts,
        'Age_Highest_Benefit_Occurrences': age_highest_benefit_counts, 'Race_Highest_Benefit_Occurrences': race_highest_benefit_counts,
        'Total_Least_Priveledged_Attributes_Mean': total_dict_unpriveledged_mean, 'Total_Highest_Benefit_Disparate': total_dict_higher_benefit})
    return(my_json_string)


if (__name__ == "__main__"):
    app.run(host='0.0.0.0', port=105)
