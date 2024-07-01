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

import base64
import os
import csv
import shutil
import imageio
import librosa
import numpy as np
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
from tempfile import NamedTemporaryFile

from local_util.image_util import resize_image

IMAGES = [
    'image/bmp',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/tiff',
    'image/dicom'
]
MAX_PREVIEW_SIZE = 100
THRESHOLD_ROWS = 248
THRESHOLD_COLS = 10
HEIGHT = 2.56
WIDTH = 2.56


class CacheJsonData(object):
    def __init__(self, path):
        self.path = path

    def to_base64(self):
        if not os.path.exists(self.path):
            print("cache.json base64 encode faild for file not exist.")
            return 
                    
        try:
            with NamedTemporaryFile(mode='w+b', delete=False) as tmpfile:
                _, ext = os.path.splitext(self.path)
                if ext.lower() == '.csv':
                    self._csv_plot_hander(tmpfile)
                elif ext.lower() == '.wav':
                    self._wav_plot_hander(tmpfile)
                else:
                    with open(self.path, 'rb') as imagef:
                        tmpfile.write(imagef.read())

            resize_image(tmpfile.name, MAX_PREVIEW_SIZE)
            return base64.b64encode(open(tmpfile.name, 'rb').read()).decode('UTF-8')
        except Exception as e:
            raise Exception("cache.json base64 encode faild.")
        finally:
            os.remove(tmpfile.name)

    def _csv_plot_hander(self, tmpfile):
        f = open(self.path, "r")
        download_csv = csv.reader(f)

        records = []
        record_cnt = 0
        for row in download_csv:
            records.append(row[0:THRESHOLD_COLS])
            record_cnt += 1
            if THRESHOLD_ROWS == record_cnt:
                break
        fig, ax = plt.subplots(nrows=1, ncols=1)
        fig.set_figheight(HEIGHT)
        fig.set_figwidth(WIDTH)
        ax.plot(np.array(records, dtype=np.float32))

        fig.savefig(tmpfile)
        plt.close(fig)

    def _wav_plot_hander(self, tmpfile):
        def read_wav_file(wav_file, num_frame=-1, just_take_one_channel=True):
            """
            :param wav_file: file path
            :return: numpy data of wav, shape is TC (T is time, C is channel), type: float32
            """
            w, _ = librosa.load(wav_file, mono=False, sr=None)
            if len(w.shape) == 1:
                w = w.reshape(-1, w.shape[0])
            data = np.moveaxis(w, 0, 1)
            _num_frame = data.shape[0]
            if num_frame > 0:
                _num_frame = min(_num_frame, num_frame)
                data = data[:_num_frame, ::]
            if just_take_one_channel:
                return data[::, 0:1]
            else:
                return data
            
        def render_series_data(series_data):
            fig, ax = plt.subplots(nrows=1, ncols=1)
            fig.set_figheight(HEIGHT)
            fig.set_figwidth(WIDTH)
            ax.plot(series_data)
            fig.savefig(tmpfile)
            plt.close(fig)
            
        data = read_wav_file(self.path)
        render_series_data(data)