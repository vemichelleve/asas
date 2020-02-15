import pandas as pd
from .preprocess import *
from .model import *


def buildmodel(questions, answers):
    print('======= BUILD =======')

    print('===== PREPROCESS =====')
    df = preprocess(questions, answers)
    df = clean(df)
    X, y = scale(df)
    df, df_test = split(X, y)

    print('===== PREPROCESS DONE =====')
    
    test, train_model, tokenizer = train(df)

    print('======= BUILD DONE =======')

def trial(questions, answers):
    # original data
    input_dataset = '/Users/michellevanessa/Desktop/automatic-text-scoring-master/Final Code and Data/Augmented_Feat.csv'
    df = cleaning_dataset(input_dataset)
    X, y = scale(df)
    print(X)

    df2 = preprocess(questions, answers)
    df2 = clean(df2)
    print(df2)
    X2, y2 = scale(df2)
    print(X2)

    # TODO: split train&test data