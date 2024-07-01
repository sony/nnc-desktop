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


import os
import re
import sys

from configparser import ConfigParser
from logging import getLogger


PROJECTS_BUCKET = 'nncd-projects-rdc'
BUCKET_PREFIX = '/opt/bucket'
PROP_NAME_PATTERN = re.compile(r'^(property_[0-9]+_)name$')

logger = getLogger("confustion_matrix")
# TODO logger setup


def extract_job_id(sdcproj_filename):
    sdcproj = ConfigParser()
    sdcproj.read(sdcproj_filename)

    job_ids = set()
    for sec_key in sdcproj.sections():
        section = sdcproj[sec_key]
        for opt_key in section:
            m = PROP_NAME_PATTERN.match(opt_key)
            if not m:
                continue
            prop_value_key = m.group(1) + 'value'

            prop_name = section[opt_key]
            if prop_name == 'File' or prop_name.endswith('.File'):
                prop_value = section.get(prop_value_key, None)
                if prop_value:
                    job_id = prop_value.split('/')[0]
                    job_ids.add(job_id)

    return job_ids


def main(argv):
    project_id = argv[1]
    sdcproj_filename = argv[2]

    job_ids = extract_job_id(sdcproj_filename)

    for job_id in job_ids:
        print('{}\t{}/{}/{}/results/{}'.format(
            job_id, BUCKET_PREFIX, PROJECTS_BUCKET, project_id, job_id,
        ))


if __name__ == '__main__':
    try:
        main(sys.argv)
    except:
        import traceback
        logger.error(traceback.format_exc())
