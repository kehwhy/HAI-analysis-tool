from flask import Flask, render_template, request, redirect, url_for
import os
from autogluon.tabular import TabularDataset, TabularPredictor
import pandas as pd
from sklearn.model_selection import train_test_split
import json

app = Flask(__name__)

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
        train_data, test_data = train_test_split(df, test_size=0.2)
        save_path = 'agModels-predictClass'  # specifies folder to store trained models
        predictor = TabularPredictor(label=label, path=save_path).fit(
            train_data=train_data, presets='best_quality')
        y_test = test_data[label]  # values to predict
        # delete label column
        test_data_nolabel = test_data.drop(columns=[label])
        # predict
        y_pred = predictor.predict(test_data_nolabel)
        eval = predictor.evaluate_predictions(
            y_true=y_test, y_pred=y_pred, auxiliary_metrics=True)
        my_json_string = json.dumps({'Model': predictor.get_model_best(), 'Evaluation': eval, 'ModelPath': save_path})
        return(my_json_string)

@app.route('/get_model_bias', methods=['POST'])
def get_model_bias():
    path = request.form['save_path']
    # get the model bias file


if (__name__ == "__main__"):
     app.run(host='0.0.0.0', port=105)
