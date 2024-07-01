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

import argparse
from flask import Flask, render_template, redirect, request, send_from_directory

from core.misc import misc_blueprint
from core.account import account_blueprint
from core.project import project_blueprint
from core.job import job_blueprint
from core.tenant import tenant_blueprint
from core.dataset import dataset_blueprint
from core.star import star_blueprint
from utils.exception import NNcdException, handle_exception
from conf import settings


app = Flask(__name__, template_folder="../../console")

@app.route('/<path:filename>')
def send_file(filename):
    if filename.endswith('.js'):
        mime_type = 'application/javascript'
    else:
        mime_type = None
    
    if filename.startswith('console/'):
        return send_from_directory("../../", filename, mimetype=mime_type)
    return send_from_directory("../../console", filename, mimetype=mime_type)

app.register_blueprint(account_blueprint)
app.register_blueprint(misc_blueprint)
app.register_blueprint(project_blueprint)
app.register_blueprint(job_blueprint)
app.register_blueprint(tenant_blueprint)
app.register_blueprint(dataset_blueprint)
app.register_blueprint(star_blueprint)

app.register_error_handler(NNcdException, handle_exception)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/editor")
def render_editor():
    return render_template("editor")


@app.route("/docs/<string(minlength=0):doc_name>")
def render_docs(doc_name: str):
    if doc_name:
        return render_template(f'docs/{doc_name}')
    return render_template("docs/index.html")


@app.route('/console/')
def redirect_console():
    return redirect('/')


@app.route("/project/v1/<path:url_path>")
def redirect_sample_project(url_path):
    # /project/v1/misc/sample_projects -> /v1/misc/sample_projects
    new_url = request.full_path.replace("/project", "")
    return redirect(new_url)


@app.route("/ja/project/v1/<path:url_path>")
def redirect_sample_project_from_ja(url_path):
    # /project/v1/misc/sample_projects -> /v1/misc/sample_projects
    new_url = request.full_path.replace("/ja/project", "")
    return redirect(new_url)


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--debug', action='store_true')
    parser.add_argument("--port", "-p", default=settings.SERVER_PORT, type=int)

    args = parser.parse_args()

    return args


def main():
    args = get_args()
    print('web server serve at port: %s' % (args.port))
    app.logger.warning('web server serve at port: %s' % (args.port))
    app.run('0.0.0.0', args.port)


if __name__ == '__main__':
    main()
