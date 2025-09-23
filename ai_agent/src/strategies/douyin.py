from __future__ import annotations
from typing import Dict, Any, List
from pathlib import Path
import os
import json
import time

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

    def run(self) -> Dict[str, Any]:
        if DouyinTextExtractor is None:
            return {"error": "DouyinTextExtractor 不可用，缺少依赖或导入失败"}

        api_key = os.getenv('DASHSCOPE_API_KEY')
        if not api_key:
            return {"error": "missing 'api_key'"}

        links_param = self.params.get("links")
        link_single = self.params.get("link")
        if link_single and not links_param:
            links: List[str] = [link_single]
        elif links_param and isinstance(links_param, list):
            links = [l for l in links_param if isinstance(l, str) and l.strip()]
        else:
            return {"error": "missing 'link' or 'links'"}

        output_dir = Path(self.params.get("output_dir") or "data/douyin")
        output_dir.mkdir(parents=True, exist_ok=True)

        extractor = DouyinTextExtractor(api_key=api_key)
        items = []
        for idx, lk in enumerate(links, start=1):
            try:
                text = extractor.extract_text(lk)
                item = {"link": lk, "text": text}
                items.append(item)
                # 保存单条
                filename = output_dir / f"{self.task_id or 'task'}_{idx}.json"
                with filename.open("w", encoding="utf-8") as f:
                    json.dump(item, f, ensure_ascii=False, indent=2)
            except Exception as e:  # noqa
                items.append({"link": lk, "error": str(e)})

        result: Dict[str, Any] = {"items": items, "count": len(items)}
        if self.params.get("aggregate"):
            texts = [it.get("text", "") for it in items if it.get("text")]
            result["aggregate_text"] = "\n".join(texts)
            # 额外保存汇总文件
            agg_file = output_dir / f"{self.task_id or 'task'}_all.txt"
            agg_file.write_text(result["aggregate_text"], encoding="utf-8")

        # 记录一个总结果文件
        meta_path = output_dir / f"{self.task_id or 'task'}_result.json"
        with meta_path.open("w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        return result
