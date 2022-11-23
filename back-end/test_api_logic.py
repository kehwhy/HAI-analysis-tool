# from autogluon.tabular import TabularDataset, TabularPredictor
# train_data = TabularDataset('https://autogluon.s3.amazonaws.com/datasets/Inc/train.csv')
# f = open('/workfile.txt', 'r+')
# f.write(train_data)
# subsample_size = 500  # subsample subset of data for faster demo, try setting this to much larger values
# train_data = train_data.sample(n=subsample_size, random_state=0)
# train_data.head()
# label = 'class'
# print("Summary of class variable: \n", train_data[label].describe())
# save_path = 'agModels-predictClass'  # specifies folder to store trained models
# predictor = TabularPredictor(label=label, path=save_path).fit(train_data)
# test_data = TabularDataset('https://autogluon.s3.amazonaws.com/datasets/Inc/test.csv')
# y_test = test_data[label]  # values to predict
# test_data_nolab = test_data.drop(columns=[label])  # delete label column to prove we're not cheating
# test_data_nolab.head()
# predictor = TabularPredictor.load(save_path)  # unnecessary, just demonstrates how to load previously-trained predictor from file
# y_pred = predictor.predict(test_data_nolab)
# test_data_nolab[label] = y_pred
# test_data_nolabel.to_csv(filelist[3],encoding='utf-8', index=False)F

# print("Predictions:  \n", y_pred)
# perf = predictor.evaluate_predictions(y_true=y_test, y_pred=y_pred, auxiliary_metrics=True)

# import os
# import os.path
# from os import path
# # import aif360.datasets.compas_dataset


# # filelist = ['workfile.csv', 'workfile_test.csv', 'workfile_train.csv', 'workfile_test_predictions.csv']
# # for file in filelist:
# #     if path.isfile(file):
# #         os.remove(file)
# import pandas as pd
# # protected_attributes = ['age', 'sex', 'race', 'gender', 'ethnicity',
# #                         'marital status', 'religion', 'national origin',
# #                         'public assistance', 'disability', 'pregnancy', 'maternity']
# # df = pd.read_csv('workfile.csv')
# # print(list(df))
# # present_protected_attributes = []
# # for attr in df:
# #     for prot in protected_attributes:
# #         if prot in attr:
# #             present_protected_attributes.append(attr)

# # print(present_protected_attributes)
from aif360.datasets import StandardDataset
from aif360.metrics import BinaryLabelDatasetMetric
from sklearn.preprocessing import OrdinalEncoder
import pandas as pd
from itertools import permutations

label = 'decile_score'
# protected_attr = 'sex'
# priveledged = 'Female'
# unpriveledged = 'Male'
df = pd.read_csv('compas-scores-low-med-high.csv')
# df[label].mask(df[label] <= 4, 0, inplace=True)
# df[label].mask(df[label] >= 5, 1, inplace=True)

# print(df.head())
# df.fillna(0)


# # # now that we have the binary encoding for scores we can calculate bias metrics
oe = OrdinalEncoder()
df[["sex", "age_cat", "race", "c_days_from_compas", "c_charge_degree", "c_charge_desc"]] = oe.fit_transform(
    df[["sex", "age_cat", "race", "c_days_from_compas", "c_charge_degree", "c_charge_desc"]])
df.to_csv("compas-scores-orig-processed.csv", encoding='utf-8', index=False)

df[label].mask(df[label] == 0, 0, inplace=True)
df[label].mask(df[label] >= 2, 1, inplace=True)
df.fillna(0)

# print(df.head())
# dataset = StandardDataset(df,
#                           label_name=label,
#                           favorable_classes=[0],
#                           protected_attribute_names=[protected_attr],
#                           privileged_classes=[[0]])

# privileged_groups = [{protected_attr: 0}]
# unprivileged_groups = [{protected_attr: 1}]
# metric_orig_train = BinaryLabelDatasetMetric(dataset,
#                                              unprivileged_groups=unprivileged_groups,
#                                              privileged_groups=privileged_groups)

# print(metric_orig_train.mean_difference())
# print(metric_orig_train.disparate_impact())

