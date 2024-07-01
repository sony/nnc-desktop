# Copyright 2024 Sony Group Corporation.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import csv

from utils.consts import consts
from utils.logger import Logger, Code, BaseError

logger = Logger()


def _check_csv_null(filename):
    size = os.path.getsize(filename)
    if size == 0:
        logger.error(f"csv file({os.path.basename(filename)}) is null.")
        raise BaseError(
            'csv file is null, Dataset is no data.',
            Code.E_DATASET_EMPTY
        )


def _check_ascii(item):
    try:
        item.encode('ascii')
    except UnicodeEncodeError:
        logger.error(f"the strings[{item}] error occurs in ascii_check")
        raise BaseError(
            f'Exists invalid strings[{item}].',
            Code.E_DATASET_INVALID_STRING_DATA
        )


def _check_number(item):
    try:
        float(item)
        return True
    except ValueError:
        return False


def _check_exist_file(dataset_dir, item):
    file_path = '{}/{}'.format(dataset_dir, item)
    if not os.path.exists(file_path):
        logger.error(f'Data file not found[{item}]')
        raise BaseError(
            f'Data file not found[{item}].',
            Code.E_DATASET_NOT_FOUND_INPUT_DATA_FILE
        )


# Check the contents of CSV for graph used in plot
def _check_plot_csv_data(filename):
    csv_list = []

    _check_csv_null(filename)

    with open(filename, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            csv_list.append(row)
    for row in csv_list:
        for item in row:
            _check_ascii(item)
            if not _check_number(item):
                logger.error('plot_csv_data is not number.')
                raise BaseError(
                    'Input csv data must be number.',
                    Code.E_DATASET_INCLUDE_STRING_DATA_TO_INPUT_CSV
                )


def _check_column_null(item):
    if item.strip() == "":
        logger.error('Null data found.')
        raise BaseError(
            'Exists null data in csv file.',
            Code.E_DATASET_INCLUDE_NULL_DATA
        )


def check_csv_data(filename):
    extention_str = []
    csv_list = []
    dataset_dir = os.path.dirname(filename)
    
    # Check if size is not 0
    _check_csv_null(filename)

    with open(filename, 'r') as f:
        reader = csv.reader(f)
        try:
            for row in reader:
                csv_list.append(row)
        except UnicodeDecodeError:
            logger.error("csv can not read.")
            raise BaseError(
                'Include invalid string.',
                Code.E_DATASET_INVALID_STRING_DATA
            )
        
        # If Only a line, it's a header and an error occurs.
        if 1 == len(csv_list):
            logger.error('Header only.')
            raise BaseError(
                'Dataset is header only.',
                Code.E_DATASET_HEADER_ONLY
            )
        
        # Put the data format of the second line in the array
        for item in csv_list[1]:

            # Check if the character code is supported
            _check_ascii(item)

            # If it's a number, add it to the extension check
            if _check_number(item):
                extention_str.append('number')

            # If it is not a number, check if the extension is supported
            elif os.path.splitext(item)[1].lower() in consts.IMAGE_CONTENT_TYPE:
                _check_exist_file(dataset_dir, item)
                extention_str.append(os.path.splitext(item)[1])
            elif os.path.splitext(item)[1].lower() in consts.AUDIO_CONTENT_TYPE:
                _check_exist_file(dataset_dir, item)
                extention_str.append(os.path.splitext(item)[1])
            elif os.path.splitext(item)[1].lower() in consts.PLOT_CONTENT_TYPE:
                _check_exist_file(dataset_dir, item)
                extention_str.append(os.path.splitext(item)[1])
                file_path = f'{dataset_dir}/{item}'
                # Check the data contents of the input csv data file
                _check_plot_csv_data(file_path)
            else:
                logger.error('Invalid cloum data')
                raise BaseError(
                    f'Invalid column data[{item}]',
                    Code.E_DATASET_INVALID_COLUMN_DATA
                )
        
        # Check if the 3rd line data is the same as the 2nd line data format
        csv_list_comparison = csv_list[2:]
        record_count = 3
        for row in csv_list_comparison:
            column_index = 0
            for item in row:
                # Check if the character code is supported
                _check_ascii(item)

                # if null, throw exception
                _check_column_null(item)

                # Check if the extension is the same as the 2nd line
                mismatch = False
                if _check_number(item):
                    if not extention_str[column_index] is 'number':
                        mismatch = True
                elif os.path.splitext(item)[1].lower() in consts.IMAGE_CONTENT_TYPE:
                    _check_exist_file(dataset_dir, item)
                    if not os.path.splitext(item)[1] == extention_str[column_index]:
                        mismatch = True
                elif os.path.splitext(item)[1].lower() in consts.AUDIO_CONTENT_TYPE:
                    _check_exist_file(dataset_dir, item)
                    if not os.path.splitext(item)[1] == extention_str[column_index]:
                        mismatch = True
                elif os.path.splitext(item)[1].lower() in consts.PLOT_CONTENT_TYPE:
                    _check_exist_file(dataset_dir, item)
                    if not os.path.splitext(item)[1] == extention_str[column_index]:
                        mismatch = True
                    else:
                        file_path = f'{dataset_dir}/{item}'
                        _check_plot_csv_data(file_path)
                else:
                    mismatch = True
                
                if mismatch:
                    logger.error('Data_extention mismatch. line:{}, column num:{}'.format(
                        record_count,
                        column_index + 1
                    ))
                    raise BaseError(
                        'Dataset is invalid format.',
                        Code.E_DATASET_INVALID_FORMAT
                    )
                column_index += 1
            
            # Increase the count for each line processing
            record_count += 1
                    

