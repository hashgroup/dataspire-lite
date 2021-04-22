import time
import warnings
import random

from tqdm import tqdm as print_progress
from joblib import Parallel, delayed
from collections import Counter

import numpy as np
import pandas as pd

from sklearn.base import BaseEstimator
import sklearn.linear_model as models
from sklearn.preprocessing import StandardScaler
from sklearn.utils.validation import check_X_y, check_array, check_is_fitted


def add_noisy_features(X: np.array, noise_ratio: float=0.2):
    """
    Add noisy features to DataFrame,
        in order to check whether the generated features are good
    """
    # Verify data type
    if isinstance(X, pd.DataFrame):
        X = X.values
    if not isinstance(X, np.ndarray):
        raise ValueError(f"X must be either `np.array` or `pd.DataFrame` while being {type(X)}")
    
    n_samples, n_features = X.shape
    if n_samples > 100 and n_features > 10:
        # shuffle DataFrame
        X_shuffled = np.random.permutation(X.flatten()).reshape(X.shape)
        random_noise = StandardScaler().fit_transform(X_shuffled)
        X = np.hstack([X, random_noise])

    # generate normally-distributed noise
    n_noise = max(3, int(noise_ratio*n_features))
    noisy_features = np.random.randn(n_samples, n_noise)

    X_noised = np.hstack([X, noisy_features])
    noisy_feature_names = [f'noise_{n}' for n in range(X_noised.shape[1])]

    return X_noised, noisy_feature_names


def noise_filtering(X: np.array, y: np.array, 
                    feature_names=None, 
                    problem_type: str="regression", 
                    n_best: int=-1,
                    n_priori_noise: int=-1):
    """
    Trains a prediction model with additional noisy features and 
        selects only those of the original features 
        that have higher coefficient than any of the noisy features.

    Inputs:
        - X: n x d numpy.array with d features
        - y: target vector corresponding to the data points in X
        - feature_names: list of column names for the features in X
        - problem_type: str, either "regression" or "classification" (default: "regression")
    
    Returns:
        - good_cols: list of filtered column names
    """
    # Verify data
    n_samples, n_features = X.shape
    if not feature_names:
        feature_names = list(range(n_features))
    if len(feature_names) != n_features:
        raise ValueError(f"Number of columns provided is different from number of features ({len(feature_names)} != {n_features})")

    # Load model
    if problem_type == "regression":
        model = models.LassoLarsCV(cv=5, eps=1e-8)
    elif problem_type == "classification":
        model = models.LogisticRegressionCV(cv=5, penalty="l1", solver="saga", class_weight="balanced")
    else:
        print(f"WARNING: Unknown problem_type ({problem_type}) - not performing noise filtering.")
        return feature_names

    # Filter noisy features
    X_noisy, noisy_features = add_noisy_features(X)
    n_noise = len(noisy_features)
    with warnings.catch_warnings():
        warnings.simplefilter(action='ignore')
        try:
            model.fit(X_noisy, y)
        except ValueError:
            idx = np.random.permutation(n_samples)
            model.fit(X_noisy[idx], y[idx])
    
    coefs = np.abs(model.coef_)
    if problem_type == 'classification':
        # model.coefs_ is n_classes x n_features, but we need only n_features
        coefs = np.max(coefs, axis=0)
    feature_coefs, noise_coefs = coefs[:n_features], coefs[n_features:]
    weights = dict(zip(feature_names, feature_coefs))

    if n_best > 0:
        threshold = sorted(coefs, reverse=True)[min(n_best, n_features)]
    elif n_priori_noise > 0:
        threshold = sorted(coefs, reverse=True)[min(n_priori_noise+n_noise, n_features)]
    else:
        # only keep features more important than known noisy features
        threshold = np.max(noise_coefs)
    return [fn for fn in feature_names if weights[fn]>threshold and 'noise' not in fn]


