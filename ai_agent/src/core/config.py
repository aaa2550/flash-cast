from __future__ import annotations
import os
from functools import lru_cache
from typing import Optional, Dict
from dotenv import load_dotenv

# 自动加载 .env 文件（如果存在）
load_dotenv()

class LLMConfig:
    """集中管理 LLM 相关配置的辅助类。

    支持的环境变量：
      - LLM_MODEL: 自定义模型名称（必填之一）
      - LLM_PROVIDER: 提供方（openai / azure / dashscope / other）
      - OPENAI_API_KEY / AZURE_OPENAI_API_KEY / DASHSCOPE_API_KEY 等：对应 provider 的密钥
      - LLM_TEMPERATURE: 采样温度 (float)
      - LLM_MAX_TOKENS: 最大 token (int)

    如果需要扩展，只需继续在 _gather 中追加。
    """

    @staticmethod
    @lru_cache(maxsize=1)
    def _gather() -> Dict[str, Optional[str]]:
        data = {
            "model": os.getenv("LLM_MODEL"),
            "provider": os.getenv("LLM_PROVIDER", "openai"),
            "openai_api_key": os.getenv("OPENAI_API_KEY"),
            "azure_api_key": os.getenv("AZURE_OPENAI_API_KEY"),
            "dashscope_api_key": os.getenv("DASHSCOPE_API_KEY"),
            "temperature": os.getenv("LLM_TEMPERATURE"),
            "max_tokens": os.getenv("LLM_MAX_TOKENS"),
        }
        return data

    @classmethod
    def get_model(cls) -> Optional[str]:
        return cls._gather().get("model")

    @classmethod
    def get_provider(cls) -> str:
        return cls._gather().get("provider") or "openai"

    @classmethod
    def get_api_key(cls) -> Optional[str]:
        provider = cls.get_provider().lower()
        data = cls._gather()
        if provider == "openai":
            return data.get("openai_api_key")
        if provider == "azure":
            return data.get("azure_api_key")
        if provider == "dashscope":
            return data.get("dashscope_api_key")
        # 其他自定义 provider 可在此扩展
        return data.get("openai_api_key") or data.get("dashscope_api_key")

    @classmethod
    def get_params(cls) -> Dict[str, object]:
        data = cls._gather()
        params: Dict[str, object] = {}
        if data.get("temperature"):
            try:
                params["temperature"] = float(data["temperature"])  # type: ignore
            except ValueError:
                pass
        if data.get("max_tokens"):
            try:
                params["max_tokens"] = int(data["max_tokens"])  # type: ignore
            except ValueError:
                pass
        return params

    @classmethod
    def summary(cls) -> Dict[str, Optional[str]]:
        d = cls._gather().copy()
        # 不暴露完整密钥
        for key in list(d.keys()):
            if key.endswith("api_key") and d[key]:
                d[key] = d[key][:4] + "***"  # type: ignore
        return d
