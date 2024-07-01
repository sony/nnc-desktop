#! /usr/bin/env python3
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


import csv
import json
import re
import sqlite3
import sys
from logging import getLogger

logger = getLogger("infer_result_handle")
# TODO logger setup


# Dataset/OutputResult CSV Header Column pattern
#
#   VARNAME__INDEX:LABEL
#
COL_PATTERN = re.compile(r"(?P<modal>.*?)" \
                          "(?P<is_predict>')?" \
                          "(__(?P<dim>[0-9]+))?" \
                          "(:(?P<label>.*))?")
TOP_N = 3

def create_output_sqlite(matrix, csv_header, output_result_mod, work_dir):
    conn = None
    try:
        for k, v in matrix.items():
            dbname = f'{work_dir}/{k}_infer_result.db'
            conn = sqlite3.connect(dbname)

            sqlite_schema = list()

            sqlite_schema.append(csv_header[v["first_column_index"]])

            for value in output_result_mod[0].values():
                for i in range(0, len(value[v["predict_index"]:])):
                    if i == 0:
                        sqlite_schema.append(f"{k}''__1st")
                    if i == 1:
                        sqlite_schema.append(f"{k}''__1st_value")
                    if i == 2:
                        sqlite_schema.append(f"{k}''__2nd")
                    if i == 3:
                        sqlite_schema.append(f"{k}''__2nd_value")
                    if i == 4:
                        sqlite_schema.append(f"{k}''__3rd")
                    if i == 5:
                        sqlite_schema.append(f"{k}''__3rd_value")

            c = conn.cursor()
            c.execute("create table outputs ('%s')" % sqlite_schema[0])
            for column in sqlite_schema[1:]:
                c.execute("alter table outputs add column '%s'" % column)

            insert_values = []
            values_key_num = []
            for output_column in output_result_mod:
                if k not in output_column:
                    continue
                # set insert value num
                if not values_key_num:
                    for i in range(0, len(output_column[k])):
                        values_key_num.append('?')
                    values_key_num = ','.join(values_key_num)

                # set inset value
                values = []
                for value in output_column[k]:
                    values.append(f'{value}')
                insert_values.append(tuple(values))

            insert_sql = f'insert into outputs values ({values_key_num})'
            c.executemany(insert_sql, insert_values)
            conn.commit()
    finally:
        if conn:
            conn.close()


def extract_modals(csv_header, first_row):
    """Extract modals from `output_result.csv` header.

    result_map_sample = {
      'y' : {
        'name': "y - y'",
        'predict_index': 2,
        'predict_dim': 10,
        'predict_label': [
          "y'__0", "y'__1", "y'__2", "y'__3", "y'__4",
          "y'__5", "y'__6", "y'__7", "y'__8", "y'__9",
        ],
      },
    }
    """

    def handle_predict():
        try:
            float(first_row[index])
        except ValueError:
            raise ValueError
        if 'predict_index' not in modal_map[modal]:
            modal_map[modal].update({
                'predict_index': index,
                'predict_dim': 1,
            })
        elif (modal_map[modal]['predict_dim'] ==
                (index - modal_map[modal]['predict_index'])):
            modal_map[modal]['predict_dim'] += 1

    modal_map = {}
    for index, col in enumerate(csv_header):
        matchs = COL_PATTERN.fullmatch(col)
        if not matchs:
            raise Exception('Illegal CSV header: "{}"'.format(col))

        modal = matchs.group('modal')
        if modal in modal_map:
            if matchs.group('is_predict'):
                try:
                    handle_predict()
                except ValueError:
                    continue
            elif (modal_map[modal]['dim'] ==
                  (index - modal_map[modal]['index'])):
                modal_map[modal]['dim'] += 1
        else:
            if not matchs.group('is_predict'):
                modal_map[modal] = {
                    'index': index,
                    'dim': 1,
                }
            else:
                modal_map[modal] = {}
                try:
                    handle_predict()
                except ValueError:
                    continue

    first_column_index = 0
    k, v = next(filter(lambda item: 'predict_index' not in item[1],
                       modal_map.items()), (None, None))
    if v:
        first_column_index = v['index']

    result_map = {}
    for k, v in filter(lambda item: 'predict_index' in item[1],
                       modal_map.items()):
        v['name'] = "{} - {}'".format(k, k)
        v['first_column_index'] = first_column_index
        result_map.update({k: v})

    for k, v in result_map.items():
        if v['predict_dim'] == 1:
            v['predict_label'] = csv_header[v['predict_index']]
        else:
            v['predict_label'] = []
            for i in range(v['predict_index'],
                           v['predict_index'] + v['predict_dim']):
                v['predict_label'].append(csv_header[i])

    return result_map


def countup_result(matrix, csv_row, output_result_mod):
    """Summarize output_result.csv record into maxtrix.

    matrix_sample = {
      'y' : {
        'name': "y - y'",
        'predict_index': 2,
        'predict_dim': 10,
        'predice_label': [
          "y'__0", "y'__1", "y'__2", "y'__3", "y'__4",
          "y'__5", "y'__6", "y'__7", "y'__8", "y'__9",
        ],
      },
    }
    """

    for k, v in matrix.items():
        values = []
        if v['predict_dim'] == 1:
            predict_category = round(float(csv_row[v['predict_index']]))
        else:
            for i in range(v['predict_index'],
                           v['predict_index'] + v['predict_dim']):
                values.append(float(csv_row[i]))
            predict_category = values.index(max(values))
        predict_category = int(predict_category)

        # calculate evaluate ranking
        higher_rank = list()
        higher_rank.append(csv_row[v['first_column_index']])

        rank_list = values[:]
        if rank_list:
            rank_list.sort(reverse=True)
            for i, rank in enumerate(rank_list):
                if i == TOP_N:
                    break
                higher_rank.append(str(values.index(rank)))
                higher_rank.append(str(rank))
        else:
            higher_rank.append(str(predict_category))
            higher_rank.append(str(float(csv_row[v['predict_index']])))

        output_result_mod.append({
            k: higher_rank
        })


def create_classification_result(output_result_csv, work_dir):
    with open(output_result_csv, "rt") as csv_file:
        csv_reader = csv.reader(csv_file)

        csv_header = csv_reader.__next__()
        first_row = csv_reader.__next__()
        matrix = extract_modals(csv_header, first_row)

        output_result_mod = []
        countup_result(matrix, first_row, output_result_mod)
        for csv_row in csv_reader:
            countup_result(matrix, csv_row, output_result_mod)

        # create sqlite db
        create_output_sqlite(matrix, csv_header, output_result_mod, work_dir)
