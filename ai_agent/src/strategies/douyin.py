from __future__ import annotations

from typing import Dict, Any

from douyin_login import douyin_helper
from .base import TaskStrategy, StrategyRegistry

# 由于运行环境可能没有安装这些依赖，做延迟导入 + 容错
try:  # noqa
    from douyin_text_extractor import DouyinTextExtractor
except Exception:  # noqa
    DouyinTextExtractor = None  # type: ignore


@StrategyRegistry.register("douyin")
class DouyinStrategy(TaskStrategy):
    """抖音视频文本解析策略
    params:
      - api_key: dashscope api key (必填)
      - link: 单个分享链接 (与 links 二选一)
      - links: 多个分享链接 list
      - output_dir: 结果保存目录（默认 data/douyin）
      - aggregate: bool 是否汇总所有文本
    返回：{
      'items': [...],
      'aggregate_text': '...'?,
      'count': n
    }
    """

    def run(self) -> str:
        link = self.params.get("link")
        return douyin_helper.link_parse(link)
