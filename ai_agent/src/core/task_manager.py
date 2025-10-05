from __future__ import annotations
import uuid
import threading
import logging
from concurrent.futures import ThreadPoolExecutor, Future
from typing import Dict, Any
from .status import TaskStatus
from .persistence import Persistence
from strategies import StrategyRegistry  # 导入时会自动发现并注册策略

logger = logging.getLogger(__name__)

class TaskManager:
    def __init__(self, max_workers: int = 4, persistence: Persistence | None = None):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.tasks: Dict[str, Dict[str, Any]] = {}
        self.futures: Dict[str, Future] = {}
        self.lock = threading.RLock()
        self.persistence = persistence or Persistence()

    def submit(self, strategy: str, params: Dict[str, Any]) -> str:
        task_id = str(params['taskId'])
        with self.lock:
            self.tasks[task_id] = {"status": TaskStatus.PENDING, "strategy": strategy, "params": params, "cancel_requested": False}
        future = self.executor.submit(self._run_task, task_id, strategy, params)
        self.futures[task_id] = future
        return task_id

    def _run_task(self, task_id: str, strategy: str, params: Dict[str, Any]):
        with self.lock:
            self.tasks[task_id]["status"] = TaskStatus.RUNNING
        try:
            strat_cls = StrategyRegistry.get(strategy)
            strat = strat_cls(params=params, task_id=task_id)
            result = strat.run()
            # 运行结束后检查是否在执行期间被标记取消
            with self.lock:
                if self.tasks[task_id].get("cancel_requested"):
                    payload = {"task_id": task_id, "status": TaskStatus.CANCELLED, "result": None}
                    self.tasks[task_id].update(payload)
                    self.persistence.save(task_id, payload)
                    return
            payload = {"task_id": task_id, "status": TaskStatus.SUCCESS, "result": result}
            with self.lock:
                self.tasks[task_id].update(payload)
            # persist
            self.persistence.save(task_id, payload)
        except Exception as e:  # noqa
            logger.exception("_run_task错误")
            err_payload = {"task_id": task_id, "status": TaskStatus.FAILED, "error": str(e)}
            with self.lock:
                self.tasks[task_id].update(err_payload)
            self.persistence.save(task_id, err_payload)

    def get(self, task_id: str) -> Dict[str, Any] | None:
        with self.lock:
            task = self.tasks.get(task_id)
        if task:
            return task
        # try persistence for completed ones after restart
        persisted = self.persistence.load(task_id)
        if persisted:
            return persisted
        return None

    def cancel(self, task_id: str) -> bool:
        """尝试取消任务：
        1. 如果任务还在 PENDING，尝试 future.cancel 成功则状态标记 CANCELLED
        2. 如果 RUNNING，标记 cancel_requested，任务结束后写入 CANCELLED（软取消）
        3. SUCCESS/FAILED/CANCELLED 返回 False
        返回是否接受取消请求
        """
        with self.lock:
            task = self.tasks.get(task_id)
            if not task:
                # 不在内存中，可能已持久化完成，无法取消
                return False
            status = task.get("status")
            if status in (TaskStatus.SUCCESS, TaskStatus.FAILED, TaskStatus.CANCELLED):
                return False
            future = self.futures.get(task_id)
            if status == TaskStatus.PENDING and future and future.cancel():
                task.update({"status": TaskStatus.CANCELLED})
                self.persistence.save(task_id, {"task_id": task_id, "status": TaskStatus.CANCELLED})
                return True
            # RUNNING 情况，做软取消标记
            if status == TaskStatus.RUNNING:
                task["cancel_requested"] = True
                return True
        return False

# 单例
_task_manager: TaskManager | None = None

def get_task_manager() -> TaskManager:
    global _task_manager
    if _task_manager is None:
        _task_manager = TaskManager()
    return _task_manager
