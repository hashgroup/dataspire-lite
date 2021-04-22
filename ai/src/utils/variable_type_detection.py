import numpy as np
import pandas as pd

import re
import math
from dateutil.parser import parse as parse_to_datetime


pattern_digit = re.compile('\d')


def check_contain_digit(text: str) -> bool:
    try:
        contain_digit = bool(pattern_digit.search(text))
    except Exception:
        contain_digit = None
    return contain_digit


def check_datetime(text: str) -> bool:
    try:
        dt_format = parse_to_datetime(text)
        return True
    except Exception:
        return None


def check_categorical(uniqueness, n_values, 
                      uniqueness_threshold: float=0.11,
                      n_values_at_least: int=27,
                      value_if_not_categorical: str='Unknown') -> str:
    return 'Categorical' if uniqueness < uniqueness_threshold \
                            and n_values < n_values_at_least \
                        else value_if_not_categorical


def auto_detect_variable_types(df: pd.DataFrame) -> pd.DataFrame:
    dtypes_df = df.dtypes.to_frame().rename(columns={0: 'pd_type'})
    dtypes_df['var_type'] = None

    for var_name, var_type in dtypes_df.pd_type.items():
        n_values = df[var_name].nunique(dropna=True)
        uniqueness = n_values / len(df)
        if n_values <= 2:
            var_type = 'Boolean' if n_values==2 else 'Empty'
        elif var_type == 'int64':
            var_type = check_categorical(uniqueness, n_values, value_if_not_categorical='Numeric')
        elif var_type == 'float64':
            var_type = 'Numeric'
        elif var_type == 'object':
            checker_digit = df[var_name].apply(check_contain_digit)
            if checker_digit.all(skipna=True):
                checker_datetime = df[var_name].apply(check_datetime)
                if checker_datetime.all(skipna=True) and checker_datetime.sum(skipna=True)/len(df) > 0.89:
                    var_type = 'Datetime'
                else:
                    var_type = check_categorical(uniqueness, n_values)
            else:
                var_type = check_categorical(uniqueness, n_values, value_if_not_categorical='Text')

        dtypes_df.loc[var_name, 'var_type'] = var_type
        del var_type, n_values, uniqueness

    return dtypes_df


def test_auto_dtype_detection():
    data = pd.read_csv('datasets/sii_fraud/sii_fraud.csv')
    data_dtypes = auto_detect_variable_types(data)
    print(data_dtypes)


if __name__ == "__main__":
    test_auto_dtype_detection()