# if not path.isfile('woo.csv'):
#     print('it works')
# from flask import Flask, render_template, request
# from autogluon.tabular import TabularPredictor
import pandas as pd
from sklearn.model_selection import train_test_split
# import json
# import os
# import shutil
import os.path
# from os import path
import itertools

# label = 'decile_score'
# df = pd.read_csv('compas-scores-orig2.csv')
# make all headers lowercase
# df.columns = df.columns.str.lower()
# # make client label input all lowercase
# label = label.lower()
# df[label].mask(df[label] <= 4, 0, inplace=True)
# df[label].mask(df[label].between(5,7), 1, inplace=True)
# df[label].mask(df[label] >= 8, 2, inplace=True)
# df.fillna(0)

# split the csv into train and test data
# train_data, test_data = train_test_split(df, test_size=0.2)
# # save test and train csv's
# df.to_csv('low_medium_high.csv', encoding='utf-8', index=False)

# models_dir = 'agModels-predictClass'
# predictor = TabularPredictor(label=label, path=models_dir).fit(
#     train_data=train_data, presets='best_quality')
# y_test = test_data[label]  # values to predict
# # delete label column
# test_data_nolabel = test_data.drop(columns=[label])
# # predict
# y_pred = predictor.predict(test_data_nolabel)
# save predictions
# test_data = test_data_nolabel
# test_data_nolabel[label] = y_pred
# test_data_nolabel.to_csv('compas-test.csv',
#                             encoding='utf-8', index=False)
# get random row like in the code
# df = test_data.sample()

# get protected attributes permutations
# protected_attributes = ['age_cat', 'sex', 'race']
# need to make a new df with all permutations of 3 columns
# sex_perms = ['Male', 'Female']
# age_cat_perms = ['Greater than 45', '25-45', 'Less than 25']
# race_perms = ['Other', 'African-American',
#               'Hispanic', 'Asian', 'Native American']
# protected_atrributes = [sex_perms, age_cat_perms, race_perms]
# all_permutations = list(itertools.product(*protected_atrributes))
# print(all_permutations)

# new_df = df.reset_index()
# new_dict = new_df.to_dict('records')
# my_dict = new_dict[0]
# del my_dict['index']

# output = pd.DataFrame()
# # create new df with all permutations
# for permutation in all_permutations:
#     my_dict['sex'] = permutation[0]
#     my_dict['age_cat'] = permutation[1]
#     my_dict['race'] = permutation[2]
#     print(my_dict)
#     output = output.append(my_dict, ignore_index=True)

# print(output.head())
# predictor = TabularPredictor.load(models_dir)
# y_pred = predictor.predict(output)
# # append predictions
# output[label] = y_pred
# # save
# output.to_csv('permutations_csv',
#                                  encoding='utf-8', index=False)

# protected attributes who are the most unpriveledged overall
total_dict_unpriveledged_mean = {}
# protected attributes who have the highest benefit overall
total_dict_higher_benefit = {}

protected_attributes = ['age_cat', 'sex', 'race']
processed_data_sex = {'Male': 1, 'Female': 0}
processed_data_age_cat = {'age_cat_greater_than_45': 1,
                          'age_cat_25_to_45': 0, 'age_cat_less_than_25': 2}
processed_data_race = {'African-American': 0, 'Asian': 1,
                       'Caucasion': 2, 'Hispanic': 3, 'Native American': 4, 'Other': 5}

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
    key = "{}_mean : {}".format(sex_unpriveledged_mean, mean_diff)
    print(key)
if disparate_impact < 1:
    higher_benefit_priveledged = (list(processed_data_sex.keys())[list(processed_data_sex.values()).index(0)])
    total_dict_higher_benefit[higher_benefit_priveledged] = disparate_impact
    key = "{}_disparate_benefit: {}".format(higher_benefit_priveledged, disparate_impact)
    print(key)
