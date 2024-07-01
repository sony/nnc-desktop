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
import re
import tempfile
from datetime import datetime
from http import HTTPStatus
from typing import Optional, Any

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
try:
    from botocore.exceptions import ReadTimeoutError
except ImportError:
    from botocore.vendored.requests.packages.urllib3.exceptions import ReadTimeoutError
from retrying import retry

from chalicelib.nncd.common.errors import CODE
from chalicelib.nncd.common.exceptions import NNcdException
from chalicelib.nncd.common import log_util
from chalicelib.nncd.core.common import consts
from chalicelib.nncd.core.common.consts import (
    DATASET_OUTPUT_CSV,
)

MAX_KEY_NUM = 1000
APP_DOWNLOAD_EXPIRE_IN = 30

HANDLING_EXCEPTIONS = (ClientError, ReadTimeoutError)



def retry_if_recoverable(exception):
    if not isinstance(exception, NNcdException):
        return False
    # NOT_FOUNDはリトライしない
    return (
        exception.error_code == CODE.AWS_S3_TIMEOUT or
        exception.error_code != CODE.AWS_S3_UNKNOWN
    )


def make_s3_dataset_path(s3_path, tenant_id, dataset_id):
    c = re.match('s3://([^/]+)/(.*)', s3_path)
    if c is not None:
        return c.groups()[1]

    return os.path.normpath('{tenant_id}/{dataset_id}/{data_path}'.format(
        tenant_id=tenant_id,
        dataset_id=dataset_id,
        data_path=s3_path
    ))


def make_s3_project_file_path(s3_path, project_id, job_id):
    return os.path.normpath('{project_id}/results/{job_id}/{data_path}'.format(
        project_id=project_id,
        job_id=job_id,
        data_path=s3_path
    ))


def make_project_sdcproj_path(project_id):
    return '{project_id}/configurations/project/data.sdcproj'.format(
        project_id=project_id
    )


def make_result_dir_path(project_id, job_id):
    return '{project_id}/results/{job_id}'.format(
        project_id=project_id,
        job_id=job_id
    )


def make_dataset_dir_path(tenant_id, dataset_id):
    return '{tenant_id}/{dataset_id}/{dataset_name}'.format(
        tenant_id=tenant_id,
        dataset_id=dataset_id,
        dataset_name=DATASET_OUTPUT_CSV
    )


def _raise_nncd_exception(e):
    if isinstance(e, ClientError):
        if _get_http_status(e) in (HTTPStatus.NOT_FOUND, HTTPStatus.NOT_MODIFIED):
            raise NNcdException(CODE.AWS_S3_NOT_FOUND, 'Not found')
        if _get_http_status(e) == HTTPStatus.FORBIDDEN:
            raise NNcdException(CODE.AWS_S3_FORBIDDEN, 'Forbidden')
        if _get_http_status(e) == HTTPStatus.REQUEST_TIMEOUT:
            raise NNcdException(CODE.AWS_S3_TIMEOUT, 'Connection timeout')
    elif isinstance(e, ReadTimeoutError):
        raise NNcdException(CODE.AWS_S3_TIMEOUT, 'Read timeout')
    raise NNcdException(CODE.AWS_S3_UNKNOWN, 'Unknown error')


def _get_http_status(e: ClientError):
    if 'ResponseMetadata' not in e.response:
        return None
    if 'HTTPStatusCode' not in e.response['ResponseMetadata']:
        return None
    return e.response['ResponseMetadata']['HTTPStatusCode']


