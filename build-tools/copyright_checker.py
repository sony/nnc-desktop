#!/usr/bin/env python3
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
import os
import re
import subprocess
from tqdm import tqdm
from contextlib import contextmanager

_exclude_dirs = ['local_editor/web_component/local_editor_editor/lib']
_exclude_files = [".gitignore", "LICENSE", "NOTICE", ".DS_Store"]
_date_extract_regex = re.compile('(\\d{4}-\\d{2}-\\d{2})')
_exclude_regex = re.compile('update copyright')


def execute_command(command):
    return subprocess.check_output(command).decode("utf-8")


def retrieve_commit_dates(f):
    result = execute_command(
        ['git', 'log', '--format="%ci,%s"', '--reverse', f])
    excluded = ""
    for line in result.split('\n'):
        if _exclude_regex.search(line):
            continue
        else:
            excluded += line
    dates = _date_extract_regex.findall(excluded)
    return dates


def fill_intermediate_years(years, end_year=None):
    years.sort()
    start_year = int(years[0])
    if end_year is None:
        end_year = int(years[-1])
    # init commit start from 2024
    if end_year <= 2024:
        start_year = end_year = 2024
    elif start_year <= 2024:
        start_year = 2024
    filled_years = []
    for year in range(start_year, end_year+1):
        filled_years.append(str(year))
    return filled_years


class Checker:
    def __init__(self, postfix_list, symbol, method, apache2_license_template):
        self.symbol = symbol
        self.shebang = re.compile('#!.+')
        if method == 'insert':
            self.copyright_sony_group_corp = self.symbol.format(
                ' Copyright {} Sony Group Corporation.')
            self.header_extract_rule = re.compile(
                r'(?:/\*|<!--) Copyright.*? limitations under the License.(?:\n\*/|\n-->)', re.DOTALL)
        else:
            self.copyright_sony_group_corp = self.symbol + \
               ' Copyright {} Sony Group Corporation.'
            self.header_extract_rule = re.compile(
                '(?:#|@REM) Copyright.*? limitations under the License.', re.DOTALL)        
        self.apache2_license_template = apache2_license_template
        self.postfix_list = postfix_list
        self.text = None
        self.type = 'unknown'

    def extract_shebang(self):
        extracted_texts = self.shebang.findall(self.text)
        if len(extracted_texts) == 0:
            return None
        return extracted_texts[0]

    def has_shebang(self):
        try:
            has_she_bang = self.extract_shebang() is not None
            return has_she_bang
        except UnicodeDecodeError:
            # Raw binary file and not text.
            return False

    def accept_type(self, fn):
        base_name = os.path.basename(fn)
        body, ext = os.path.splitext(base_name)
        if ext in _exclude_files:
            return False
        if body in _exclude_files:
            return False
        if body in self.postfix_list or ext in self.postfix_list:
            # for Dockerfile
            return True
        return False

    @contextmanager
    def read_file(self, fn):
        try:
            with open(fn, "r", encoding='utf-8') as f:
                self.text = f.read()
            yield self.text
            self.text = None
        except UnicodeDecodeError:
            print("{} is invalid text file, skipped!".format(fn))
            yield None

    def create_file_header(self, f):
        commit_dates = retrieve_commit_dates(f)
        if len(commit_dates) == 0:
            return None

        sony_group_years = set()
        for date in commit_dates:
            (year, month, _) = date.split('-')
            sony_group_years.add(year)

        header = ''

        if len(sony_group_years) != 0:
            sony_group_years = list(sony_group_years)
            sony_group_years = fill_intermediate_years(sony_group_years)
            joined_sony_group_years = ','.join(sony_group_years)
            header += self.copyright_sony_group_corp.format(
                joined_sony_group_years) + '\n'

        header += self.apache2_license_template

        return header

    def extract_file_header(self):
        extract_texts = self.header_extract_rule.findall(self.text)
        if len(extract_texts) == 0:
            return None
        return extract_texts[0]

    def replace_file_header(self, old_header, new_header):
        if old_header is None:
            she_bang = self.extract_shebang()
            if she_bang is None:
                replaced_text = new_header + '\n' + self.text
            else:
                text = self.text.replace(she_bang + '\n', '')
                replaced_text = she_bang + '\n' + new_header + '\n' + text
        else:
            replaced_text = self.text.replace(old_header, new_header)

        return replaced_text


def list_up_files(root_dir, checkers):
    # Get the list of files tracked by git
    result = subprocess.run(['git', 'ls-files'], cwd=root_dir, capture_output=True, text=True, check=True)
    files = []
    
    for p in result.stdout.splitlines():
        for exclude in _exclude_dirs:
            if os.path.abspath(p).find(exclude) != -1:
                break
        else:
            for k, c in checkers.items():
                if c.accept_type(p):
                    c.type = k
                    files.append((p, c))
                    break
    return files

def main(args):
    os.chdir(args.rootdir)
    apache2_license_template = '''#
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
# limitations under the License.'''
    lt_js = '/**'+ apache2_license_template[1:].replace(
                "#", ' *') + '\n*/'
    lt_html = '<!--'+ apache2_license_template[1:].replace(
                "#", ' *') + '\n-->'
    lt_bat = apache2_license_template.replace("#", "@REM")
    types = {
        "script": (
            [".py", ".ini", ".sh", "Dockerfile", ".ps1", "GNUmakefile"],
            "#",
            "prefix",
            apache2_license_template
        ),
        "js": (
            [".js", ".ts", ".cjs", ".css", '.scss'],
            "/*{} */",
            "insert",
            lt_js
        ),
        "html": (
            [".html", ".vue"],
            "<!--{} -->",
            "insert",
            lt_html
        ),
        "bat": (
            [".bat"],
            "@REM",
            "prefix",
            lt_bat
        )
    }
    checkers = {}
    for k, v in types.items():
        checkers[k] = Checker(*v)

    files = list_up_files(args.rootdir, checkers)
    
    for fn, c in tqdm(files):
        if c.type == 'unknown':
            if not c.has_shebang():
                continue
        new_header = c.create_file_header(fn)
        if new_header is None:
            continue
        with c.read_file(fn) as f:
            if f != None:
                old_header = c.extract_file_header()
                if new_header == old_header:
                    continue
                with open(fn, "w", encoding='utf-8') as fh:
                    fh.write(c.replace_file_header(old_header, new_header))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--rootdir', type=str, default='./')
    args = parser.parse_args()
    main(args)
