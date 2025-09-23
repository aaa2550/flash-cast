from __future__ import annotations
import json
from pathlib import Path
from threading import RLock
from typing import Any, Dict, Optional

class Persistence:
    def __init__(self, base_dir: str = "data"):
        self.base_path = Path(base_dir)
        self.base_path.mkdir(parents=True, exist_ok=True)
        self._lock = RLock()

    def task_file(self, task_id: str) -> Path:
        return self.base_path / f"task_{task_id}.json"

    def save(self, task_id: str, payload: Dict[str, Any]):
        with self._lock:
            with self.task_file(task_id).open("w", encoding="utf-8") as f:
                json.dump(payload, f, ensure_ascii=False, indent=2)

    def load(self, task_id: str) -> Optional[Dict[str, Any]]:
        path = self.task_file(task_id)
        if not path.exists():
            return None
        with self._lock:
            with path.open("r", encoding="utf-8") as f:
                return json.load(f)
