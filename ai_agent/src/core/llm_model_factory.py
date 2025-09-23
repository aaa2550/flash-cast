from __future__ import annotations
import os
import yaml
from functools import lru_cache
from typing import Any, Dict, Optional

try:
    # crewai 新版本可以通过 LLM 类或直接在 Agent 中引用，这里做一个通用封装
    from crewai import LLM  # type: ignore
except ImportError:  # noqa
    LLM = None  # type: ignore

CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'llm_agents.yaml')

class LLMModelFactoryError(Exception):
    pass

class LLMModelFactory:
    """通过模型名称创建 LLM 对象（或返回参数 dict 的工厂）。

    YAML 需要包含:
      default_config: { temperature?, max_tokens?, timeout? }
      models: { key: { provider, model_id, api_key_env?, base_url_env?, temperature?, description? } }

    使用:
      llm = LLMModelFactory.create_llm('bailian-qwen-plus')
      params = LLMModelFactory.get_model_params('bailian-qwen-plus')
    """

    @staticmethod
    @lru_cache(maxsize=1)
    def _load_yaml() -> Dict[str, Any]:
        if not os.path.exists(CONFIG_PATH):
            raise LLMModelFactoryError(f"配置文件不存在: {CONFIG_PATH}")
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
        return data

    @classmethod
    def list_models(cls):
        return list(cls._load_yaml().get('models', {}).keys())

    @classmethod
    def get_model_config(cls, name: str) -> Dict[str, Any]:
        models = cls._load_yaml().get('models', {})
        if name not in models:
            raise LLMModelFactoryError(f"未找到模型: {name}")
        return models[name]

    @classmethod
    def get_model_params(cls, name: str) -> Dict[str, Any]:
        conf = cls.get_model_config(name)
        default_conf = cls._load_yaml().get('default_config', {})
        # 合成参数（模型级优先）
        temperature = conf.get('temperature', default_conf.get('temperature'))
        max_tokens = conf.get('max_tokens', default_conf.get('max_tokens'))
        timeout = conf.get('timeout', default_conf.get('timeout'))
        base_url_env = conf.get('base_url_env')
        api_key_env = conf.get('api_key_env')
        params: Dict[str, Any] = {
            'provider': conf.get('provider'),
            'model_id': conf.get('model_id'),
            'temperature': temperature,
            'max_tokens': max_tokens,
            'timeout': timeout,
            'api_key': os.getenv(api_key_env) if api_key_env else None,
            'base_url': os.getenv(base_url_env) if base_url_env else None,
            'description': conf.get('description'),
            'model': 'openai/' + conf.get('model_id'),
        }
        return params

    @classmethod
    def create_llm(cls, name: str) -> Any:
        params = cls.get_model_params(name)
        return LLM(**params)

    @classmethod
    def summary(cls) -> Dict[str, Any]:
        data = cls._load_yaml()
        return {
            'model_count': len(data.get('models', {})),
            'models': list(data.get('models', {}).keys()),
        }
