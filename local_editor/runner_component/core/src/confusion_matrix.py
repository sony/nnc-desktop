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

logger = getLogger("confustion_matrix")
# TODO logger setup


# Dataset/OutputResult CSV Header Column pattern
#
#   VARNAME__INDEX:LABEL
#
COL_PATTERN = re.compile(r"(?P<modal>.*?)" \
                          "(?P<is_predict>')?" \
                          "(__(?P<dim>[0-9]+))?" \
                          "(:(?P<label>.*))?")


def create_output_sqlite(matrix, csv_header, output_result_mod, work_dir):
    conn = None
    try:
        for k, v in matrix.items():
            dbname = f'{work_dir}/{k}_output_result.db'
            conn = sqlite3.connect(dbname)

            sqlite_schema = list()

            sqlite_schema.append(csv_header[v["first_column_index"]])
            sqlite_schema.append(csv_header[v["index"]])

            for value in output_result_mod[0].values():
                for i in range(0, len(value[2:])):
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
        'index': 1,
        'dim': 1,
        'label': 'y:label',
        'predict_index': 2,
        'predict_dim': 10,
        'predict_label': [
          "y'__0", "y'__1", "y'__2", "y'__3", "y'__4",
          "y'__5", "y'__6", "y'__7", "y'__8", "y'__9",
        ],
      },
    }
    """

    modal_map = {}
    for index, col in enumerate(csv_header):
        matchs = COL_PATTERN.fullmatch(col)
        if not matchs:
            raise Exception('Illegal CSV header: "{}"'.format(col))

        modal = matchs.group('modal')
        if modal in modal_map:
            if matchs.group('is_predict'):
                try:
                    float(first_row[index])
                except ValueError:
                    continue
                if 'predict_index' not in modal_map[modal]:
                    modal_map[modal].update({
                        'predict_index': index,
                        'predict_dim': 1,
                    })
                elif (modal_map[modal]['predict_dim'] ==
                      (index - modal_map[modal]['predict_index'])):
                    modal_map[modal]['predict_dim'] += 1
            elif (modal_map[modal]['dim'] ==
                  (index - modal_map[modal]['index'])):
                modal_map[modal]['dim'] += 1
        elif not matchs.group('is_predict'):
            modal_map[modal] = {
                'index': index,
                'dim': 1,
            }

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
        if v['dim'] == 1:
            v['label'] = csv_header[v['index']]
        else:
            v['label'] = []
            for i in range(v['index'], v['index'] + v['dim']):
                v['label'].append(csv_header[i])

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
        'count': {
          (0, 0): 975,
          (0, 6): 3,
          (0, 7): 2,
          (1, 0): 2,
          (1, 1): 1128,
          (1, 3): 2,
            ...
          (9, 8): 1,
          (9, 9): 991,
        },
        'category_max': 9,

        'name': "y - y'",
        'index': 1,
        'dim': 1,
        'label': 'y:label',
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
        if v['dim'] == 1:
            category = float(csv_row[v['index']])
        else:
            values = []
            for i in range(v['index'], v['index'] + v['dim']):
                values.append(float(csv_row[i]))
            category = values.index(max(values))
        category = int(category)
        if category < 0 or 10000 < category:
            raise Exception('category value is wrong: {}'.format(category))

        values = []
        if v['predict_dim'] == 1:
            predict_category = round(float(csv_row[v['predict_index']]))
        else:
            for i in range(v['predict_index'],
                           v['predict_index'] + v['predict_dim']):
                values.append(float(csv_row[i]))
            predict_category = values.index(max(values))
        predict_category = int(predict_category)

        if not 'count' in v:
            v['count'] = {}
        count = v['count'].get((category, predict_category), 0)
        v['count'][(category, predict_category)] = count + 1

        category_max = v.get('category_max', -1)
        if category_max < category:
            v['category_max'] = category

        # calculate evaluate ranking
        higher_rank = list()
        higher_rank.append(csv_row[v['first_column_index']])
        higher_rank.append(csv_row[v['index']])

        rank_list = values[:]
        rank_count = 0
        if rank_list:
            rank_list.sort(reverse=True)
            for rank in rank_list:
                higher_rank.append(str(values.index(rank)))
                higher_rank.append(str(rank))
                rank_count += 1
                if rank_count == 3:
                    break
        else:
            higher_rank.append(str(predict_category))
            higher_rank.append(str(float(csv_row[v['predict_index']])))

        output_result_mod.append({
            k: higher_rank
        })


def compute_score(matrix):
    from statistics import mean

    for k, v in matrix.items():
        max = v['category_max'] + 1
        sum_all = 0
        sum_correct = 0
        sum_recall = {}
        sum_precision = {}
        recall = []
        precision = []
        for i in range(0, max):
            sum_recall[i] = 0
            for j in range(0, max):
                if j not in sum_precision:
                    sum_precision[j] = 0
                count = v['count'].get((i, j), 0)
                sum_all += count
                sum_recall[i] += count
                sum_precision[j] += count
                if i == j:
                    sum_correct += count
                    recall.append(count)
                    precision.append(count)

        # recall
        v['recall'] = []
        for i in range(0, max):
            r = recall[i]
            sum = sum_recall[i]
            v['recall'].append(r / sum if sum else 0)

        # precision
        v['precision'] = []
        for i in range(0, max):
            p = precision[i]
            sum = sum_precision[i]
            v['precision'].append(p / sum if sum else 0)

        # f measures
        v['f_measures'] = []
        for i in range(0, max):
            # harmonic_mean
            r = v['recall'][i]
            p = v['precision'][i]
            v['f_measures'].append(2 * r*p/(r+p) if (r+p) else 0)

        # accuracy
        v['accuracy'] = sum_correct / sum_all if sum_all else 0

        # averages
        v['avg_precision'] = mean(v['precision'])
        v['avg_recall'] = mean(v['recall'])
        v['avg_f_measures'] = mean(v['f_measures'])


def summarize_score(matrix):
    for k, v in matrix.items():
        v['recall_label'] = ["true-positive", "false-positive 1st", "false-positive 2nd", "false-positive 3rd", "other"]
        v['precision_label'] = ["true-positive", "false-negative 1st", "false-negative 2nd", "false-negative 3rd", "other"]
        v['recall_count'] = {}
        v['precision_count'] = {}
        max = v['category_max'] + 1
        for i in range(0, max):
            recall_count = {}
            remaining_recall_count = 0
            for j in range(0, max):
                count = v['count'].get((i, j), 0)
                if count:
                    predict_label = '{}={}'.format(v['predict_label'], j) if v['predict_dim'] == 1 else v['predict_label'][j]
                    if i == j:
                        v['recall_count'][(i, 0)] = predict_label + ": " + str(count)
                    else:
                        recall_count[predict_label] = count

            for index, (key, value) in enumerate(sorted(recall_count.items(), key=lambda x:-x[1])):
                if index < 3:
                    v['recall_count'][(i, index + 1)] = str(key) + ": " + str(value)
                else:
                    remaining_recall_count += value

            v['recall_count'][(i, 4)] = remaining_recall_count

        for j in range(0, max):
            precision_count = {}
            remaining_precision_count = 0
            for i in range(0, max):
                count = v['count'].get((i, j), 0)
                if count:
                    training_label = '{}={}'.format(v['label'], i) if v['dim'] == 1 else v['label'][i]
                    if i == j:
                        v['precision_count'][(j, 0)] = training_label + ": " + str(count)
                    else:
                        precision_count[training_label] = count

            for index, (key, value) in enumerate(sorted(precision_count.items(), key=lambda x:-x[1])):
                if index < 3:
                    v['precision_count'][(j, index + 1)] = str(key) + ": " + str(value)
                else:
                    remaining_precision_count += value

            v['precision_count'][(j, 4)] = remaining_precision_count


def original_formatter(v):
    max = v['category_max'] + 1
    matrix = []

    def add_row(func):
        size = max + 2
        row = (list(func()) + [''] * size)[:size]
        matrix.append(row)

    # STATISTICS
    add_row(lambda: ['Accuracy', v['accuracy']])
    add_row(lambda: ['Avg.Precision', v['avg_precision']])
    add_row(lambda: ['Avg.Recall', v['avg_recall']])
    add_row(lambda: ['Avg.F-Measures', v['avg_f_measures']])

    # SEPARTOR
    add_row(lambda: [])

    # HEADER
    add_row(lambda:
            ['']
            + ['Recall']
            + [
                (
                    '{}={}'.format(v['predict_label'], i)
                    if v['predict_dim'] == 1 else
                    v['predict_label'][i]
                )
                for i in range(0, max)
            ]
    )

    # MATRIX
    add_row(lambda:
            ['Precision']
            + ['']
            + [v['precision'][i] for i in range(0, max)]
    )
    add_row(lambda:
            ['F-Measures']
            + ['']
            + [v['f_measures'][i] for i in range(0, max)]
    )

    for i in range(0, max):
        add_row(lambda:
                [
                    # ROW HEADER
                    '{}={}'.format(v['label'], i)
                    if v['dim'] == 1 else
                    v['label'][i]
                ]
                + [v['recall'][i]]
                + [v['count'].get((i, j), 0) for j in range(0, max)]
        )

    return matrix


def new_formatter(v, isPrecision):
    if (isPrecision):
        max_columns = len(v['precision_label'])
        column_size = max_columns + 3
    else:
        max_columns = len(v['recall_label'])
        column_size = max_columns + 2

    max_rows = v['category_max'] + 1
    matrix = []

    def add_row(func):
        size = column_size
        row = (list(func()) + [''] * size)[:size]
        matrix.append(row)

    # STATISTICS
    add_row(lambda: ['Accuracy', v['accuracy']])
    add_row(lambda: ['Avg.Precision', v['avg_precision']])
    add_row(lambda: ['Avg.Recall', v['avg_recall']])
    add_row(lambda: ['Avg.F-Measures', v['avg_f_measures']])

    # SEPARTOR
    add_row(lambda: [])

    if (isPrecision):
        # HEADER
        add_row(lambda:
                ['']
                + ['Precision']
                + ['F-Measures']
                + [
                    (
                        v['precision_label'][i]
                    )
                    for i in range(0, max_columns)
                ]
        )

        # MATRIX
        for i in range(0, max_rows):
            add_row(lambda:
                    [
                        # ROW HEADER
                        '{}={}'.format(v['predict_label'], i)
                        if v['predict_dim'] == 1 else
                        v['predict_label'][i]
                    ]
                    + [v['precision'][i]]
                    + [v['f_measures'][i]]
                    + [v['precision_count'].get((i, j), 0) for j in range(0, max_columns)]
            )
    else:
        # HEADER
        add_row(lambda:
                ['']
                + ['Recall']
                + [
                    (
                        v['recall_label'][i]
                    )
                    for i in range(0, max_columns)
                ]
        )

        # MATRIX
        for i in range(0, max_rows):
            add_row(lambda:
                    [
                        # ROW HEADER
                        '{}={}'.format(v['label'], i)
                        if v['dim'] == 1 else
                        v['label'][i]
                    ]
                    + [v['recall'][i]]
                    + [v['recall_count'].get((i, j), 0) for j in range(0, max_columns)]
            )

    return matrix


def format_matrix(matrix, work_dir):
    formatted = {}
    new_formatted = {}
    for k, v in matrix.items():
        formatted[v['name']] = original_formatter(v)
        new_formatted[v['name'] + ": Recall"] = new_formatter(v, False)
        new_formatted[v['name'] + ": Precision"] = new_formatter(v, True)

    if new_formatted:
        f = open(f'{work_dir}/classification_matrix.json', "w")
        json.dump(new_formatted, f)

    return formatted


def create_confusion_matrix(output_result_csv, work_dir):
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

    compute_score(matrix)
    summarize_score(matrix)
    return format_matrix(matrix, work_dir)


def main(argv):
    output_result_csv = argv[1]
    work_dir = argv[2]
    confusion_matrix = create_confusion_matrix(output_result_csv, work_dir)
    if len(confusion_matrix):
        json.dump(confusion_matrix, sys.stdout)


if __name__ == '__main__':
    try:
        main(sys.argv)
    except:
        import traceback
        logger.error(traceback.format_exc())
