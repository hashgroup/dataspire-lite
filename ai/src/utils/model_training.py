import os
import sys

import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split

fail_to_use_autoML = False
try:
    import evalml
    from evalml import AutoMLSearch
except ModuleNotFoundError:
    fail_to_use_autoML = True


def auto_ML_search(df: pd.DataFrame, 
                   target_col: str,
                   problem_type: str='binary',
                   additional_objectives=['auc', 'f1', 'precision']):
    if fail_to_use_autoML:
        raise ModuleNotFoundError(f"No module named `evalml`")
        
    # Split dataset
    X = df.drop(columns=[target_col], inplace=False)
    y = df[target_col]
    X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.69, random_state=69)

    # Run auto ML    
    auto_ml = AutoMLSearch(X_train=X_train, y_train=y_train,
                            problem_type=problem_type,
                            # objective=fraud_objective,
                            additional_objectives=additional_objectives,
                            max_batches=1,
                            optimize_thresholds=True)

    auto_ml.search(data_checks='disabled')
    model_rankings = auto_ml.rankings
    best_pipeline = auto_ml.best_pipeline
    print(auto_ml.describe_pipeline(auto_ml.rankings.iloc[0]["id"]))

    # Train
    best_pipeline.fit(X_train, y_train)
    feature_importance = best_pipeline.feature_importance
    best_pipeline.graph_feature_importance()

    # Test
    results = best_pipeline.predict(X_test)._series

    return model_rankings, best_pipeline, feature_importance, results




