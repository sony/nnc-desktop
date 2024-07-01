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
import base64
import shutil
import tempfile
from PIL import Image

from components.thumbnail_generator.csvplot_creator import csv_plot_hander
from components.thumbnail_generator.image_util import resize_image

CSV_EXTENSION = '.csv'
MAX_PREVIEW_SIZE = 100


class ThumbnailGenerator(object):
    
    @classmethod
    def handle_record(cls, file_path: str, thumb_path: str):
        with tempfile.TemporaryDirectory() as temp_dir:
            file_name = os.path.basename(file_path)
            temp_image_path = os.path.join(temp_dir, file_name)

            cls._create_thumbnail(file_path, temp_image_path)
            # cls._resize_image(temp_image_path, thumb_path)
            resize_image(temp_image_path, thumb_path, MAX_PREVIEW_SIZE)
    
    @classmethod
    def _create_thumbnail(cls, file_path: str, temp_image_path: str):
        ext = os.path.splitext(file_path)[1]
        if ext == CSV_EXTENSION:
            cls._create_thumbnail_from_csv(file_path, temp_image_path)
        else:
            cls._create_thumbnail_from_iamge(file_path, temp_image_path)

    @classmethod
    def _create_thumbnail_from_iamge(cls, file_path: str, temp_image_path: str):
        shutil.copy(file_path, temp_image_path)

    @classmethod
    def _create_thumbnail_from_csv(cls, file_path: str, temp_image_path: str):
        base64img = csv_plot_hander(file_path)
        with open(temp_image_path, 'wb') as f:
            f.write(base64.b64decode(base64img))
    
    @classmethod
    def _resize_image(cls, temp_image_path: str, thumb_path: str):
        with Image.open(temp_image_path) as image:
            width, height = image.size
            if MAX_PREVIEW_SIZE < width or MAX_PREVIEW_SIZE < height:
                size = (MAX_PREVIEW_SIZE, MAX_PREVIEW_SIZE)
                image.thumbnail(size, Image.ANTIALIAS)
            image.save(thumb_path, 'PNG')
