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

from core.job.get_jobs import get_jobs
from core.job.get_job_history import get_job_history
from core.job.get_train_result import get_train_result
from core.job.create_job import create_job
from core.job.get_log import get_log
from core.job.get_status import get_status
from core.job.suspend_job import suspend_job
from core.job.resume_job import resume_job
from core.job.get_download_result import get_download_result
from core.job.get_result_file import get_result_file
from core.job.get_evaluation_result import get_evaluation_result
from core.job.get_inference_result import get_inference_result
from core.job.delete_job import delete_job
from core.job.update_job_name import update_job_name
from core.job.get_classification_matrix import get_classification_matrix
from core.job.get_classification_result import get_classification_result
from core.job.get_classification_result_thumbs import get_classification_result_thumbs
from core.job.get_all_plugin_results import get_all_plugin_results
from core.job.get_likelihood_result import get_likelihood_result
from core.job.execute_plugin import execute_plugin
from core.job.get_plugin_result import get_plugin_result
from core.job.get_plugin_log_url import get_plugin_log_url

job_blueprint = Blueprint(
    "job",
    __name__,
    url_prefix="/v1/users/<string(minlength=0):user_id>"
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs",
    endpoint="get_jobs",
    view_func=get_jobs,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs",
    endpoint="create_job",
    view_func=create_job,
    methods=["POST"]
)

job_blueprint.add_url_rule(
    rule="/all_jobs",
    endpoint="get_job_history",
    view_func=get_job_history,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/train_result",
    endpoint="get_train_result",
    view_func=get_train_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/<string:log_type>_log.txt",
    endpoint="get_log",
    view_func=get_log,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/<string:job_type>_status.json",
    endpoint="get_status",
    view_func=get_status,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/suspend",
    endpoint="suspend_job",
    view_func=suspend_job,
    methods=["POST"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/resume",
    endpoint="resume_job",
    view_func=resume_job,
    methods=["POST"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/download",
    endpoint="get_download_result",
    view_func=get_download_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/results/<string:file_name>",
    endpoint="get_result_file",
    view_func=get_result_file,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/inference_result",
    endpoint="get_inference_result",
    view_func=get_inference_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/inference_result/classification_result",
    endpoint="get_infer_classification_result",
    view_func=get_classification_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/evaluation_result",
    endpoint="get_evaluation_result",
    view_func=get_evaluation_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/evaluation_result/classification_matrix",
    endpoint="get_classification_matrix",
    view_func=get_classification_matrix,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/evaluation_result/classification_result",
    endpoint="get_eval_classification_result",
    view_func=get_classification_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/evaluation_result/classification_result_thumbs",
    endpoint="get_classification_result_thumbs",
    view_func=get_classification_result_thumbs,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>",
    endpoint="delete_job",
    view_func=delete_job,
    methods=["DELETE"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/job_name",
    endpoint="update_job_name",
    view_func=update_job_name,
    methods=["PUT"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/plugins/results",
    endpoint="get_all_plugin_results",
    view_func=get_all_plugin_results,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/evaluation_result/likelihood_result",
    endpoint="get_likelihood_result",
    view_func=get_likelihood_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/plugins/<string:plugin_id>",
    endpoint="execute_plugin",
    view_func=execute_plugin,
    methods=["POST"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/plugins/<string:plugin_id>/result",
    endpoint="get_plugin_result",
    view_func=get_plugin_result,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/projects/<int:project_id>/jobs/<int:job_id>/plugins/<string:plugin_id>/log_url",
    endpoint="get_plugin_log_url",
    view_func=get_plugin_log_url,
    methods=["GET"]
)

job_blueprint.add_url_rule(
    rule="/info/support_contents",
    endpoint="get_support_contents",
    view_func=lambda user_id: {"support_contents": []},
    methods=["GET"]
)