def feature_selection(X: pd.DataFrame, y: pd.Series, 
                      problem_type: str="regression", 
                      relevance_ratio: float=0.5,
                      verbose=False) -> list:
    """
    Feature Selection for NUMERIC variables

    Inputs:
        - X: pandas.DataFrame with n data points and p features; 
                to avoid overfitting, only provide data belonging to the n training data points. 
        - y: target pandas Series corresponding to the data points in X
        - relevance_ratio: float between 0-1, 
        - problem_type: str, either "regression" or "classification" (default: "regression")
        - verbose: verbosity level (boolean; default: False)
    
    Returns:
        - feature_names: list of column names for X to train a prediction model
    """
    features = dict()
    features['original'] = X.columns.values.tolist()
    n_features = len(X.columns)
    n_samples = len(X)

    # initial selection of too few but (hopefully) relevant features
    t1 = time.time()
    features['relevant'] = noise_filtering(X=X.values, y=y.values, 
                                           feature_names=X.columns.values.tolist(),
                                           problem_type=problem_type,
                                           n_best=int(relevance_ratio*n_features))
    t2 = time.time()
    features['irrelevant'] = list(
        set(features['original']).difference(set(features['relevant']))
    )
    if verbose:
        print("\n\nFeatures relevant:\n\t", '\n\t'.join(features['relevant']))
        print("\n\nFeatures irrelevant:\n\t", '\n\t'.join(features['irrelevant']))
        print(f"\n\nPerform initial selection in {int(t2-t1)} seconds")

    # Noise filtering for relevant features
    t1 = time.time()
    features['relevant_denoised'] = noise_filtering(X=X[features['relevant']].values, y=y.values,
                                                    feature_names=features['relevant'],
                                                    problem_type=problem_type)
    t2 = time.time()
    if verbose:
        features_removed = set(features['relevant']).difference(set(features['relevant_denoised']))
        print("\n\nRelevant features removed:\n\t", '\n\t'.join(list(features_removed)))
        print(f"\n\nPerform relevant selection in {int(t2-t1)} seconds")
        
    # Noise filtering for irrelevant features
    features['irrelevant_denoised'] = []
    if len(features['irrelevant']) > 0:
        random.shuffle(features['irrelevant'])
        X_noisy, noisy_names = add_noisy_features(X, noise_ratio=0.2)
        n_relevances, n_irrelevances = len(features['relevant']), len(features['irrelevant'])
        
        try:
            n_batches = int(n_irrelevances / max(10, 0.5*n_samples-n_relevances))
            batch_size = int(n_irrelevances/n_batches)
        except ZeroDivisionError:
            print(f"\n\nAll irrelevant features are noise")
            n_batches, batch_size = 0, 0
            
        t1 = time.time()
        for bi in print_progress(range(n_batches)):
            batch_features = features['irrelevant'][bi*batch_size:(bi+1)*batch_size]
            X_batch = np.hstack([X[batch_features].values, X_noisy])
            features_relevant = noise_filtering(X=X_batch, y=y.values,
                                                feature_names=batch_features+noisy_names,
                                                problem_type=problem_type,
                                                n_priori_noise=len(noisy_names))
            features['irrelevant_denoised'].extend(features_relevant)
        t2 = time.time()

        # Remove duplicates
        features['irrelevant_denoised'] = list(set(features['irrelevant_denoised']))

        if verbose:
            features_removed = set(features['irrelevant']).difference(set(features['irrelevant_denoised']))
            print("\n\nIrrelevant features removed:\n\t", '\n\t'.join(list(features_removed)))
            print(f"\n\nPerform irrelevant selection in {int(t2-t1)} seconds")

    # Noise filtering for the combination of features
    t1 = time.time()
    combined_features = features['relevant_denoised'] + features['irrelevant_denoised']
    denoised_features = noise_filtering(X=X[combined_features].values, y=y.values,
                                        feature_names=combined_features,
                                        problem_type=problem_type)
    t2 = time.time()
    if verbose:
        features_removed = set(combined_features).difference(set(denoised_features))
        print("\n\nCombined features removed:\n\t", '\n\t'.join(list(features_removed)))
        print(f"\n\nPerform combined selection in {int(t2-t1)} seconds")
    return denoised_features


