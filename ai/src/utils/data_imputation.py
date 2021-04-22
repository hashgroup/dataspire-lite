import os

import numpy as np
import pandas as pd

from itertools import combinations

from sklearn.impute import SimpleImputer as sk_imputer

class DataImputer:
    
    def __init__(df: pd.DataFrame, 
                 feature_types: dict, 
                 imputation_methods: dict={
                     'categorical': ['constant', 'most_frequent', 'random_prob', 'knn', 'mice', 'em', 'deep_learning'],
                     'numerical': ['mode', 'mean', 'median', 'random_prob', 'knn', 'mice', 'em'],
                     'datetime': ['current_date', '1st_date']
                 }):
        self.df = df
        self.feature_types = {
            feature: feature_type.lower() for feature, feature_type in feature_types.items()
        }
        self.imputation_methods = imputation_methods
        self.imputed_features = dict()
        
    def fill_na(self):
        for feature_name in self.df.columns:
            print(f'\nImputing {feature_name} ...')
            if feature_name not in self.feature_types.keys():
                print(f'\tType of {feature_name} is not declared!')
                continue
            elif self.feature_types[feature_name] not in self.imputation_methods.keys():
                print(f'\tType {self.feature_types[feature_name]} is not supported!')
                continue
            feature = self.df[feature_name]
            
    def fill_na_by_constant(self, feature, const_type: str):
        """
        Constant value could be 1 among [0, mean, median, mode]

        Pros:
            . easy and fast

        Cons:
            . not factor the correlations between features 
            . give poor results on encoded categorical features (with MEAN, MEDIAN or MODE)
            . not very accurate
            . not account for the uncertainty in the imputations
        """
        pass

    def fill_na_by_most_frequent(self, feature):
        """
        Pros:
            . works well with categorical features

        Cons:
            . not factor the correlations between features 
            . can introduce bias in the data
        """
        pass

    def fill_na_by_random_prob(self, feature):
        pass

    def fill_na_by_kNN(self, feature):
        """
        This function creates a basic MEAN impute, then uses the resulting list to construct a KDTree. 
        Then, it uses the resulting KDTree to compute nearest neighbours (NN). 
        After it finds the k-NNs, it takes the weighted average of them.

        Pros:
            . much more accurate than the mean, median or most frequent imputation methods

        Cons:
            . computationally expensive
            . quite sensitive to outliers
        """
        pass

    def fill_na_by_MICE(self, feature):
        """
        Multivariate Imputation by Chained Equations
        """
        pass

    def fill_na_by_EM(self, feature):
        pass

    def fill_na_by_deep_learning(self, feature):
        """
        Pros:
            . quite accurate compared to other methods
            . works very well with categorical and non-numerical features

        Cons:
            . single-column imputation
            . quite slow with large datasets
        """
        pass

    def fill_na_by_date(self, feature, date_type: str):
        pass

        



