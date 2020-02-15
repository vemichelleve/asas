import pandas as pd


def wordcount(sentence):
    return len(sentence.split())


def uniquecount(sentence):
    specialchar = [',', '.', '(', ')']
    for i in specialchar:
        sentence = sentence.replace(i, '')
    return len(set(sentence.lower().split()))


def preprocess(questions, answers):
    qns = pd.DataFrame(
        columns=['Ref Ans', 'Length Ref Ans', 'Words Ref Answer', 'Unique Words Ref'])
    for x in questions:
        refans = x.get_refans()
        qns.loc[x.get_pk()] = [refans, len(refans),
                               wordcount(refans), uniquecount(refans)]

    df = pd.DataFrame(list(answers.values()))
    df.rename({'answer': 'Answer'}, axis=1, inplace=True)
    df['ans_grade'] = None
    df['Ref Ans'] = None
    df['Length Answer'] = None
    df['Length Ref Answer'] = None
    for index, row in df.iterrows():
        answer = row['Answer']
        refans = qns.loc[row['question_id']]
        df.at[index, 'ans_grade'] = (row['score1'] + row['score2']) / 2
        df.at[index, 'Ref Ans'] = refans['Ref Ans']
        lenans = len(answer)
        df.at[index, 'Length Answer'] = lenans
        df.at[index, 'Length Ref Answer'] = refans['Length Ref Ans']
        df.at[index, 'Len Ref By Ans'] = refans['Length Ref Ans'] / lenans
        words = wordcount(answer)
        df.at[index, 'Words Answer'] = words
        df.at[index, 'Words Ref Answer'] = refans['Words Ref Answer']
        df.at[index, 'Words Ref By Ans'] = refans['Words Ref Answer'] / words
        unique = uniquecount(answer)
        df.at[index, 'Unique Words Answer'] = unique
        df.at[index, 'Unique Words Ref'] = refans['Unique Words Ref']
        df.at[index, 'Unique Words Ref / Unique Words Answer'] = refans['Unique Words Ref'] / unique
        df.at[index, 'Unique / Words Answer'] = unique / words
        df.at[index, 'Unique / Words Ref Answer'] = refans['Unique Words Ref'] / \
            refans['Words Ref Answer']
