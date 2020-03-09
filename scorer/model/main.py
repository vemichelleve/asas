import pandas as pd
from .preprocess import *
from .model import *
from sklearn.model_selection import KFold


def avg(rms, mae):
    return (rms + mae) / 2


def buildmodel(questions, answers):
    # input_dataset = '/home/mvanessa/pastprojects/finalcode/Augmented_Feat.csv'
    # embedmodel = train_word2vec(
    #     '/home/mvanessa/pastprojects/glove.6B.300d.txt')
    # question = '/home/mvanessa/pastprojects/finalcode/questions.csv'
    input_dataset = '/Users/michellevanessa/Desktop/automatic-text-scoring-master/Final Code and Data/Augmented_Feat.csv'
    embedmodel = train_word2vec('/Users/michellevanessa/Desktop/automatic-text-scoring-master/glove.6B.300d.txt')
    question = '/Users/michellevanessa/Desktop/automatic-text-scoring-master/Final Code and Data/questions.csv'

    data = preprocess(questions, answers)
    data = clean(data, input_dataset)
    # df = trial()
    X, y, scaler_y = scale(data)
    # df, df_test, y_test = split(X, y)
    X_train, X_test, y_train, y_test = split(X, y, 0.2)

    split = 2 # TODO CHANGE
    index = 0
    train_model = [None] * split
    tokenizer = [None] * split
    rms = [None] * split
    mae = [None] * split
    kfold = KFold(n_splits=split, shuffle=True, random_state=101)
    
    for train, test in kfold.split(X_train, y_train):
        train_model[index], tokenizer[index] = train(X_train.iloc[train], y_train[train], embedmodel)
        test_results = mpredict(X_train.iloc[test], train_model[index], tokenizer[index])
        test_results, y_true = processresult(test_results, y_train[test], scaler_y)
        _, rms[index], mae[index] = evaluate(test_results, y_true)
        index += 1

    # test, train_model, tokenizer = train(df)
    # test_results = predict(df_test, train_model, tokenizer)
    # test_results, y_true = processresult(test_results, y_test, scaler_y)
    # rho, pearson, rms, mae = evaluate(test_results, y_true)

    index = 0
    max = avg(rms[0], mae[0])
    for i in range(1, split):
        if avg(rms[i], mae[i]) < max:
            index = i
            max = avg(rms[i], mae[i])
    
    test_results = predict(X_test, train_model[index], tokenizer[index])
    test_results, y_true = processresult(test_results, y_test, scaler_y)
    pearson, rmse, maerror = evaluate(test_results, y_true)

    print("Pearson", round(pearson, 4))
    print("RMS", round(rmse, 4))
    print("MAE", round(maerror, 4))

    metric = []
    metric.append({'metric': 'Pearson', 'value': pearson})
    metric.append({'metric': 'RMSE', 'value': rmse})
    metric.append({'metric': 'MAE', 'value': mae})

    return metric, train_model[index], tokenizer[index], data


def trial():
    # original data
    input_dataset = '/Users/michellevanessa/Desktop/automatic-text-scoring-master/Final Code and Data/Augmented_Feat.csv'
    df = cleaning_dataset(input_dataset)

    return df


def score(df_test, model, tokenizer):
    return predict(df_test, model, tokenizer)
