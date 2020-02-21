import pandas as pd
from .embedding import *
from .lstm import *
from scipy.stats import spearmanr
from scipy.stats import pearsonr
from sklearn.metrics import mean_squared_error, mean_absolute_error
from math import sqrt

# initialized required parameters for LSTM network...
EMBEDDING_DIM = 300
MAX_SEQUENCE_LENGTH = 5
VALIDATION_SPLIT = 0.20
RATE_DROP_LSTM = 0.20
RATE_DROP_DENSE = 0.50
NUMBER_LSTM = 500
NUMBER_DENSE_UNITS = 50
ACTIVATION_FUNCTION = 'sigmoid'


def train(df):
    answer1 = df['Ref Answer'].tolist()
    answer2 = df['Answer'].tolist()
    scores = df['ans_grade'].tolist()

    # creating answers pairs
    answers_pair = [(x1, x2) for x1, x2 in zip(answer1, answer2)]

    # add features for feature engineering
    feat = pd.DataFrame(df[['Length Answer', 'Length Ref Answer',
                            'Len Ref By Ans', 'Words Answer', 'Unique Words Answer']])

    # creating word embedding meta data for word embedding
    tokenizer, embedding_matrix = word_embed_meta_data(
        answer1 + answer2,  EMBEDDING_DIM)
    embedding_meta_data = {'tokenizer': tokenizer,
                           'embedding_matrix': embedding_matrix}

    # SiameneBiLSTM is a class for  Long short Term Memory networks
    siamese = SiameneLSTM(EMBEDDING_DIM, MAX_SEQUENCE_LENGTH, NUMBER_LSTM, NUMBER_DENSE_UNITS,
                          RATE_DROP_LSTM, RATE_DROP_DENSE, ACTIVATION_FUNCTION, VALIDATION_SPLIT)
    preds, model_path = siamese.train_model(
        answers_pair, feat, scores, embedding_meta_data, model_save_directory='./')
    #preds, model_path = siamese.train_model(answers_pair, scores, embedding_meta_data, model_save_directory='./')

    # load the train data in model...
    model = load_model(model_path)
    return preds, model, tokenizer


def predict(df_test, model, tokenizer):
    answer1_test = df_test['Ref Answer'].values.tolist()
    answer2_test = df_test['Answer'].values.tolist()

    # creating answers pairs
    answers_test_pair = [(x1, x2)
                         for x1, x2 in zip(answer1_test, answer2_test)]

    # features input
    feat = pd.DataFrame(df_test[['Length Answer', 'Length Ref Answer',
                                 'Len Ref By Ans', 'Words Answer', 'Unique Words Answer']])

    test_data_x1, test_data_x2, feat, leaks_test = create_test_data(
        tokenizer, answers_test_pair, feat, MAX_SEQUENCE_LENGTH)

    # predict the results
    preds = list(model.predict(
        [test_data_x1, test_data_x2, feat, leaks_test], verbose=1).ravel())

    return preds


def processresult(test_results,  y_test, scaler_y):
    y_true = y_test.tolist()
    y_true = scaler_y.inverse_transform(y_true)
    y_t = []
    for i in range(len(y_true)):
        for x in y_true[i]:
            y_t.append(x)
    y_true = y_t

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

    return test_results, y_true


def evaluate(test_results, y_true):
    rho, p = spearmanr(test_results, y_true)
    pearson, pval = pearsonr(test_results, y_true)
    rms = sqrt(mean_squared_error(test_results, y_true))
    mae = mean_absolute_error(test_results, y_true)

    print("Spearman", rho)
    print("Pearson", pearson)
    print("RMS", rms)
    print("MAE", mae)

    return rho, pearson, rms, mae
