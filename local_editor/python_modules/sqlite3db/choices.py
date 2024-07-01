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

from enum import Enum

DELETED_CHOICES = (
    (0, False),
    (1, True)
)

USER_ROLE_CHOICES = (
    (0xc0007, "owner"),
    (0x40007, "admin"),
    (0x00007, "user"),
    (0x00005, "sample")
)

PURPOSE_CHOICES = (
    (0, "private"),
    (1, "share"),
    (2, "sample"),
    (3, "public")
)

JOB_STATUS_CHOICES = (
    (1, "queued"),
    (2, "preprocessing"),
    (3, "processing"),
    (4, "suspended"),
    (5, "finished"),
    (6, "failed")
)

JOB_PRIORITY_CHOICES = (
    (1, "normal"),
    (2, "low"),
    (3, "high")
)

JOB_TYPE_CHOICES = (
    (1, "profile"),
    (2, "train"),
    (3, "evaluate"),
    (4, "inference")
)

DATASET_STATUS_CHOICES = (
    (0, "none"),
    (1, "ready"),
    (2, "extracting"),
    (3, "failed"),
    (4, "completed"),
    (5, "copying")
)

DATASET_COPY_STATUS_CHOICES = (
    (1, "ready"),
    (2, "processing"),
    (3, "failed"),
    (4, "completed")
)

PROJECT_COPY_STATUS_CHOICES = (
    (1, "ready"),
    (2, "processing"),
    (3, "failed"),
    (4, "completed")
)

PROJECT_METADATA_TYPE_CHIOCES = (
    (0, "numeric"),
    (1, "text")
)

REPORT_TYPE_CHOICES = (
    (0, "network"),
    (1, "network_and_result")
)

REPORT_DESTINATION_CHOICES = (
    (0, "local"),
    (1, "public")
)

INSTANCE_AVAILABLE_CHOICES = (
    (0, False),
    (1, True)
)