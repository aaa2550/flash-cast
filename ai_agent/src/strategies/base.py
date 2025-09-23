from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Dict, Type, Callable

class StrategyRegistry:
    _registry: Dict[str, Type['TaskStrategy']] = {}

    @classmethod
    def register(cls, name: str) -> Callable[[Type['TaskStrategy']], Type['TaskStrategy']]:
        def decorator(strategy_cls: Type['TaskStrategy']):
            key = name.lower()
            if key in cls._registry:
                raise ValueError(f"Strategy '{name}' already registered")
            cls._registry[key] = strategy_cls
            return strategy_cls
        return decorator

    @classmethod
    def get(cls, name: str) -> Type['TaskStrategy']:
        strategy_cls = cls._registry.get(name.lower())
        if not strategy_cls:
            raise KeyError(f"Strategy '{name}' not found; available: {list(cls._registry.keys())}")
        return strategy_cls

    @classmethod
    def create(cls, name: str, **kwargs) -> 'TaskStrategy':
        return cls.get(name)(**kwargs)

class TaskStrategy(ABC):
    def __init__(self, params: Dict[str, Any], task_id: str | None = None):
        self.params = params
        self.task_id = task_id

    @abstractmethod
    def run(self) -> Dict[str, Any]:
        """执行策略，返回结果 dict"""
        raise NotImplementedError