def feature_screening(X: pd.DataFrame, y: pd.Series, 
                      n_runs: int=5,
                      retain_features: list=[],
                      corr_threshold: float=0.9,
                      problem_type: str="regression", 
                      n_workers: int=1,
                      verbose=False):
    """
    Select predictive NUMERIC features given the data and targets.

    Inputs:
        - X: pandas.DataFrame with n data points and p features; 
                to avoid overfitting, only provide data belonging to the n training data points.
        - y: target pandas Series corresponding to the data points in X
        - n_runs: number of times to perform feature selection 
                    with a random fraction of data points (int; default: 5)
        - corr_threshold: threshold to deliminate correlated features
        - retain_features: list of features that must be retained
        - problem_type: str, either "regression" or "classification" (default: "regression")
        - n_workers: the number of workers in parallel
        - verbose: verbosity level (boolean; default: False)

    Returns:
        - feature_names: list of promising column names to train model
    """
    # Verify data
    n_samples, n_features = X.shape
    if len(y) != n_samples:
        raise ValueError(f"Numbers of samples in X (={n_samples}) and y (={len(y)}) are mismatched !!!!")
    if verbose:
        if n_runs > n_samples:
            print(f"[WARNING] There are fewer data samples than number of runs !!!")

    # Verify condition
    if n_runs < 1 or problem_type not in ['regression', 'classification']:
        print(f"WARNING: n_runs (={n_runs}) must be larger than 1 AND problem_type (={problem_type}) must be either `regression` or `classification`")
        return X.columns.values.tolist()

    # check that retaining columns exist 
    #       - the columns might be transformed to str !
    retain_features = [f for f in retain_features if f in X.columns and not str(f) in X.columns] \
                        + [str(f) for f in retain_features if str(f) in X.columns]
    important_features = X.columns.values.tolist()

    # Scale features to uniform distribution
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")

        # Initialize scaler for common use
        scaler = StandardScaler(with_mean=True, with_std=True)

        # Scale features X
        X_scaled = pd.DataFrame(columns=X.columns, dtype=np.float32)
        for col in X.columns.values.tolist():            
            X_scaled[col] = scaler.fit_transform(X[col].values.reshape(-1, 1)).ravel()

        # Scale target y
        y_scaled = y if problem_type=='classification' \
                    else scaler.fit_transform(y.values.reshape(-1, 1)).ravel()

    # select good features in k runs in parallel by cross-validation
    #       (i.e., randomly subsample data points)
    def run_feature_screening(r):
        if verbose:
            print(f"\n\n\nRun {r+1} / {n_runs} feature screening ...")
        np.random.seed(r)
        batch_size = max(10, int(0.85*n_samples))
        indices = np.random.permutation(X_scaled.index)[:batch_size]
        return feature_selection(X=X_scaled.iloc[indices], 
                                 y=y_scaled[indices],
                                 problem_type=problem_type,
                                 verbose=verbose)

    if n_workers == 1 or n_runs == 1:
        selected_features = []
        for r in range(n_runs):
            selected_features.extend(run_feature_screening(r))
    else:
        # only use parallelization code if needed
        def merge_lists(L):
            return [item for sublist in L for item in sublist]
        
        selected_features = merge_lists(
            Parallel(n_jobs=n_workers, verbose=verbose)(
                delayed(function=run_feature_screening)(r) for r in range(n_runs)
            )
        )
    
    if len(selected_features) > 0:
        feature_counter = Counter(selected_features)

        # sort by frequency, but down-weight long formulaes to break tie (if any)
        selected_features = sorted(feature_counter, 
                                    key=lambda f: feature_counter[f] - 1e-11*len(str(f)))[::-1]
        if verbose:
            print(f"There are {len(selected_features)} features after feature selection")

        # Add retained features
        if len(retain_features) > 0:
            selected_features.extend(retain_features)
            selected_features = list(set(selected_features))
            important_features = selected_features
        else:
            important_features = selected_features[:1]

        # correlation filtering
        k = len(important_features)
        if len(selected_features) > k:
            correlations = X_scaled[selected_features].corr()
            for f_i, f in enumerate(selected_features[k:], k):
                # only take features that are uncorrelated with the rest
                if np.max(np.abs(correlations[f].ravel()[:f_i])) < corr_threshold:
                    important_features.append(f)
        if verbose:
            print(f"There are {len(selected_features)} features after correlation filtering")

    # perform noise filtering on de-correlated features
    important_features = noise_filtering(X=X_scaled[important_features].values, y=y_scaled,
                                         feature_names=important_features,
                                         problem_type=problem_type)
    if verbose:
        print(f"There are {len(important_features)} features after noise filtering")

    # Add retained features
    important_features.extend(retain_features)
    important_features = list(set(important_features))
    if verbose:
        print(f"There are {len(important_features)} features after feature screening {n_runs} times")
    return important_features


