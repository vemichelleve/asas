import pandas as pd
from .preprocess import *
from .model import *


def buildmodel(questions, answers):
    print('======= BUILD =======')

    print('===== PREPROCESS =====')
    data = preprocess(questions, answers)
    data = clean(data)
    # df = trial()
    X, y, scaler_y = scale(data)
    df, df_test, y_test = split(X, y)

    print('===== PREPROCESS DONE =====')
    
    test, train_model, tokenizer = train(df)
    test_results = predict(df_test, train_model, tokenizer)
    test_results, y_true = processresult(test_results, y_test, scaler_y)
    rho, pearson, rms, mae = evaluate(test_results, y_true)

    metric = []
    metric.append({'metric': 'Spearman', 'value': rho})
    metric.append({'metric': 'Pearson', 'value': pearson})
    metric.append({'metric': 'RMS', 'value': rms})
    metric.append({'metric': 'MAE', 'value': mae})

    print('======= BUILD DONE =======')

    return metric, train_model, tokenizer, data

def trial():
    # original data
    input_dataset = '/Users/michellevanessa/Desktop/automatic-text-scoring-master/Final Code and Data/Augmented_Feat.csv'
    df = cleaning_dataset(input_dataset)

    return df

def score(data, model, tokenizer):
    return predict(data, model, tokenizer)