@retry(stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _put_object(bucket_name, key, content_text):
    print('put object %r' % key)
    try:
        s3res = boto3.resource('s3')
        bucket = s3res.Bucket(bucket_name)
        obj = bucket.Object(key)
        obj.put(
            Body=content_text.encode('utf-8', 'ignore'),
            ContentEncoding='utf-8',
            ContentType='text/plane'
        )  # response is None
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


def put_object(bucket_name, key, content_text):
    return _put_object(bucket_name, key, content_text)


@retry(retry_on_exception=retry_if_recoverable, stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _get_object(bucket_name, key):
    print(f'get object {key}')
    try:
        s3res = boto3.resource('s3')
        obj = s3res.Object(bucket_name, key)
        response = obj.get()
        print(f'response = {log_util.to_short_log_message(response)}')
        body = response['Body'].read()
        return body.decode('utf-8')
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


@retry(retry_on_exception=retry_if_recoverable, stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _get_object_range(bucket_name, key, offset, limit):
    print(f'get object {key}')
    try:
        s3res = boto3.resource('s3')
        obj = s3res.Object(bucket_name, key)
        response = obj.get(Range='bytes={}-{}'.format(offset, limit))
        print(f'response = {log_util.to_short_log_message(response)}')
        body = response['Body'].read()
        return body.decode('utf-8')
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


@retry(retry_on_exception=retry_if_recoverable, stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _get_binary_range(bucket_name, key, offset, limit):
    print(f'get object {key}')
    try:
        s3res = boto3.resource('s3')
        obj = s3res.Object(bucket_name, key)
        response = obj.get(Range='bytes={}-{}'.format(offset, limit))
        print(f'response = {log_util.to_short_log_message(response)}')
        body = response['Body'].read()
        return body
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


def get_object_range(bucket_name, key, offset, limit):
    return _get_object_range(bucket_name, key, offset, limit)


def get_binary_range(bucket_name, key, offset, limit):
    return _get_binary_range(bucket_name, key, offset, limit)


@retry(retry_on_exception=retry_if_recoverable, stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _get_object_content_length(bucket_name, key):
    print(f'get object length {key}')
    try:
        s3res = boto3.resource('s3')
        obj = s3res.Object(bucket_name, key)
        return obj.content_length
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


def get_content_length(bucket_name, key):
    return _get_object_content_length(bucket_name, key)


@retry(stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _copy_object(src_bucket, src_key, dst_bucket, dst_key):
    print('copy object %r -> %r' % (src_key, dst_key))
    try:
        s3client = boto3.client('s3')
        response = s3client.copy_object(
            CopySource={
                'Bucket': src_bucket,
                'Key': src_key
            },
            Bucket=dst_bucket,
            Key=dst_key
        )
        print(f'response = {response}')
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


@retry(stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _object_exists(bucket_name, key):
    print('object exists %r' % key)
    try:
        s3client = boto3.client('s3')
        response = s3client.list_objects(
            Prefix=key,
            Bucket=bucket_name
        )
        print(f'response = {response}')
        contents = response.get("Contents")
        if contents:
            for content in contents:
                if content.get("Key") == key:
                    return True
        return False
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


def object_exists(bucket_name, key):
    return _object_exists(bucket_name, key)


def _iter_object(s3client, bucket, prefix):
    """ 指定したprefixのcontentsを取得するイテレータを返す """

    token = ''
    while True:
        # S3からデータを取得
        # S3._list_objects_v2()で1回に取得できるのは最大1000件。
        response = _list_objects_v2(s3client, bucket, prefix, start_after='', token=token)

        # 該当keyが存在するかチェック
        if 'Contents' not in response:
            break

        for contents in response['Contents']:
            yield contents

        # まだデータが存在するなら取得
        if not response['IsTruncated']:
            break
        token = response['NextContinuationToken']


@retry(stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _list_objects_v2(s3client, bucket, prefix, start_after='', max_keys=MAX_KEY_NUM, token=''):
    param = {
        'Bucket': bucket,
        'Prefix': prefix,
        'StartAfter': start_after,
        'MaxKeys': max_keys,
    }
    if token:
        param['ContinuationToken'] = token
    print('_list_objects_v2 = %r' % param)
    return s3client.list_objects_v2(**param)


@retry(stop_max_attempt_number=consts.DEFAULT_RETRY_COUNT)
def _delete_object(bucket_name: str, key: str) -> None:
    try:
        s3client = boto3.client('s3')
        s3client.delete_object(
            Bucket=bucket_name,
            Key=key
        )
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)


def delete_all(bucket_name, prefix):
    print(f'delete all under {prefix}')
    try:
        s3client = boto3.client('s3')
        for obj in _iter_object(s3client, bucket_name, prefix):
            if 'Key' not in obj:
                continue
            _delete_object(bucket_name, obj['Key'])
    except HANDLING_EXCEPTIONS as e:
        _raise_nncd_exception(e)
