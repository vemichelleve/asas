import pandas as pd
from .embedding import *
from .lstm import *

#initialized required parameters for LSTM network...
EMBEDDING_DIM = 300
MAX_SEQUENCE_LENGTH = 5
VALIDATION_SPLIT = 0.20
RATE_DROP_LSTM = 0.20
RATE_DROP_DENSE = 0.50
NUMBER_LSTM = 500
NUMBER_DENSE_UNITS = 50
ACTIVATION_FUNCTION = 'sigmoid'

def train(df):
    print('===== TRAIN =====')
    answer1 = df['Ref Answer'].tolist()
    answer2 = df['Answer'].tolist()
    scores = df['ans_grade'].tolist()
    
    ## creating answers pairs
    answers_pair = [(x1, x2) for x1, x2 in zip(answer1, answer2)]
    print('=== Created answers pairs ===')
    
    ## add features for feature engineering
    feat = pd.DataFrame(df[['Length Answer', 'Length Ref Answer', 'Len Ref By Ans', 'Words Answer', 'Unique Words Answer']])
    
    # creating word embedding meta data for word embedding 
    tokenizer, embedding_matrix = word_embed_meta_data(answer1 + answer2,  EMBEDDING_DIM)
    embedding_meta_data = {'tokenizer': tokenizer,'embedding_matrix': embedding_matrix}
    print('=== Created word embedding meta data ===')
    
    #SiameneBiLSTM is a class for  Long short Term Memory networks
    siamese = SiameneLSTM(EMBEDDING_DIM ,MAX_SEQUENCE_LENGTH, NUMBER_LSTM, NUMBER_DENSE_UNITS, RATE_DROP_LSTM, RATE_DROP_DENSE, ACTIVATION_FUNCTION, VALIDATION_SPLIT)
    preds, model_path = siamese.train_model(answers_pair, feat, scores, embedding_meta_data, model_save_directory='./')
    #preds, model_path = siamese.train_model(answers_pair, scores, embedding_meta_data, model_save_directory='./')
    
    #load the train data in model...
    model = load_model(model_path)
    print('===== TRAIN DONE =====')
    return preds, model, tokenizer