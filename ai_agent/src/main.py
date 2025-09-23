from __future__ import annotations
from fastapi import FastAPI, HTTPException
from models.schemas import CreateTaskRequest, CreateTaskResponse, TaskResultResponse
from core.task_manager import get_task_manager
from core.status import TaskStatus

app = FastAPI(title="AI Agent Service", version="0.1.0")

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

# 便于 uvicorn 调试
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