class FeatureSelector(BaseEstimator):

    def __init__(self, problem_type: int="regression", 
                       n_runs: int=5,
                       corr_threshold: float=0.9,
                       retain_features: list=[],
                       n_workers: int=1,
                       verbose: bool=True):
        """
        Multi-step cross-validated feature selection
        
        Inputs:
            - problem_type: str, either "regression" or "classification" (default: "regression")
            - n_runs: number of times to perform feature selection with a random fraction of data points (int; default: 5)
            - corr_threshold: threshold to deliminate correlated features
            - retain_features: list of features that must be retained
            - n_jobs: how many jobs to run when selecting the features in parallel (int; default: 1)
            - n_workers: the number of workers in parallel
            - verbose: verbosity level (boolean; default: False)
        
        Attributes:
            - important_features_: list of important features (to select via pandas.DataFrame columns)
            - original_features_: list of original features of X when calling fit
            - return_df_: whether to return a pandas.DataFrame; if False, return a numpy.array
        """
        self.retain_features = retain_features
        self.corr_threshold = corr_threshold
        self.problem_type = problem_type
        self.n_workers = n_workers
        self.verbose = verbose
        self.n_runs = n_runs

    def fit(self, X: pd.DataFrame or np.array, 
                  y: pd.Series or np.array):
        # Verify data types
        if isinstance(X, pd.DataFrame):
            self.return_df_ = True
            self.original_features_ = list(X.columns)
        else:
            self.return_df_ = False
            self.original_features_ = [f"x_{i}" for i in range(X.shape[1])]
            X = pd.DataFrame(X, columns=self.original_features_)
        if not isinstance(y, pd.Series):
            y = pd.Series(y, name='target')
        
        # Perform multi-step feature selection
        self.important_features_ = feature_screening(
            X=X, y=y, 
            n_runs=self.n_runs, 
            verbose=self.verbose, 
            n_workers=self.n_workers, 
            problem_type=self.problem_type,
            corr_threshold=self.corr_threshold, 
            retain_features=self.retain_features
        )
        return self                      

    def transform(self, X: pd.DataFrame or np.array):
        # Validate attributes
        check_is_fitted(self, ["important_features_"])
        if len(self.important_features_) == 0:
            if self.verbose:
                print("WARNING: No important features found; returning data unchanged.")
            return X

        # Validate data types
        if isinstance(X, pd.DataFrame):
            features = list(X.columns)
        else:
            features = [f"x_{i}" for i in range(X.shape[1])]
        X = check_array(X, force_all_finite="allow-nan")
        if sorted(self.original_features_) != sorted(features):
            raise ValueError("Features are different from calling `fit`")

        # Get selected features only
        X = pd.DataFrame(X, columns=features)
        X_selected = X[self.important_features_]
        if self.return_df_:
            return X_selected
        return X_selected.values

    def fit_transform(self, X: pd.DataFrame or np.array, 
                            y: pd.Series or np.array):
        self.fit(X, y)
        X_transformed = self.transform(X)
        return X_transformed


