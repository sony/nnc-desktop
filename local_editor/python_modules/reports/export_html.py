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

import configparser
import os
import csv
import base64
from PIL import Image
import random
from tempfile import TemporaryFile
from conf.settings import DATASETS_DIR

MAX_PREVIEW_SIZE = 100


def get_index_csv_path(dataset_uri):
    full_path = os.path.join(DATASETS_DIR, dataset_uri, "index.csv")
    if not os.path.exists(full_path):
        raise Exception('Not found dataset index file.')
    return full_path


def to_base64(image_path, resize=None):
    with TemporaryFile(mode="w+b") as temp:

        # resize the width and height of image
        with Image.open(image_path) as image:
            width, height = image.size
            if resize is not None and (resize < width or resize < height):
                size = (resize, resize)
                image.thumbnail(size, Image.ANTIALIAS)
            image.save(temp, 'PNG')

        temp.seek(0)
        img_base64 = base64.b64encode(temp.read()).decode("utf-8")

    return img_base64



def digit_str(value):
    return str('{:,}'.format(value))


def dataset_image_report(dataset_path, dataset_name, rows, types,
                        variables, starts, dims, labels, report, temp_dir):
    title = 'Examples of variable'
    index = []
    for i, (file_type, variable) in enumerate(zip(types, variables)):
        if file_type == 'Image' or file_type == 'Array of image':
            title += (', ' if len(index) else '') + variable
            index.append(i)
    
    if len(index) <= 0:
        return
    
    report.html.append('<p>' + title + 'in "' + dataset_name + '"</p>')
    row_index = [i for i in range(len(rows) - 1)]
    random.shuffle(row_index)
    row_index = row_index[:10]

    imgs = ''
    for ir in row_index:
        for idx in index:
            for id in range(dims[idx]):
                local_img_path = os.path.join(dataset_path, rows[ir + 1][starts[idx] + id])
                if os.path.exists(local_img_path):
                    base64_data = to_base64(local_img_path, MAX_PREVIEW_SIZE)
                else:
                    base64_data = ""
                imgs +=  '<img src="data:image/png;base64,' + base64_data + '">'
            imgs += ' '
        imgs += ' '
    report.html.append(imgs)    


def dataset_report(args, config, report, output_dir):
    from imageio import imread

    num_dataset = int(config["Dataset"]['Num'])

    for i in range(num_dataset):
        dataset_config = config["Dataset_" + str(i)]
        dataset_uri = dataset_config['URI']
        if not dataset_uri:
            continue
        index_csv_path = get_index_csv_path(dataset_uri)
        with open(index_csv_path, "r") as f:
            dataset_name = dataset_config["Name"]
            report.html.append('<h2>Dataset : ' + dataset_name + '</h2>')
            report.html.append('<ul>')

            reader = csv.reader(f)
            rows = [row for row in reader]

            report.html.append('<li>Number of data : ' + digit_str(len(rows)-1) + '</li>')

            starts = []
            variables = []
            types = []
            labels = []
            dims = []
            for ic, (cell, data) in enumerate(zip(rows[0], rows[1])):
                label = cell.split(":")
                variable = label[0].split("__")[0]
                label = label[1] if len(label) > 1 else ''
                file_type = os.path.splitext(data)[1].lower()
                if file_type == '.csv':
                    file_type = 'Matrix'
                elif file_type in ['.bmp', '.jpeg', '.jpg', '.png', '.gif', '.tif', '.tiff', '.dcm']:
                    file_type = 'Image'
                else:
                    file_type = 'Scalar'
        
                if len(variables) and variables[-1] == variable:
                    dims[-1] += 1
                    labels[-1].append(label)
                    if types[-1] == 'Matrix':
                        types[-1] = 'Tensor'
                    elif types[-1] == 'Image':
                        types[-1] = 'Array of image'
                    else:
                        types[-1] = 'vector'
                else:
                    starts.append(ic)
                    variables.append(variable)
                    types.append(file_type)
                    dims.append(1)
                    labels.append([label])

            dataset_path = os.path.dirname(index_csv_path)
            for start, variable, file_type, dim, label in zip(starts, variables, types, dims, labels):
                report.html.append('<li>Variable : ' + variable + (
                    ' (' + label[0] + ') ' if len(label) == 1 and label[0] else '') + '</li>')
                report.html.append('<li>Type : ' + file_type + '</li>')

                if file_type != "Scalar":
                    if file_type == 'Vector':
                        shape = str(dim)
                    elif file_type == 'Image' or file_type == 'Array of image':
                        local_image_path = os.path.join(dataset_path, rows[1][start])
                        if not os.path.exists(local_image_path):
                            raise Exception(f"Failed to get image. ({rows[1][start]})")
                        
                        im = imread(local_image_path)
                        shape = str(im.shape[0]) + ', ' + str(im.shape[1])
                        if len(im.shape) > 2:
                            shape = str(im.shape[2]) + ', ' + shape
                        else:
                            shape = '1, ' + shape
                        if dim > 1:
                            shape = str(dim) + ', ' + shape
                    else:
                        dataset_field_path = os.path.join(dataset_path, rows[1][start])
                        if not os.path.exists(dataset_field_path):
                            raise Exception(f"Failed to get local dataset path. ({rows[1][start]})")
                        with open(dataset_field_path, 'r') as f:
                            data_reader = csv.reader(f)
                            data_rows = [row for row in data_reader]
                            shape = str(len(data_rows)) + ", " + str(len(data_rows[0]))
                    
                    report.html.append('<li>Shape : ' + shape + '</li>')
            report.html.append('</ul>')

            dataset_image_report(dataset_path, dataset_name, rows, types,
                                variables, starts, dims, labels, report, output_dir)