# if disparate_impact > 1:
#     higher_benefit_unpriveledged = (list(pocessed_data_sex.keys())[list(pocessed_data_sex.values()).index(1)])
#     total_dict_higher_benefit[higher_benefit_unpriveledged] = disparate_impact
#     key = "{}_disparate_benefit: {}".format(higher_benefit_unpriveledged, disparate_impact)
#     print(key)



permutations_age_cat = list( permutations( range( 3 ), 2 ) )
lowest_mean_diff = 0
lowest_disparate_impact = 1 
mean_list_unpriveledged = []
disparate_impact_list_benefit = []

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
    
    if mean_diff < 0 and mean_diff < lowest_mean_diff:
        least_priveledged = combination[1]
        lowest_mean_diff = mean_diff
        age_unpriveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(least_priveledged)])
        mean_list_unpriveledged.append(age_unpriveledged)

    if disparate_impact < 1 and disparate_impact < lowest_disparate_impact:
        highest_priveledged = combination[0]
        lowest_disparate_impact = disparate_impact
        higher_benefit_priveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(highest_priveledged)])
        disparate_impact_list_benefit.append(higher_benefit_priveledged)

age_unpriveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(least_priveledged)])
total_dict_unpriveledged_mean[age_unpriveledged] = lowest_mean_diff
key = "{}_mean : {}".format(age_unpriveledged, lowest_mean_diff)
print(key)

higher_benefit_priveledged = (list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(highest_priveledged)])
total_dict_higher_benefit[higher_benefit_priveledged] = lowest_disparate_impact   

key = "{}_disparate_benefit: {}".format(higher_benefit_priveledged, lowest_disparate_impact)
print(key)

age_list = ['age_cat_greater_than_45', 'age_cat_25_to_45', 'age_cat_less_than_25']

age_mean_least_counts = {}
for val in age_list:
    c = mean_list_unpriveledged.count(val)
    age_mean_least_counts[val] = c

# To return
age_highest_benefit_counts = {}
for val in age_list:
    c = disparate_impact_list_benefit.count(val)
    age_highest_benefit_counts[val] = c
# print((list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(least_priveledged)]))
# print((list(processed_data_age_cat.keys())[list(processed_data_age_cat.values()).index(compared_to)]))
# print(worst)

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

print("\nAge Category: unpriveledged occurences - mean diffence")
print(age_mean_least_counts)
print("\nAge Category: higher benefit occurrences - disparate impact")
print(age_highest_benefit_counts)

print("\nRace: unpriveledged occurences - mean diffence")
print(race_mean_least_counts)
print("\nRace: higher benefit occurrences - disparate impact")
print(race_highest_benefit_counts)

print("\nTotal: Highest benefitting attribute - disparate impact")
print(total_dict_higher_benefit)
print("\nTotal: Most Unpriveledged attribute - mean difference")
print(total_dict_unpriveledged_mean)
# print((list(processed_data_race.keys())[list(processed_data_race.values()).index(least_priveledged)]))
# print((list(processed_data_race.keys())[list(processed_data_race.values()).index(compared_to)]))
# # print(worst_mean)
# print(least_priveledged_list)
# print(max(set(least_priveledged_list), key=least_priveledged_list.count))
# print("Most unpriveledged to Least")
# for i in range (5):
#     print(least_priveledged_list.count(i))
# for unpriv in least_priveledged_list:
#     print((list(processed_data_race.keys())[list(processed_data_race.values()).index(unpriv)]))













dataset = StandardDataset(df,
                            label_name=label,
                            # 0 represents low recidivism score
                            favorable_classes=[0],
                            protected_attribute_names=['race'],
                            # for priveleged class we will use our dict
                            privileged_classes=[[0]])
    # Again using our dict
privileged_groups = [{'race': 0}]
unprivileged_groups = [{'race': 4}]
metric_orig_train = BinaryLabelDatasetMetric(dataset,
                                                unprivileged_groups=unprivileged_groups,
                                                privileged_groups=privileged_groups)

mean_diff = metric_orig_train.mean_difference()
disparate_impact = metric_orig_train.disparate_impact()
print(mean_diff)

# from itertools import permutations
# all_combinations = list( permutations( range( 6 ), 2 ) )
# print(all_combinations)
