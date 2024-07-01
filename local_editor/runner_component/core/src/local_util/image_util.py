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
from contextlib import contextmanager

import numpy as np
import pydicom
from PIL import Image

DICOM_EXT = ('.dcm', '.DCM', '.dicom', '.DICOM')


def apply_gamma_correction(dicom_dataset):
    d_min = 0
    d_max = 255
    bpp = dicom_dataset.BitsAllocated
    spp = dicom_dataset.SamplesPerPixel
    if 'WindowCenter' in dicom_dataset:
        win_center = float(dicom_dataset.WindowCenter)
    else:
        win_center = (1 << bpp) / 2
    if 'WindowWidth' in dicom_dataset:
        win_width = float(dicom_dataset.WindowWidth)
    else:
        win_width = (1 << bpp)
    # --------------NCTB-------
    if 'PhotometricInterpretation' in dicom_dataset:
        photo_interpretation = dicom_dataset.PhotometricInterpretation
    else:
        photo_interpretation = 'MONOCHROME2'

    if 'RescaleSlope' in dicom_dataset:
        rescale_slope = float(dicom_dataset.RescaleSlope)
    else:
        rescale_slope = 1.0

    if 'RescaleIntercept' in dicom_dataset:
        rescale_intercept = float(dicom_dataset.RescaleIntercept)
    else:
        rescale_intercept = 0
    # --------------------------
    win_max = win_center + 0.5 * win_width - 0.5
    win_min = win_max - win_width - 0.5
    range = max(win_max - win_min, 1)
    factor = (d_max - d_min) / range
    img = np.array(dicom_dataset.pixel_array)
    dtype = img.dtype
    if photo_interpretation == 'MONOCHROME1':
        img = (1 << bpp) - (img * rescale_slope + rescale_intercept)
        img = img.astype(dtype)
    else:
        img = (img * rescale_slope + rescale_intercept).astype(dtype)
    dest = np.zeros_like(img).astype(np.uint8)
    dest[img <= win_min] = d_min
    dest[img > win_max] = d_max
    dest[(win_min < img) & (img <= win_max)] = (img[(win_min < img) & (img <= win_max)] - win_min) * factor + d_min
    if spp == 1:
        rgb_img = np.stack([dest, dest, dest], axis=2)
    else:
        rgb_img = dest
    return rgb_img


@contextmanager
def image_open(file_name):
    if os.path.splitext(file_name)[1] in DICOM_EXT:
        # dicom画像を扱えない場合はpydicomで読める形式に変更する
        ds = pydicom.dcmread(file_name)
        image = apply_gamma_correction(ds)
        img = Image.fromarray(image).convert('RGB')
        yield img
    else:
        with Image.open(file_name) as image:
            yield image


def resize_image(image_path, resize=None):
    with image_open(image_path) as image:
        width, height = image.size
        if resize is not None and (resize < width or resize < height):
            size = (resize, resize)
            image.thumbnail(size, Image.NEAREST)
        image.save(image_path, 'PNG')
