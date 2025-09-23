from __future__ import annotations
import time
import random
from typing import Dict, Any
from .base import TaskStrategy, StrategyRegistry
from core.status import TaskStatus

@StrategyRegistry.register("publish_douyin")
class PublishDouyinStrategy(TaskStrategy):
    """抖音视频发布策略 (模拟版)

    需求参数 params:
      - username: str  用户名 (必填)
      - password: str  密码   (必填)
      - video_path: str 本地视频文件路径 (必填)
      - title: 可选 视频标题
      - description: 可选 视频描述

    行为:
      1. 校验参数
      2. 模拟登录 (1s)
      3. 模拟上传分片 (3~5 片, 每片 0.5s)
      4. 模拟审核/发布 (1~2s)
      5. 产生 video_id 并返回结果

    取消: 如果任务在执行中被标记取消, 将提前结束并返回取消状态。
    输出结构 (成功): {
        'action': 'publish',
        'username': '***',
        'video_path': 'xxx.mp4',
        'video_id': 'dy_xxx',
        'status': 'published',
        'title': '...', 'description': '...'
    }
    输出结构 (失败或缺参): {'error': '...'}
    输出结构 (取消): {'status': 'cancelled', 'progress': <0~100>, 'message': 'cancel requested'}
    """

    def _check_cancel(self, progress: int | None = None):
        # 软取消: 仅检查 task_manager 的 cancel flag, 外部会在完成后统一写入 CANCELLED 状态
        if hasattr(self, 'cancel_requested') and self.cancel_requested:  # 保留兼容 (若基类添加) 
            return True
        # 现有实现中 cancel flag 在 TaskManager 层, 这里无法直接访问; 预留扩展 hook
        return False

    def run(self) -> Dict[str, Any]:
        username = self.params.get('username')
        password = self.params.get('password')
        video_path = self.params.get('video_path')
        title = self.params.get('title')
        description = self.params.get('description')

        if not username or not password or not video_path:
            return {'error': "missing 'username' | 'password' | 'video_path'"}

        # 1. 模拟登录
        time.sleep(1)
        if self._check_cancel():
            return {'status': 'cancelled', 'progress': 5, 'message': 'cancel requested'}

        # 2. 模拟上传 (分片)
        total_chunks = random.randint(3, 5)
        for i in range(1, total_chunks + 1):
            time.sleep(0.5)
            if self._check_cancel():
                progress = 5 + int(i / total_chunks * 70)
                return {'status': 'cancelled', 'progress': progress, 'message': 'cancel requested'}

        # 3. 模拟审核/发布
        audit_time = random.randint(1, 2)
        for s in range(audit_time):
            time.sleep(1)
            if self._check_cancel():
                progress = 80 + int((s + 1) / audit_time * 15)
                return {'status': 'cancelled', 'progress': progress, 'message': 'cancel requested'}

        # 4. 生成 video_id
        video_id = f"dy_{int(time.time())}_{random.randint(1000,9999)}"

        return {
            'action': 'publish',
            'username': username,
            'video_path': video_path,
            'video_id': video_id,
            'status': 'published',
            'title': title,
            'description': description,
        }
