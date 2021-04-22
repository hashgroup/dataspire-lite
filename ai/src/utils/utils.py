import os
from copy import deepcopy

from datetime import datetime
from dateutil.parser import parse as parse_to_datetime
import dateutil

import numpy as np
import pandas as pd

np.seterr(divide='ignore')

from sklearn.utils import class_weight
from sklearn.cluster import KMeans, MeanShift, DBSCAN
from sklearn.multiclass import OneVsRestClassifier
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from sklearn.metrics import (
    classification_report, confusion_matrix, 
    silhouette_score, homogeneity_score, completeness_score, v_measure_score,
    auc, plot_roc_curve
)
from sklearn.model_selection import (
    KFold, StratifiedKFold, cross_val_score, 
    GridSearchCV, 
    train_test_split
)

from xgboost import XGBClassifier

LUCKY_NUMBER = 6969

classifier = XGBClassifier(objective='multi:softprob', n_jobs=11)

parameters = {
    'max_depth': range (2, 7, 1),
    'n_estimators': range(60, 90, 10),
    'learning_rate': [0.01, 0.05, 0.1]
}

HP_searcher = GridSearchCV(
    estimator=classifier,
    param_grid=parameters,
    scoring='f1_macro',
    cv=10,
    verbose=True
)


def to_datetime(text: str):
    try:
        dt_format = str(parse_to_datetime(text))
        dt_object = datetime.strptime(dt_format,'%Y-%m-%d %H:%M:%S')
    except Exception:
        return None
    return dt_object


def month_to_quarter(month: int) -> int:
    if 1 <= month <= 3:
        return 1
    elif 4 <= month <= 6:
        return 2
    elif 7 <= month <= 9:
        return 3
    elif 10 <= month <= 12:
        return 4
    else:
        raise ValueError(f'input must be between 1 and 12')


def load_csv(filepath: str) -> pd.DataFrame:
    if not os.path.isfile(filepath):
        raise FileNotFoundError(f"Cannot find {filepath}")
    return pd.read_csv(filepath)


def find_best_k_clustering(x: np.array, 
                           max_clusters: int=10,
                           max_iterations: int=1000, 
                           n_samples: int=169, 
                           lucky_number: int=LUCKY_NUMBER,
                           verbose: bool=False):
    scores = {}
    for k in range(2, max_clusters-1):
        if k < 2:
            continue
        try:
            kmeans = KMeans(n_clusters=k, max_iter=max_iterations, random_state=lucky_number).fit(x)
        except:
            continue
        # scores[k] = kmeans.inertia_
        try:
            scores[k] = silhouette_score(x, kmeans.labels_, metric='euclidean', sample_size=n_samples)
        except ValueError:
            continue

    best_k = max(scores, key=scores.get)
    if verbose:
        print(f"Best k is {best_k}")
    return best_k


def reorder_cluster(cluster_field_name: str, 
                    target_field_name: str, 
                    df: pd.DataFrame, 
                    ascending: bool=True):
    new_cluster_field_name = 'new_' + cluster_field_name
    df_new = df.groupby(cluster_field_name)[target_field_name].mean().reset_index()
    df_new = df_new.sort_values(by=target_field_name, ascending=ascending).reset_index(drop=True)
    df_new['index'] = df_new.index
    df_final = pd.merge(df, df_new[[cluster_field_name, 'index']], on=cluster_field_name)
    df_final = df_final.drop([cluster_field_name], axis=1)
    df_final = df_final.rename(columns={"index": cluster_field_name})
    df_final[cluster_field_name] = df_final[cluster_field_name] + 1
    return df_final


def cdf(x):
    """
    Cumulative Density Function (with epsilon)
    """
    x = np.sort(x)
    u, c = np.unique(x, return_counts=True)
    n = len(x)
    y = (np.cumsum(c)-0.5) / n
    
    def interpolate_(x_):
        y_interp = np.interp(x_, u, y, left=0.0, right=1.0)
        return y_interp
    
    return interpolate_


def cumulative_kl(x, y, fraction: float=0.5): 
    """
    Cumulative Method to calculate Kullback–Leibler divergence
    """
    dx = np.diff(np.sort(np.unique(x)))
    dy = np.diff(np.sort(np.unique(y)))
    ex = np.min(dx)
    ey = np.min(dy)
    e = np.min([ex, ey]) * fraction
    n = len(x)
    P = cdf(x)
    Q = cdf(y)
    
    divergence = (1./n) * np.sum(np.log((P(x)-P(x-e)) / (Q(x)-Q(x-e)+1e-11)))
    return np.abs(divergence)


def preprocess_for_classifier(df: pd.DataFrame, target_name: str,
                              id_cols: list=[], train_size: float=0.69):
    # Split to train and validation
    dset, X, Y = dict(), dict(), dict()

    # If the minimum number of groups for any class less than 2
    try:
        dset['train'], dset['test'] = train_test_split(df, train_size=train_size, stratify=df[target_name])
        for ds_name, ds in dset.items():
            Y[ds_name] = ds[target_name]    
            X[ds_name] = ds.copy()
            X[ds_name].drop(columns=id_cols+[target_name], errors='ignore', inplace=True)
    except:
        X['train'] = df.copy()
        X['train'].drop(columns=id_cols+[target_name], errors='ignore', inplace=True)
        X['test'] = X['train'].copy()

        Y['train'] = df[target_name]
        Y['test'] = Y['train'].copy()
    
    # Compute class weights for target
    target_weights = Y['train']
    target_classes = target_weights.unique()
    class_weights = list(
        class_weight.compute_class_weight('balanced', target_classes, target_weights)
    )
    target_weights = target_weights.map({clss_i+1: clss_w for clss_i, clss_w in enumerate(class_weights)})
 
    return X, Y, target_weights


