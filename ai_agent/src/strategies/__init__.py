from .base import TaskStrategy, StrategyRegistry

# 自动发现并导入当前目录下的其他策略模块，确保装饰器执行完成注册
import pkgutil as _pkgutil
import importlib as _importlib
import pathlib as _pathlib

_current_dir = _pathlib.Path(__file__).parent
for _m in _pkgutil.iter_modules([str(_current_dir)]):
	name = _m.name
	if name in {"base", "__init__"}:
		continue
	try:
		_importlib.import_module(f"strategies.{name}")
	except Exception as e:  # noqa: B902
		# 失败不终止，可能缺少可选依赖
		pass

__all__ = ["TaskStrategy", "StrategyRegistry"]
