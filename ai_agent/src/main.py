from __future__ import annotations
from fastapi import FastAPI, HTTPException, UploadFile, File, Header, Depends, Response
from fastapi import Cookie
import os, shutil, uuid
from models.schemas import CreateTaskRequest, CreateTaskResponse, TaskResultResponse
from core.task_manager import get_task_manager
from core.status import TaskStatus

app = FastAPI(title="AI Agent Service", version="0.1.0")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '..', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

EXPECTED_SESSION_COOKIE = "JSESSIONID"  # 简化：真实环境应通过配置

def require_session(jsessionid: str | None = Cookie(default=None, alias="JSESSIONID")):
    if not jsessionid:
        raise HTTPException(status_code=401, detail="Missing session cookie")
    # 这里可以加入校验逻辑（例如查询缓存/数据库），当前直接接受任意非空
    return jsessionid

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/tasks", response_model=CreateTaskResponse)
async def create_task(req: CreateTaskRequest):
    tm = get_task_manager()
    task_id = tm.submit(req.strategy, req.params)
    return CreateTaskResponse(task_id=task_id, status=TaskStatus.PENDING)

@app.get("/tasks/{task_id}", response_model=TaskResultResponse)
async def get_task(task_id: str):
    tm = get_task_manager()
    task = tm.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    # 将内部 dict 映射到响应模型
    return TaskResultResponse(
        task_id=task_id,
        status=task.get("status", TaskStatus.PENDING),
        strategy=task.get("strategy"),
        params=task.get("params"),
        result=task.get("result"),
        error=task.get("error"),
    )

@app.post("/tasks/{task_id}/cancel")
async def cancel_task(task_id: str):
    tm = get_task_manager()
    ok = tm.cancel(task_id)
    if not ok:
        raise HTTPException(status_code=400, detail="Cancel not accepted (task not found or already finished)")
    task = tm.get(task_id)
    return {"task_id": task_id, "status": task.get("status")}

@app.post("/api/resource/upload")
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

# 便于 uvicorn 调试
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
