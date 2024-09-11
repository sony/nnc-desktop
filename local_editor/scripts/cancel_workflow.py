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
import sys

from github import Github


REPOSITORY = 'sony/nnc-desktop'


def main(args):
    if args.token_stdin:
        token = input()
    else:
        token = input('input token: ')

    github = Github(token)
    repo = github.get_repo(REPOSITORY)
    cancelled = 0
    for run in repo.get_workflow_runs(branch=args.branch, status='in_progress'):
        if (run.run_number != args.keep) and (run.raw_data['name'] == args.workflow):
            print(f'workflow run_number #{run.run_number} ({run.status}): ', end='')
            if run.cancel():
                cancelled += 1
                print('cancelled')
            else:
                print('not cancelled')

    for run in repo.get_workflow_runs(branch=args.branch, status='queued'):
        if (run.run_number != args.keep) and (run.raw_data['name'] == args.workflow):
            print(f'workflow run_number #{run.run_number} ({run.status}): ', end='')
            if run.cancel():
                cancelled += 1
                print('cancelled')
            else:
                print('not cancelled')

    print(f'total {cancelled} workflow was cancelled.')


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-b', '--branch',
                        help='branch to cancel workflow', required=True)
    parser.add_argument('-w', '--workflow',
                        help='workflow name to cancel', required=True)
    parser.add_argument('--keep', type=int,
                        help='workflow number that will not be cancelled', required=True)
    parser.add_argument('--token-stdin', action='store_true',
                        help='pass token string from stdin')

    args = parser.parse_args()
    main(args)