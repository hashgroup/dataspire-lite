import numpy as np
import pandas as pd

import featuretools as ft
from featuretools.primitives.base import *
from featuretools.utils.gen_utils import Library
from featuretools.primitives.standard.binary_transform import (
    AddNumeric, AddNumericScalar,
    SubtractNumeric, SubtractNumericScalar, ScalarSubtractNumericFeature,
    MultiplyNumeric, MultiplyNumericScalar,
    DivideNumeric, DivideNumericScalar, DivideByFeature,
    ModuloNumeric, ModuloNumericScalar, ModuloByFeature,
    GreaterThan, GreaterThanScalar, GreaterThanEqualTo, GreaterThanEqualToScalar,
    LessThan, LessThanScalar, LessThanEqualTo, LessThanEqualToScalar, 
    Equal, EqualScalar, NotEqual, NotEqualScalar
)
from featuretools.variable_types.variable import *
from ai.src.utils.customized_variable_types import *


print("Importing customized primitives ...")


class GroupOf(TransformPrimitive):
    
    name = 'group_of'
    input_types = [Age]
    return_type = Ordinal
    
    def __init__(self):
        self.description_template = "group of {}"
        
    def get_function(self):
        def assign_group(vals: pd.Series):
            groups = vals.copy()
            groups.loc[vals <= 18] = 0 # children & teenager
            groups.loc[vals > 18] = 1 # the young adult
            groups.loc[vals > 35] = 2 # the adult
            groups.loc[vals > 55] = 3 # the retired
            groups.loc[vals > 70] = 4 # the elderly
            return groups
        return assign_group
    
    
class TimeDelta(TransformPrimitive):
    
    name = "scalar_subtract_numeric_feature"
    input_types = [Datetime, Datetime]
    return_type = Numeric
    compatibility = [Library.PANDAS, Library.DASK, Library.KOALAS]

    def __init__(self):
        self.description_template = "the result of {} minus {}"

    def get_function(self):
        def time_delta_between(x_vals, y_vals):
            return (x_vals - y_vals) / pd.Timedelta(days=1)
        return time_delta_between

    def generate_name(self, base_feature_names):
        return "%s - %s" % (base_feature_names[0], base_feature_names[1])


class Quarter(TransformPrimitive):
    """
    Determines the quarter value of a datetime.
    """
    name = "quarter"
    input_types = [Datetime]
    return_type = Ordinal
    compatibility = [Library.PANDAS, Library.DASK, Library.KOALAS]
    description_template = "the quarter of {}"

    def get_function(self):
        def quarterize(vals):
            m_vals = vals.dt.month
            q_vals = m_vals.copy()
            q_vals.loc[m_vals <= 3] = 1 # 1st quarter of the year
            q_vals.loc[m_vals > 3] = 2 
            q_vals.loc[m_vals > 6] = 3 
            q_vals.loc[m_vals > 9] = 4 
            return q_vals
        return quarterize


# Define functions to duplicate
numeric_functions = [
    AddNumeric(),
    SubtractNumeric(),
    # MultiplyNumeric(),
    # DivideNumeric(), DivideByFeature(value=1),
    # ModuloNumeric(), ModuloByFeature(value=1),
    GreaterThan(), GreaterThanScalar(value=0), 
    LessThan(), LessThanScalar(value=0), 
    Equal(), EqualScalar(value=0), 
]


# Duplicate Numeric functions for customized Variables
def duplicate_functions(functions: list or tuple):
    duplicated_functions = []
    duplicated_variables = [Age, Price, Weight, Height, Width, Length, Depth]
    for dup_func in functions:
        for var_type in duplicated_variables:
            # print(f"\nDuplicating function {dup_func.name} for variable {var_type._name}")

            # Define nearly-duplicated primitive
            dup_func.name = dup_func.name.replace('numeric', var_type._name.lower())
            input_types = dup_func.input_types
            if isinstance(input_types[0], (list, tuple)):
                n_inputs = len(input_types[0])
                dup_func.compatibility = [Library.PANDAS]
                dup_func.input_types = [[var_type] * n_inputs]
            else:
                n_inputs = len(input_types)
                dup_func.input_types = [var_type] * n_inputs
            
            # Append to list
            duplicated_functions.append(dup_func)
    return duplicated_functions


# Define default primitives
default_aggregation_primitives = [
    "sum", "max", "min", "mode", 
    "mean", "std", "skew",
    "count", "percent_true", "num_unique",
]

default_transformation_primitives = [
    # Datetime
    "month", Quarter, "weekday", "is_weekend", TimeDelta,

    # LatLong
    "haversine", 

    # NaturalLanguage
    # "num_words", "num_characters", 

    # Age
    # GroupOf
] + numeric_functions + duplicate_functions(numeric_functions)

