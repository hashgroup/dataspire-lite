import numpy as np
import pandas as pd

from featuretools.variable_types import Variable


print("Importing customized variables ...")


class Age(Variable):
    _default_pandas_dtype = int
    _name = 'Age'
    
    
class Price(Variable):
    _default_pandas_dtype = float
    _name = 'Price'


class Weight(Variable):
    _default_pandas_dtype = float
    _name = 'Weight'

    
class Height(Variable):
    _default_pandas_dtype = float
    _name = 'Height'


class Length(Variable):
    _default_pandas_dtype = float
    _name = 'Length'
    
    
class Width(Variable):
    _default_pandas_dtype = float
    _name = 'Width'


class Depth(Variable):
    _default_pandas_dtype = float
    _name = 'Depth'


class Size(Variable):
    _default_pandas_dtype = str
    _name = 'Size'
    
    
class MeasurementUnit(Variable):
    _default_pandas_dtype = str
    _name = 'MeasurementUnit'


class Currency(Variable):
    _default_pandas_dtype = str
    _name = 'Currency'
    
    
class Gender(Variable):
    _default_pandas_dtype = str
    _name = 'Gender'
    
    
class People(Variable):
    _default_pandas_dtype = int
    _name = 'People'


CUSTOM_VARIABLES = [
    Gender, Currency, MeasurementUnit, Size, People, 
    Depth, Width, Length, Height, Weight, Price, Age,
]



