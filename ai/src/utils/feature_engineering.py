import os
import sys

import numpy as np
import pandas as pd

import featuretools as ft
from featuretools.variable_types import *
from featuretools.utils.gen_utils import make_tqdm_iterator

from ai.src.utils.customized_variable_types import CUSTOM_VARIABLES
from ai.src.utils.customized_primitives import default_aggregation_primitives, default_transformation_primitives


def auto_feature_engineering(entity_set: ft.EntitySet,
                             table_name: str,
                             max_depth: int=2,
                             max_features: int=-1,
                             seed_features: list=None,
                             encoding_categorical: bool=True,
                             verbose: bool=False) -> pd.DataFrame:

    # Deep Feature Synthesis 
    #   (Categorical features are not processed, on default)
    feature_matrix, feature_definitions = ft.dfs(
        entityset=entity_set,
        target_entity=table_name,
        agg_primitives=default_aggregation_primitives,
        trans_primitives=default_transformation_primitives,
        max_depth=max_depth,
        max_features=max_features,
        verbose=verbose,
        return_variable_types=[Numeric, Discrete, Ordinal, Categorical, Boolean]+CUSTOM_VARIABLES
    )

    # 1-hot encoding for Categorical features, including generated ones
    if encoding_categorical:
        features_before = set(feature_matrix.columns.values.tolist())
        feature_matrix, feature_definitions = encode_categorical_features(feature_matrix, feature_definitions, include_unknown=False, verbose=verbose)
        if verbose:
            features_after = set(feature_matrix.columns.values.tolist())
            features_encoded = list(features_before.difference(features_after))
            print("\n\nFeatures being encoded:\n\t", "\n\t".join(features_encoded))

    return feature_matrix.astype(float), feature_definitions


def filter_out_minor_categoricals(df: pd.DataFrame, 
                                  column_names: list or tuple,
                                  top_k: int=None,
                                  min_percent: float=0.01, 
                                  verbose: bool=False):
    for col in column_names:
        if verbose:
            print(f"\n\nFiltering {col} ...")
        if col not in df.columns:
            if verbose:
                print(f"\tCannot find {col} in your dataframe!")
            continue
            
        # Check top values
        df[col] = df[col].astype(str).str.lower()
        all_values = df[col].value_counts(normalize=True)
        if top_k:
            top_values = list(all_values.index)[:top_k]
        else:
            top_values = list(all_values.loc[all_values>=min_percent].index)
            
        if verbose:
            print(f"\tAll values")
            print(all_values)
            print(f"\tTop values:", top_values)
            
        # Filter-out minority
        def filter_minority(val):
            if not val or val not in top_values:
                val = 'others'
            return val
        
        df[col] = df[col].apply(filter_minority)
        if verbose:
            print(f"\tFilter values")
            print(df[col].value_counts(normalize=True))
            
    return df


DEFAULT_TOP_N = 10


def encode_categorical_features(feature_matrix: pd.DataFrame, features, 
                                top_n=DEFAULT_TOP_N, include_unknown=True,
                                to_encode=None, inplace=False, 
                                drop_first=False, verbose=False):
    """
    Encode categorical features

        Args:
            feature_matrix (pd.DataFrame): Dataframe of features.
            features (list[PrimitiveBase]): Feature definitions in feature_matrix.
            top_n (int or dict[string -> int]): Number of top values to include.
                If dict[string -> int] is used, key is feature name and value is
                the number of top values to include for that feature.
                If a feature's name is not in dictionary, a default value of 10 is used.
            include_unknown (pd.DataFrame): Add feature encoding an unknown class.
                defaults to True
            to_encode (list[str]): List of feature names to encode.
                features not in this list are unencoded in the output matrix
                defaults to encode all necessary features.
            inplace (bool): Encode feature_matrix in place. Defaults to False.
            drop_first (bool): Whether to get k-1 dummies out of k categorical
                    levels by removing the first level.
                    defaults to False
            verbose (str): Print progress info.

        Returns:
            (pd.Dataframe, list) : encoded feature_matrix, encoded features
    """
    if not isinstance(feature_matrix, pd.DataFrame):
        raise TypeError("feature_matrix must be a Pandas DataFrame")

    X = feature_matrix if inplace else feature_matrix.copy()

    old_feature_names = set()
    for feature in features:
        for fname in feature.get_feature_names():
            assert fname in X.columns, (f"Feature {fname} not found in feature matrix")
            old_feature_names.add(fname)

    pass_through = [col for col in X.columns if col not in old_feature_names]

    iterator = make_tqdm_iterator(iterable=features,
                                  total=len(features),
                                  desc="Encoding pass 1",
                                  unit="feature") if verbose else features
    new_feature_list = []
    new_columns = []
    encoded_columns = set()

    for f in iterator:
        # TODO: features with multiple columns are not encoded by this method,
        # which can cause an "encoded" matrix with non-numeric vlaues
        is_categorical = issubclass(f.variable_type, Categorical)
        if (f.number_output_features > 1 or not is_categorical):
            if f.number_output_features > 1:
                print(f"[WARNING] Feature {f} has multiple columns and will not be encoded. This may result in a matrix with non-numeric values.")
            new_feature_list.append(f)
            new_columns.extend(f.get_feature_names())
            continue

        if to_encode is not None and f.get_name() not in to_encode:
            new_feature_list.append(f)
            new_columns.extend(f.get_feature_names())
            continue

        val_counts = X[f.get_name()].value_counts().to_frame()
        index_name = val_counts.index.name
        if index_name is None:
            if 'index' in val_counts.columns:
                index_name = 'level_0'
            else:
                index_name = 'index'
        val_counts.reset_index(inplace=True)
        val_counts = val_counts.sort_values([f.get_name(), index_name],
                                            ascending=False)
        val_counts.set_index(index_name, inplace=True)
        select_n = top_n
        if isinstance(top_n, dict):
            select_n = top_n.get(f.get_name(), DEFAULT_TOP_N)
        if drop_first:
            select_n = min(len(val_counts), top_n)
            select_n = max(select_n - 1, 1)
        unique = val_counts.head(select_n).index.tolist()
        for label in unique:
            add = f == label
            add_name = add.get_name()
            new_feature_list.append(add)
            new_columns.append(add_name)
            encoded_columns.add(add_name)
            X[add_name] = (X[f.get_name()] == label)

        if include_unknown:
            unknown = f.isin(unique).NOT().rename(f.get_name() + " is unknown")
            unknown_name = unknown.get_name()
            new_feature_list.append(unknown)
            new_columns.append(unknown_name)
            encoded_columns.add(unknown_name)
            X[unknown_name] = (~X[f.get_name()].isin(unique))

        X.drop(f.get_name(), axis=1, inplace=True)

    new_columns.extend(pass_through)
    new_X = X[new_columns]
    iterator = new_X.columns
    if verbose:
        iterator = make_tqdm_iterator(iterable=new_X.columns,
                                      total=len(new_X.columns),
                                      desc="Encoding pass 2",
                                      unit="feature")
    for c in iterator:
        if c in encoded_columns:
            try:
                new_X[c] = pd.to_numeric(new_X[c], errors='raise')
            except (TypeError, ValueError):
                pass

    return new_X, new_feature_list


