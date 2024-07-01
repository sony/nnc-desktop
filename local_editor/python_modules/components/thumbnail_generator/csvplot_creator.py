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
import base64
import tempfile
import numpy as np

THRESHOLD_ROWS = 248
THRESHOLD_COLS = 10
HEIGHT = 2.56
WIDTH = 2.56


def csv_plot_hander(file_path: str):
    import matplotlib
    matplotlib.use('agg')
    import matplotlib.pyplot as plt

    with tempfile.TemporaryFile(mode='w+b') as temp:
        f = open(file_path, 'r')
        csv_reader = csv.reader(f)

        records = []
        record_cnt = 0
        for row in csv_reader:
            records.append(row[0:THRESHOLD_COLS])
            record_cnt += 1
            if THRESHOLD_ROWS == record_cnt:
                break
        fig, ax = plt.subplots(nrows=1, ncols=1)
        fig.set_figheight(HEIGHT)
        fig.set_figwidth(WIDTH)
        ax.plot(np.array(records, dtype=np.float32))

        fig.savefig(temp)
        plt.close()

        # translate to base64
        temp.seek(0)
        csv_base64 = base64.b64encode(temp.read()).decode("utf-8")
        return csv_base64
