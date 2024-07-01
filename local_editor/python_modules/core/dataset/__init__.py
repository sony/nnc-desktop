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

from flask import Blueprint

from core.dataset.get_datasets import get_datasets
from core.dataset.get_dataset import get_dataset
from core.dataset.create_dataset import create_dataset
from core.dataset.upload_dataset import upload_dataset
from core.dataset.delete_dataset import delete_dataset
from core.dataset.get_dataset_metadata import get_dataset_metadata
from core.dataset.update_dataset_metadata import update_dataset_metadata
from core.dataset.update_dataset_name import update_dataset_name
from core.dataset.get_save_dir import get_save_dir

dataset_blueprint = Blueprint(
    "dataset",
    __name__,
    url_prefix="/v1/users/<string(minlength=0):user_id>/datasets"
)

dataset_blueprint.add_url_rule(
    rule="",
    endpoint="get_datasets",
    view_func=get_datasets,
    methods=["GET"]
)

dataset_blueprint.add_url_rule(
    rule="/<int:dataset_id>",
    endpoint="get_dataset",
    view_func=get_dataset,
    methods = ["GET"]
)

dataset_blueprint.add_url_rule(
    rule="/<int:dataset_id>",
    endpoint="delete_dataset",
    view_func=delete_dataset,
    methods = ["DELETE"]
)

dataset_blueprint.add_url_rule(
    rule="/create",
    endpoint="create_dataset",
    view_func=create_dataset,
    methods = ["GET"]
)

dataset_blueprint.add_url_rule(
    rule="/upload",
    endpoint="upload_dataset",
    view_func=upload_dataset,
    methods = ["GET"]
)

dataset_blueprint.add_url_rule(
    rule="/<int:dataset_id>/metadata",
    endpoint="get_dataset_metadata",
    view_func=get_dataset_metadata,
    methods = ["GET"]
)

dataset_blueprint.add_url_rule(
    rule="/<int:dataset_id>/metadata/<string:metadata_name>",
    endpoint="update_dataset_metadata",
    view_func=update_dataset_metadata,
    methods = ["PUT"]
)

dataset_blueprint.add_url_rule(
    rule="/<int:dataset_id>/dataset_name",
    endpoint="update_dataset_name",
    view_func=update_dataset_name,
    methods = ["PUT"]
)

dataset_blueprint.add_url_rule(
    rule="/save_dir",
    endpoint="get_save_dir",
    view_func=get_save_dir,
    methods = ["GET"]
)
