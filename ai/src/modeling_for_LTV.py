from glob import glob
from datetime import datetime
import dateutil

import numpy as np
import pandas as pd

from ai.src.utils.utils import *

def LTV_model(folder_path: str, verbose: bool=False):

    # Load data
    DF = pd.read_csv(folder_path+"returning_guests_processed.csv")
    if 'GROUP_OF(Lifetime)' in list(DF.columns):
        DF.drop(columns=['GROUP_OF(Lifetime)'], inplace=True)
    DF.dropna(inplace=True)

    # Define some parameters
    MIN_LIFETIME = DF.Lifetime.describe().loc['50%']

    # Split DataFrame
    df = dict()
    df['long_time'] = DF[DF.Lifetime >= MIN_LIFETIME]
    df['short_time'] = DF[DF.Lifetime < MIN_LIFETIME]
    if len(df['long_time']['GuestID'].unique().tolist()) <= 10:
        df['long_time'] = DF.copy()
    # Check divergence of features between short-term and long-term customers
    # diverged_features = check_features_diverged(df['long_time'], 
    #                                             df['short_time'],
    #                                             exclude_columns=['TotalRevenue', 'NumberOfOrders', 'InactiveDays', 'Lifetime', 'GuestID'],
    #                                             verbose=False)
    
    # Model Segmentation
    CLUSTEROR = dict()
    K_CLUSTERS = dict()
    WEIGHTS = {'Recency': 1, 'Frequency': 3, 'Monetary': 5}
    for feature, cluster, ascending in zip(['InactiveDays', 'NumberOfOrders', 'TotalRevenue'],
                                           ['Recency', 'Frequency', 'Monetary'], 
                                           [False, True, True]):
        df['long_time'], best_k, model = feature_clustering(df['long_time'], feature, cluster+'_Cluster', ascending)
        CLUSTEROR[cluster] = model
        K_CLUSTERS[cluster] = best_k

        # print('\n\n')
        # print(df['long_time'].groupby(cluster+'_Cluster')[feature].describe())

    df['long_time']['RFM_Score'] = WEIGHTS['Recency'] / K_CLUSTERS['Recency'] * df['long_time']['Recency_Cluster'] \
                               + WEIGHTS['Frequency'] / K_CLUSTERS['Frequency'] * df['long_time']['Frequency_Cluster'] \
                                + WEIGHTS['Monetary'] / K_CLUSTERS['Monetary'] * df['long_time']['Monetary_Cluster']
    df['long_time']['Estimated_LTV'] = (df['long_time'].TotalRevenue / df['long_time'].NumberOfOrders) ** (1 / (1+df['long_time'].InactiveDays/365.25))
    df['long_time'], _, model = feature_clustering(df['long_time'], 
                                                   feature_name='RFM_Score', 
                                                   cluster_name='LTV_Cluster', 
                                                   ascending=True, 
                                                   reorder_by_feature='Estimated_LTV', 
                                                   best_k=3)
    # df['long_time'][['GuestID', 'LTV_Cluster']].to_csv(folder_path+'LTV_class_of_long_time_guests.csv', index=False)

    # Convert to probability
    df['long_time']['LTV_Class'] = df['long_time']['LTV_Cluster'].map(
        {1: 'CLV_Low_Prob', 2: 'CLV_Mid_Prob', 3: 'CLV_High_Prob'}
    )
    df['long_time'] = pd.concat([df['long_time'], 
                                 pd.get_dummies(df['long_time'].LTV_Class)], axis=1)
    df['long_time'][
        ['GuestID', 'LTV_Class', 'CLV_Low_Prob', 'CLV_Mid_Prob', 'CLV_High_Prob']
    ].to_csv(folder_path+'LTV_class_of_long_time_guests.csv', index=False)

    # Model Classification
    df['long_time'].drop(columns=['Estimated_LTV', 'RFM_Score', 
                                  'InactiveDays', 'NumberOfOrders', 'TotalRevenue', 
                                  'Recency_Cluster', 'Frequency_Cluster', 'Monetary_Cluster',
                                  'LTV_Class', 'CLV_Low_Prob', 'CLV_Mid_Prob', 'CLV_High_Prob'],
                         errors='ignore', 
                         inplace=True)
    X, Y, target_weights = preprocess_for_classifier(df['long_time'], 
                                                    target_name='LTV_Cluster', 
                                                    id_cols=['GuestID', 'Lifetime'])
    classifier = XGBClassifier(max_depth=5, 
                               learning_rate=0.1, 
                               objective='multi:softprob', 
                               n_jobs=-1)
    classifier.fit(X['train'], Y['train'], 
                   sample_weight=target_weights.values, 
                   eval_metric=["mlogloss"], 
                   eval_set=[(X['train'], Y['train']), (X['test'], Y['test'])], 
                   early_stopping_rounds=7,
                   verbose=verbose)
    if verbose:
        visualize_results(classifier, X, Y)

    X['infer'] = df['short_time'].copy()
    unused_features = []
    for col in X['infer'].columns:
        if col not in list(X['train'].columns):
            unused_features.append(col)

    X['infer'].drop(columns=unused_features, inplace=True)
    df['short_time'][['CLV_Low_Prob', 'CLV_Mid_Prob', 'CLV_High_Prob']] = classifier.predict_proba(X['infer'])
    df['short_time'].sort_values(by=['GuestID'], inplace=True)
    df['short_time']['LTV_Cluster'] = df['short_time'][['CLV_Low_Prob', 'CLV_Mid_Prob', 'CLV_High_Prob']].apply(np.argmax, axis=1)
    df['short_time']['LTV_Cluster'] += 1
    df['short_time']['LTV_Class'] = df['short_time']['LTV_Cluster'].map(
        {1: 'CLV_Low_Prob', 2: 'CLV_Mid_Prob', 3: 'CLV_High_Prob'}
    )
    df['short_time'][
        ['GuestID', 'LTV_Class', 'CLV_Low_Prob', 'CLV_Mid_Prob', 'CLV_High_Prob']
    ].to_csv(folder_path+'LTV_class_of_short_time_guests.csv', index=False)


if __name__ == "__main__":
    folder_path = "C:/Users/HCG/Hash Consulting Grp Pte Ltd/AIML - Documents/General/DSKPO1 - Research and Development/3. Develop/DEVrupt Hospitality/SourceCode/output/"
    LTV_model(folder_path, True)









