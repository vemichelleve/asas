import pandas as pd
from .preprocess import *
from .model import *
from sklearn.model_selection import KFold


def avg(rms, mae):
    return (rms + mae) / 2


def buildmodel(questions, answers):
    input_dataset = '/home/mvanessa/pastprojects/finalcode/Augmented_Feat.csv'
    embedmodel = train_word2vec(
        '/home/mvanessa/pastprojects/glove.6B.300d.txt')
    question = '/home/mvanessa/pastprojects/finalcode/questions.csv'
    # input_dataset = '/Users/michellevanessa/Desktop/automatic-text-scoring-master/Final Code and Data/Augmented_Feat.csv'
    # embedmodel = train_word2vec('/Users/michellevanessa/Desktop/automatic-text-scoring-master/glove.6B.300d.txt')
    # question = '/Users/michellevanessa/Desktop/automatic-text-scoring-master/Final Code and Data/questions.csv'

    df = preprocess(questions, answers)
    df = cleaning_dataset(df, input_dataset)

    X, y, scaler_y = scale(df)

    X_train, X_test, y_train, y_test = splittest(X, y, 0.2)

    split = 2  # TODO CHANGE
    index = 0
    train_model = [None] * split
    tokenizer = [None] * split
    rms = [None] * split
    mae = [None] * split
    kfold = KFold(n_splits=split, shuffle=True, random_state=101)

    print('==================== Training ====================')
    for train, test in kfold.split(X_train, y_train):
        print('========== Fold #', index+1, '==========')
        train_model[index], tokenizer[index], model_path = train_lstm(
            X_train.iloc[train], y_train[train], embedmodel)
        test_results = predict(
            X_train.iloc[test], train_model[index], tokenizer[index])
        test_results, y_true = processresult(
            test_results, y_train[test], scaler_y)
        _, rms[index], mae[index] = evaluate(test_results, y_true)
        index += 1
    print('==================== Training done ====================')

    index = 0
    max = avg(rms[0], mae[0])
    for i in range(1, split):
        if avg(rms[i], mae[i]) < max:
            index = i
            max = avg(rms[i], mae[i])

    print('==================== Validation metrics ====================')
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

    return metric, train_model[index], tokenizer[index], df, scaler_y


def score(df_test, model, tokenizer, scaler_y):
    print('==================== Scoring ====================')
    test_results = predict(df_test, model, tokenizer)

    t = []
    for i in range(len(test_results)):
        temp = []
        temp.append(test_results[i])
        t.append(temp)
    test_results = t
    test_results = pd.DataFrame(test_results)
    test_results = scaler_y.inverse_transform(test_results)
    t = []
    for i in range(len(test_results)):
        for x in test_results[i]:
            t.append(x)
    test_results = t

    print('==================== Scoring done ====================')
    return test_results
