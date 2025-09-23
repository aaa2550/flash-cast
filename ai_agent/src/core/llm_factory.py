from __future__ import annotations
import os
import yaml
from functools import lru_cache
from typing import Dict, Any, Optional, List

try:  # crewai 可能是可选依赖
    from crewai import Agent  # type: ignore
except ImportError:  # noqa
    Agent = None  # type: ignore

CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'llm_agents.yaml')

class LLMFactoryError(Exception):
    pass

class LLMFactory:
    """基于 llm_agents.yaml 的 Agent 构建工厂。

    YAML 结构（简要）：
      default_config: { temperature, max_tokens, timeout }
      models: { model_key: { provider, model_id, api_key_env, base_url_env, temperature? } }
      agents: { agent_name: { preferred_models: [model_key, ...], description? } }

    使用：
      agent = LLMFactory.create_agent('小学课程设计专家')
      agent = LLMFactory.create_agent('小学课程设计专家', override_model='bailian-qwen-plus')
    """

    @staticmethod
    @lru_cache(maxsize=1)
    def _load_yaml() -> Dict[str, Any]:
        if not os.path.exists(CONFIG_PATH):
            raise LLMFactoryError(f"配置文件不存在: {CONFIG_PATH}")
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
        return data

    @classmethod
    def list_models(cls) -> List[str]:
        return list(cls._load_yaml().get('models', {}).keys())

    @classmethod
    def list_agents(cls) -> List[str]:
        return list(cls._load_yaml().get('agents', {}).keys())

    @classmethod
    def get_model_config(cls, model_key: str) -> Dict[str, Any]:
        models = cls._load_yaml().get('models', {})
        if model_key not in models:
            raise LLMFactoryError(f"未找到模型: {model_key}")
        return models[model_key]

    @classmethod
    def get_agent_config(cls, agent_name: str) -> Dict[str, Any]:
        agents = cls._load_yaml().get('agents', {})
        if agent_name not in agents:
            raise LLMFactoryError(f"未找到 Agent: {agent_name}")
        return agents[agent_name]

    @classmethod
    def _select_model(cls, agent_conf: Dict[str, Any], override_model: Optional[str] = None) -> Dict[str, Any]:
        if override_model:
            return cls.get_model_config(override_model)
        preferred = agent_conf.get('preferred_models') or []
        for mk in preferred:
            try:
                return cls.get_model_config(mk)
            except LLMFactoryError:
                continue
        raise LLMFactoryError("Agent 未配置可用 preferred_models 或均未找到")

    @classmethod
    def create_agent(cls, agent_name: str, override_model: Optional[str] = None) -> Any:
        if Agent is None:
            return {
                "stub": True,
                "agent_name": agent_name,
                "model": override_model or (cls.get_agent_config(agent_name).get('preferred_models') or [None])[0],
            }
        agent_conf = cls.get_agent_config(agent_name)
        model_conf = cls._select_model(agent_conf, override_model)

        # 读取环境变量中的 api_key 和 base_url
        api_key_env = model_conf.get('api_key_env')
        base_url_env = model_conf.get('base_url_env')
        api_key = os.getenv(api_key_env) if api_key_env else None
        base_url = os.getenv(base_url_env) if base_url_env else None

        temperature = model_conf.get('temperature')
        default_conf = cls._load_yaml().get('default_config', {})
        if temperature is None:
            temperature = default_conf.get('temperature')

        description = agent_conf.get('description') or f"Agent for {agent_name}"

        # crewai Agent 当前不直接接收 model 参数（根据实际版本调整），这里将其放在 backstory 里供下游使用。
        backstory = f"使用模型 {model_conf.get('model_id')} (provider={model_conf.get('provider')})。" + description
        if base_url:
            backstory += f" base_url={base_url}."
        if temperature is not None:
            backstory += f" temperature={temperature}."

        # 可将附加信息附在 goal 中
        goal = f"高质量生成与 {agent_name} 角色相关的内容。"
        if api_key:
            goal += " (已找到API Key)"
        else:
            goal += " (API Key缺失)"

        return Agent(role=agent_name, goal=goal, backstory=backstory)

    @classmethod
    def create_agents(cls, agent_names: List[str], override_model: Optional[str] = None) -> List[Any]:
        return [cls.create_agent(n, override_model=override_model) for n in agent_names]

    @classmethod
    def debug_summary(cls) -> Dict[str, Any]:
        data = cls._load_yaml()
        return {
            "model_count": len(data.get('models', {})),
            "agent_count": len(data.get('agents', {})),
            "models": list(data.get('models', {}).keys()),
            "agents": list(data.get('agents', {}).keys()),
        }