def network_report(args, config, report, output_dir):
    if 'NumNetwork' in config['Global']:
        num_network = int(config['Global']['NumNetwork'])
        network_names = [config['Global'][f'Network_{i}'] for i in range(num_network)]
        prefixes = [n + '_' for n in network_names]
    else:
        num_network = 1
        network_names = ["Main"]
        prefixes = ['']
    
    for name, prefix in zip(network_names, prefixes):
        global_config = config[prefix + 'Network_Global']

        # title 
        report.html.append('<h2>Network Architecture : ' + name + '</h2>')

        # network image
        img_path = global_config["Image"]
        if img_path is None:
            report.html.append('<img src="data:image/png;base64,">')
        else:
            report.html.append('<img src="data:image/png;base64,' + to_base64(img_path) + '">')

        # statistics
        statistics_config = config[prefix + 'Statistics']
        num_statistics = int(statistics_config['NumStatistics'] if 'Numstatistics' in statistics_config else 0)
        if num_statistics:
            report.html.append('<table border=1><tr><th>Type</th><th>Value</th></tr>')
            for i2 in range(num_statistics):
                key = 'Statistics_' + str(i2)
                report.html.append('<tr><td>' + statistics_config[key + '_Name'] + '</td><td>' + 
                        digit_str(int(statistics_config[key + '_Sum'])) + '</td></tr>')
            report.html.append('</table>')