def visualize_results(classifier, X, Y):
    results = classifier.evals_result()

    epochs = len(results['validation_0']['mlogloss'])
    x_axis = range(0, epochs)

    viz_df = pd.DataFrame(classifier.feature_importances_, 
                          index=X['train'].columns, 
                          columns=['feature_importance'])
    viz_df.sort_values(by=['feature_importance'], inplace=True)
    # viz_df[viz_df.feature_importance>0.011].plot(kind='barh', alpha=0.75)

    print('\n\nAccuracy of XGB classifier on training: {:.2f}'
                .format(classifier.score(X['train'], Y['train'])))
    y_pred = classifier.predict(X['train'])
    print(classification_report(Y['train'], y_pred))

    print('\n\nAccuracy of XGB classifier on testing: {:.2f}'
                .format(classifier.score(X['test'], Y['test'])))
    y_pred = classifier.predict(X['test'])
    print(classification_report(Y['test'], y_pred))


def filter_opposite_features(df: pd.DataFrame, verbose: bool=False):
    features_before = list(df.columns)
    features_after = deepcopy(features_before)
    feature_id = 0
    while feature_id < len(features_after):
        feature_1 = features_after[feature_id]
        if verbose:
            print(f"Checking {feature_1}")
        feature_id += 1

        is_separable = False
        for op in [' = ', ' - ', ' + ', ' > ', ' < ']:
            if op in feature_1:
                is_separable = True
                break

        if not is_separable:
            continue

        obj_a, obj_b = feature_1.split(op)
        feature_2 = obj_b + op + obj_a
        if feature_2 in features_after:
            if verbose:
                print(f"Remove {feature_2} because of oppositing {feature_1}")
            features_after.remove(feature_2)

    features_removed = list(set(features_before).difference(set(features_after)))
    if verbose:
        print(f"\n\n\nFeatures removed:\n\t", features_removed)
    return features_removed


def check_features_diverged(DF_1: pd.DataFrame, 
                            DF_2: pd.DataFrame, 
                            exclude_columns: list=[],
                            include_nan_divergence: bool=False,
                            threshold: float=0.69,
                            mode: str='min',
                            verbose: bool=False) -> list:
    len_1, len_2 = len(DF_1), len(DF_2)
    if len_1 > len_2:
        DF_1 = DF_1.sample(len_2)
    elif len_2 > len_1:
        DF_2 = DF_2.sample(len_1)

    diverged_features = dict()
    common_features = set.intersection(set(list(DF_1.columns)), set(list(DF_2.columns)))
    common_features = [f for f in list(common_features) if f not in exclude_columns]

    for col in common_features:        
        div_xy = cumulative_kl(DF_1[col], DF_2[col])
        div_yx = cumulative_kl(DF_2[col], DF_1[col])
        if mode == 'max':
            div = max(div_xy, div_yx)
        elif mode == 'min':
            div = min(div_xy, div_yx)
        else:
            div = (div_xy + div_yx) / 2

        if verbose:
            print(f'\n{col}\n\t{div_xy}\n\t{div_yx}\n\t{div}\n')

        if div > threshold:
            diverged_features[col] = div
        if include_nan_divergence and np.isnan(div):
            diverged_features[col] = div

    diverged_features_df = pd.DataFrame.from_dict(diverged_features, orient='index', columns=['KL_divergence'])
    diverged_features_df.sort_values(by=['KL_divergence'], inplace=True)

    if verbose:
        print(diverged_features_df)
    
    return list(diverged_features_df.index)


def feature_clustering(df: pd.DataFrame, 
                       feature_name: str,
                       cluster_name: str=None,
                       ascending: bool=True, 
                       reorder_by_feature: str=None,
                       best_k: int=None) -> pd.DataFrame:
    # Preprocess
    cluster_df = df[
        ['GuestID', feature_name] if not reorder_by_feature else \
        ['GuestID', feature_name, reorder_by_feature]
    ]
    x = cluster_df[feature_name].values.reshape(-1, 1)
    if not cluster_name:
        cluster_name = feature_name + '_Cluster'

    # Segmentation
    if not best_k:
        best_k = find_best_k_clustering(x)
    model = KMeans(n_clusters=best_k, random_state=LUCKY_NUMBER)
    model.fit(x)

    # Predict
    cluster_df[cluster_name] = model.predict(x)

    # Sorting
    if not reorder_by_feature:
        reorder_by_feature = feature_name
    cluster_df = reorder_cluster(cluster_name, reorder_by_feature, cluster_df, ascending)
    df = df.merge(cluster_df[['GuestID', cluster_name]], how='outer', on='GuestID')

    return df, best_k, model




