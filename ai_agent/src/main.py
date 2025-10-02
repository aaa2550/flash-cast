from __future__ import annotations

import os

from fastapi import FastAPI

from api.task import router as task_router
from douyin_login import douyin_helper

app = FastAPI(
    title="一键生成系统"
)

@app.on_event("startup")
async def startup_event():
    """应用启动时执行的异步初始化"""
    await douyin_helper.start_playwright()

# 注册路由
app.include_router(task_router)

if __name__ == "__main__":
    import uvicorn

    # 从环境变量获取服务器配置
    host = os.getenv("SERVER_HOST", "0.0.0.0")
    port = int(os.getenv("SERVER_PORT", "8000"))

    uvicorn.run("main:app", host=host, port=port, reload=True)
