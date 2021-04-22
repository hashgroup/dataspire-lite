import os
import sys

import numpy as np
import pandas as pd

import featuretools as ft


def clean_data(df: pd.DataFrame, 
               processes: list=[('remove_null', 0.69), 
                                ('remove_single_val', False), 
                                ('remove_various_val', 0.89),
                                ('remove_correlated', 0.89),
                                ('remove_low_info',)]) -> pd.DataFrame:
    features_original = df.columns.values.tolist()
    # print('Original Features:\n', features_original)
    for process in processes:
        print('-'*69)
        features_before = set(df.columns.values.tolist())
        if process[0] == 'remove_null':
            df = ft.selection.remove_highly_null_features(df, pct_null_threshold=process[1])
        elif process[0] == 'remove_single_val':
            df = ft.selection.remove_single_value_features(df, count_nan_as_value=process[1])
        elif process[0] == 'remove_correlated':
            df = ft.selection.remove_highly_correlated_features(df, pct_corr_threshold=process[1])
        elif process[0] == 'remove_low_info':
            df = ft.selection.remove_low_information_features(df)
        elif process[0] == 'remove_various_val':
            df = remove_highly_various_features(df, threshold=process[1])
        else:
            continue
        features_after = set(df.columns.values.tolist())
        features_removed = list(features_after.difference(features_before))
        print(f'\n\nAfter {process[0]}, there are {len(features_removed)} features being removed:')
        print(features_removed)
    features_final = df.columns.values.tolist()
    features_removed = set(features_original).difference(set(features_final))
    return df, list(features_removed)


def remove_highly_various_features(df: pd.DataFrame, threshold: float=0.89) -> pd.DataFrame:
    for col in df.columns:
        variousness = df[col].nunique() / df[col].notnull().sum()
        if variousness > threshold:
            df.drop(columns=[col], inplace=True)
    return df