def config_report(args, config, report):
    epoch = int(config["Config"]['MaxEpoch'])
    batch_size = int(config["Config"]['BatchSize'])
    num_optimizer = int(config["Config"]['NumOptimizer'])

    # optimizer
    for i in range(num_optimizer):
        optimizer_config = config['Optimizer_' + str(i)]

        report.html.append('<h2>Training Procedure : ' + optimizer_config['Optimizer_Name'] + '</h2>')
        report.html.append(
            '<p>Optimize network "' + optimizer_config['Optimizer_NetworkName'] + '" using "'
            + optimizer_config['Optimizer_DatasetName'] + '" dataset.</p>')
        report.html.append('<ul>')

        # batch size
        accum_times = int(optimizer_config['UpdateInterval'])
        report.html.append('<li>Batch size: ' + str(batch_size * accum_times) + '</li>')
        if accum_times > 1:
            report.html.append('<ul>')
            report.html.append('<li>by accumulating the result of batch-size' + str(batch_size)
                    + 'by' + str(accum_times) + ' times.</li>')
            report.html.append('</ul>')
        
        # solver
        report.html.append('<li>Solver : ' + optimizer_config['SolverName'] + '</li>')
        report.html.append('<ul>')
        lr_multiplier = float(optimizer_config['LearningRateMultiplier'])
        lr_update_interval = int(optimizer_config['LearningRateUpdateInterval'])

        # solver : learning rate
        learning_rate_text = 'Learning rate'
        if optimizer_config['SolverParameterName_0'] != 'LearningRate':
            learning_rate_text += '(' + optimizer_config['SolverParameterName_0'] + ')'
        learning_rate_text += ': ' + optimizer_config['SolverParameter_0']
        report.html.append('<li>' + learning_rate_text + '</li>')
        if lr_multiplier != 1.0:
            report.html.append('<ul>')
            report.html.append(
                '<li>decayed every ' + digit_str(lr_update_interval // accum_times)
                + ' iteration using an exponential rate of ' + str(lr_multiplier) + '.</li>')
            report.html.append('</ul>')

        # solver: other parameters
        num_slover_paramter = int(optimizer_config['SolverParameterNum'])
        for ip in range(num_slover_paramter - 1):
            report.html.append(
                '<li>' + optimizer_config['SolverParameterName_' + str(ip+1)]
                + ': ' + optimizer_config['SolverParameter_' + str(ip+1)] + '</li>')
            report.html.append('</ul>')
        
        # weight decay
        weight_decay = float(optimizer_config['WeightDecay'])
        report.html.append('<li>Weight decay '
                + (': ' + str(weight_decay) if weight_decay != 0 else 'is not applied.</li>'))
        report.html.append('</ul>')


def experimental_result_report(args, config, report, output_dir):
    if 'Result' not in config:
        return
    if 'LearningCurve_Image' in config['Result']:
        # title
        report.html.append('<h2>Experimental Result : Learning Curve</h2>')

        # learning curve image
        img_path = config['Result']['LearningCurve_Image']
        report.html.append('<img src="data:image/png;base64,' + to_base64(img_path) + '">')

    num_confusion_matrix = int(config['Result']['NumConfusionMatrix'])
    if num_confusion_matrix:
        # title
        report.html.append('<h2>Experimental Result : Evaluation</h2>')

        # executor
        num_executor = int(config['Config']['NumExecutor'])
        for i in range(num_executor):
            executor_config = config['Executor_' + str(i)]
            report.html.append(
                '<p>Evaluate network "' + executor_config['Executor_NetworkName'] + '" using "'
                + executor_config['Executor_DatasetName'] + '" dataset.</p>')
            report.html.append('<ul>')

            num_evaluation = int(executor_config['NumEvaluations'])
            if num_evaluation > 1:
                repeat_evaluation_type = int(executor_config['RepeatEvaluationType'])
                with_back_propagation = int(executor_config['NeedBackPropagation'])
                report.html.append(
                    '<li>The calculation is executed ' + str(num_evaluation) + ' times for each data'
                    + ('with back propagation' if with_back_propagation else '.') + '</li>')
                report.html.append(
                    '<li> The ' + ('last' if repeat_evaluation_type else 'average')
                    + ' value is used as a final output.</li>')
            report.html.append('</ul>')

        for i in range(num_confusion_matrix):
            confusion_matrix_file_name = config['Result']['ConfusionMatrix_' + str(i)]
            confusion_matrix_path = os.path.join(os.path.dirname(args.input), confusion_matrix_file_name)

            variable_name = os.path.split(confusion_matrix_path)[1].replace('confusion_matrix_', "").replace('.csv', '')
            report.html.append('<p>Variable : ' + variable_name + '</p>')
            report.html.append('<ul>')
            with open(confusion_matrix_path, 'r') as f:
                reader = csv.reader(f)

                rows = [row for row in reader]
                for i in range(4):
                    row = rows[len(rows) - 4 + i]
                    report.html.append('<li>' + row[0] + ' : ' + row[1] + '</li>')
            report.html.append('</ul>')


def references(args, config, report):
    report.html.append('<h2>References</h2>')
    report.html.append('<ul>')

    report.html.append(
        '<li>Sony Corporation. Neural Network Console : Not just train and evaluate. You can design neural networks with fast and intuitive GUI. https://dl.sony.com/</li>')

    report.html.append(
        '<li>Sony Corporation. Neural Network Libraries : An open source software to make research, development and implementation of neural network more efficient. https://nnabla.org/</li>')

    num_reference = int(config['Reference']['NumReference'])
    for i in range(num_reference):
        report.html.append('<li>' + config['Reference']['ReferenceLayer_' + str(i)] + ' - ' + config['Reference'][
            'Reference_' + str(i)].replace('\\n', ',\t') + '</li>')
    report.html.append('</ul>')



def create_html_report(args):
    config = configparser.ConfigParser()
    config.read(args.input)

    class Report:
        pass
    
    report = Report()
    report.html = []

    report.html.append('<h1>' + config['Global']['ProjectName'] + '</h1>')
    if args.nickname is not None:
        report.html.append("<p>Posted by " + args.nickname + '</p>')
    if args.import_url is not None:
        report.html.append(
            '<p><a href="' + args.import_url + '" target="_top" class="button">'
            'Copy the project to Neural Network Console</a></p>'
        )
    report.html.append('<p>' + config['Description']['Text'].replace('\\n', '</p><p>') + '</p>')

    # output_dir
    output_dir = os.path.dirname(args.output)

    # dataset report
    dataset_report(args, config, report, output_dir)

    # network report
    network_report(args, config, report, output_dir)

    # config report
    config_report(args, config, report)

    #experimental result report
    experimental_result_report(args, config, report, output_dir)

    # references
    references(args, config, report)

    # save presentation
    report.html = [line + '\n' for line in report.html]
    with open(args.output, mode='wt') as f:
        f.writelines(report.html)
    