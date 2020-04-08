import pandas as pd
import numpy as np

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

stop = stopwords.words('english')


def wordcount(sentence):
    return len(sentence.split())


def uniquecount(sentence):
    specialchar = [',', '.', '(', ')']
    for i in specialchar:
        sentence = sentence.replace(i, '')
    return len(set(sentence.lower().split()))


def preprocess(questions, answers):
    print('===== Preprocessing =====')
    qns = pd.DataFrame(
        columns=['Ref Answer', 'Length Ref Ans', 'Words Ref Answer', 'Unique Words Ref'])
    for x in questions:
        refans = x.get_refans()
        qns.loc[x.get_pk()] = [refans, len(refans),
                               wordcount(refans), uniquecount(refans)]

    df = pd.DataFrame(list(answers.values()))
    df.rename({'answer': 'Answer'}, axis=1, inplace=True)
    df['ans_grade'] = None
    df['Ref Answer'] = None
    df['Length Answer'] = None
    df['Length Ref Answer'] = None
    for index, row in df.iterrows():
        answer = row['Answer']
        refans = qns.loc[row['question_id']]
        df.at[index, 'ans_grade'] = (row['score1'] + row['score2']) / 2
        df.at[index, 'Ref Answer'] = refans['Ref Answer']
        lenans = len(answer)
        df.at[index, 'Length Answer'] = lenans
        df.at[index, 'Length Ref Answer'] = refans['Length Ref Ans']
        df.at[index, 'Len Ref By Ans'] = refans['Length Ref Ans'] / lenans
        words = wordcount(answer)
        df.at[index, 'Words Answer'] = words
        unique = uniquecount(answer)
        df.at[index, 'Unique Words Answer'] = unique

    return df


def cleaning_dataset(df, input_file):
    print('===== Cleaning =====')
    df_train = pd.read_csv(input_file, encoding='utf-8')
    df_train = df_train.filter(['Answer', 'ans_grade', 'Ref Answer', 'Length Answer',
                                'Length Ref Answer', 'Len Ref By Ans', 'Words Answer',
                                'Unique Words Answer'])

    df = df.drop(['id', 'score1', 'score2', 'question_id', 'systemscore'], axis=1) # TODO: Check!

    df = df.append(df_train)

    df['Ref Answer'] = df['Ref Answer'].astype(str)
    df['Answer'] = df['Answer'].astype(str)

    df['Ref Answer'] = df['Ref Answer'].apply(lambda answer1: answer1.lower())
    df['Answer'] = df['Answer'].apply(lambda answer2: answer2.lower())

    df['Ref Answer'] = df['Ref Answer'].apply(
        lambda x: " ".join(x for x in x.split() if x not in stop))
    df['Answer'] = df['Answer'].apply(
        lambda x: " ".join(x for x in x.split() if x not in stop))

    return df


def scale(df):
    print('===== Scaling =====')
    X = df[['Ref Answer', 'Answer']]
    y = pd.DataFrame(df['ans_grade'])

    # Min Max Scaling of the features used for feature engineering
    x = pd.DataFrame(df['Length Answer'])
    scaler_x = MinMaxScaler()
    scaler_x.fit(x)
    x = scaler_x.transform(x)
    X['Length Answer'] = x

    x = pd.DataFrame(df['Len Ref By Ans'])
    scaler_x2 = MinMaxScaler()
    scaler_x2.fit(x)
    x = scaler_x2.transform(x)
    X['Len Ref By Ans'] = x

    x = pd.DataFrame(df['Words Answer'])
    scaler_x3 = MinMaxScaler()
    scaler_x3.fit(x)
    x = scaler_x3.transform(x)
    X['Words Answer'] = x

    x = pd.DataFrame(df['Length Ref Answer'])
    scaler_x4 = MinMaxScaler()
    scaler_x4.fit(x)
    x = scaler_x4.transform(x)
    X['Length Ref Answer'] = x

    x = pd.DataFrame(df['Unique Words Answer'])
    scaler_x5 = MinMaxScaler()
    scaler_x5.fit(x)
    x = scaler_x5.transform(x)
    X['Unique Words Answer'] = x

    scaler_y = MinMaxScaler()
    scaler_y.fit(y)
    y = scaler_y.transform(y)

    return X, y, scaler_y


def splittest(X, y, split):
    print('===== Splitting dataset =====')
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=split, random_state=101)

    return X_train, X_test, y_train, y_test


# def cleaning_dataset(input_file):
#     df_train = pd.read_csv(input_file, encoding='unicode escape')

#     # Pre-Processing...
#     # convert all answers to string format...
#     df_train['Ref Answer'] = df_train['Ref Answer'].astype(str)
#     df_train['Answer'] = df_train['Answer'].astype(str)

#     # convert all answers to lower case...
#     df_train['Ref Answer'] = df_train['Ref Answer'].apply(
#         lambda answer1: answer1.lower())
#     df_train['Answer'] = df_train['Answer'].apply(
#         lambda answer2: answer2.lower())

#     # Remove of Stop Words from answers...
#     df_train['Ref Answer'] = df_train['Ref Answer'].apply(
#         lambda x: " ".join(x for x in x.split() if x not in stop))
#     df_train['Answer'] = df_train['Answer'].apply(
#         lambda x: " ".join(x for x in x.split() if x not in stop))

    # return df_train
