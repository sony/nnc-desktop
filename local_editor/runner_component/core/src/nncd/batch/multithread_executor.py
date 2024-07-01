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

import queue
import threading
import traceback
from abc import ABC, abstractmethod
from logging import getLogger

logger = getLogger(__name__)


class Runner(ABC):
    @abstractmethod
    def run(self):
        pass

    @abstractmethod
    def on_success(self):
        pass

    @abstractmethod
    def on_failure(self, exception):
        pass


class MultiThreadExecutor(object):
    def __init__(self, num_worker_threads):
        self.threads = []
        self.num_worker_threads = num_worker_threads
        self.q = queue.Queue(maxsize=1000)
        self.failed = []
        self._begin()

    def _begin(self):
        for i in range(self.num_worker_threads):
            t = threading.Thread(target=self.worker)
            t.start()
            self.threads.append(t)

    def execute(self, runner):
        logger.info(f'execute (qsize={self.q.qsize()})')
        self.q.put(runner, block=True, timeout=None)

    def shutdown(self):
        logger.info(f'shutdown (qsize={self.q.qsize()})')
        self.join()

        for _ in range(self.num_worker_threads):
            self.q.put(None)
        for t in self.threads:
            t.join()

    def worker(self):
        while True:
            runner = self.q.get()
            if runner is None:
                break
            try:
                runner.run()
                runner.on_success()
            except Exception as e:
                logger.info(traceback.format_exc())
                runner.on_failure(e)
                self.failed.append(runner)
            finally:
                self.q.task_done()
                logger.info(f'finished runner (qsize={self.q.qsize()})')

    def join(self):
        logger.info(f'join (qsize={self.q.qsize()})')
        self.q.join()
        logger.info('exit join')
