from __future__ import annotations

import os
import shutil
import uuid
from datetime import datetime, timedelta
import logging

from fastapi import Cookie
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, APIRouter

from core.status import TaskStatus
from core.task_manager import get_task_manager
from douyin_login import douyin_helper
from models.response_models import BaseResponse
from models.schemas import CreateTaskRequest, CreateTaskResponse, TaskResultResponse
from strategies import StrategyRegistry

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '../..', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

EXPECTED_SESSION_COOKIE = "JSESSIONID"  # 简化：真实环境应通过配置

router = APIRouter(
    prefix="/api",
    tags=["task"],
    responses={
        401: {"description": "未授权访问"},
        403: {"description": "权限不足"},
        404: {"description": "资源不存在"},
        422: {"description": "请求参数验证失败"},
        500: {"description": "服务器内部错误"}
    }
)

def require_session(jsessionid: str | None = Cookie(default=None, alias="JSESSIONID")):
    if not jsessionid:
        raise HTTPException(status_code=401, detail="Missing session cookie")
    # 这里可以加入校验逻辑（例如查询缓存/数据库），当前直接接受任意非空
    return jsessionid


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/tasks", response_model=BaseResponse)
async def create_task(req: CreateTaskRequest):
    tm = get_task_manager()
    task_id = tm.submit(req.strategy, req.params)
    return BaseResponse.success_response(data=task_id)


@router.get("/tasks/{task_id}", response_model=BaseResponse)
async def get_task(task_id: str):
    tm = get_task_manager()
    task = tm.get(task_id)
    # 将内部 dict 映射到响应模型
    data = TaskResultResponse(task_id=task_id, status=task.get("status", TaskStatus.PENDING),
                                  strategy=task.get("strategy"), params=task.get("params"), result=task.get("result"),
                                  error=task.get("error"), )
    return BaseResponse.success_response(data=data)


@router.post("/tasks/{task_id}/cancel")
async def cancel_task(task_id: str):
    tm = get_task_manager()
    ok = tm.cancel(task_id)
    if not ok:
        raise HTTPException(status_code=400, detail="Cancel not accepted (task not found or already finished)")
    task = tm.get(task_id)
    return {"task_id": task_id, "status": task.get("status")}

@router.post("/link_parse", response_model=BaseResponse)
async def link_parse(link: str):
    print(f'link_parse begin...')
    result = douyin_helper.link_parse(link)
    logger.info(f'result={result}')
    return BaseResponse.success_response(data=result)

@router.get("/douyin/get_image_base64", response_model=BaseResponse)
async def douyin_get_image_base64(user_id: int):
    try:
        douyin_user_info = douyin_helper.get_cookies(user_id)
        if douyin_user_info and douyin_user_info.base64 and douyin_user_info.time:
            # 检查缓存的二维码是否还有效（30秒内）
            if douyin_user_info.time + 30000 > int(datetime.now().timestamp() * 1000):
                return BaseResponse.success_response(data=douyin_user_info.base64)
        
        # 获取新的二维码
        image_base64 = await douyin_helper.get_image_base64(user_id)
        return BaseResponse.success_response(data=image_base64)
    except Exception as e:
        logger.error(f"Error get_image_base64: {str(e)}")
        return BaseResponse.error_response(message=f"获取二维码失败: {str(e)}")



@router.post("/douyin/publish", response_model=BaseResponse)
async def douyin_publish(user_id: int, task_id: int, path: str):
    await douyin_helper.publish(user_id, task_id, path)
    return BaseResponse.success_response()


@router.get("/douyin/get_status", response_model=BaseResponse)
async def douyin_get_status(task_id: int):
    status = douyin_helper.get_status(task_id)
    return BaseResponse.success_response(data=status)


@router.get("/douyin/get_cookies", response_model=BaseResponse)
async def douyin_get_cookies(user_id: int):
    douyin_user_info = douyin_helper.get_cookies(user_id)
    return BaseResponse.success_response(data=douyin_user_info)


@router.post("/resource/upload")
async def upload_resource(
        file: UploadFile = File(..., description="视频或音频文件"),
        jsessionid: str = Depends(require_session),
):
    """上传视频/音频文件接口。
    鉴权: 通过 Cookie: JSESSIONID (示例逻辑)
    返回: {id, filename, saved_path, media_type, size}
    401 情况: 未提供或非法 session cookie
    """
    # 验证 MIME（简单判断）
    content_type = file.content_type or "application/octet-stream"
    if not (content_type.startswith("video/") or content_type.startswith("audio/")):
        raise HTTPException(status_code=400, detail=f"Unsupported content_type: {content_type}")

    # 保存文件
    file_ext = os.path.splitext(file.filename or "")[1]
    media_id = uuid.uuid4().hex
    safe_name = f"{media_id}{file_ext}"
    save_path = os.path.join(UPLOAD_DIR, safe_name)
    try:
        with open(save_path, 'wb') as out:
            shutil.copyfileobj(file.file, out)
    finally:
        file.file.close()

    size = os.path.getsize(save_path)
    return {
        "id": media_id,
        "filename": file.filename,
        "saved_path": os.path.abspath(save_path),
        "media_type": "video" if content_type.startswith("video/") else "audio",
        "size": size,
        "content_type": content_type,
    }

