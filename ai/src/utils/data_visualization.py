import os

import numpy as np
import pandas as pd

def describe_missing_values(df: pd.DataFrame):
    miss_val = df.isnull().sum()
    miss_val_percent = 100 * df.isnull().sum() / len(df)
    miss_val_table = pd.concat([miss_val, miss_val_percent], axis=1)
    miss_val_table_ren_columns = miss_val_table.rename(
        columns = {
            0: 'Missing Values', 
            1: '% of Total Values',
        }
    )
    miss_val_table_ren_columns = miss_val_table_ren_columns[
        miss_val_table_ren_columns.iloc[:,1] != 0
    ].sort_values('% of Total Values', ascending=False).round(1)
    
    print(f"Your selected dataframe has {df.shape[1]} columns,")
    print(f"\t{miss_val_table_ren_columns.shape[0]} columns that have missing values.")

    return miss_val_table_ren_columns


def visualize_distribution_of_missing_values(df: pd.DataFrame):
    df_nan_check = df.isna().sum().sort_values()
    df_nan_check = df_nan_check.to_dict()
    df_not_nan = []

    nan_cols = 0

    for key, value in df_nan_check.items():
        df_nan_check[key] = int(value/len(df)*100)
        if df_nan_check[key] >= 80:
            nan_cols += 1
        else:
            df_not_nan.append(key)

    # Visualize
    plt.figure(figsize=(9, 6))
    plt.suptitle('Distribution of Empty Values', fontsize=19)
    plt.bar(df_nan_check.keys(), df_nan_check.values())
    plt.xticks(rotation=69)
    plt.show()


def describe_stats(df: pd.DataFrame, only_numerical: bool=False):
    if only_numerical:
        print(df.describe())
    else:
        print(df.describe(include='all'))



