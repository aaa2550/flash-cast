import time
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_create_and_get_research_task():
    resp = client.post("/tasks", json={"strategy": "research", "params": {"topic": "python"}})
    assert resp.status_code == 200
    task_id = resp.json()["task_id"]
    # 轮询直到完成或超时
    for _ in range(30):
        r = client.get(f"/tasks/{task_id}")
        assert r.status_code == 200
        data = r.json()
        if data["status"] in ("SUCCESS", "FAILED"):
            break
        time.sleep(0.1)
    assert data["status"] == "SUCCESS"
    assert data["result"]["type"] == "research"

def test_invalid_strategy():
    resp = client.post("/tasks", json={"strategy": "nope", "params": {}})
    assert resp.status_code == 200
    task_id = resp.json()["task_id"]
    for _ in range(30):
        r = client.get(f"/tasks/{task_id}")
        data = r.json()
        if data["status"] in ("SUCCESS", "FAILED"):
            break
        time.sleep(0.05)
    assert data["status"] == "FAILED"
    assert "not found" in data["error"].lower()


def test_cancel_pending_or_running_task():
    # 提交一个带延迟的任务
    resp = client.post("/tasks", json={"strategy": "research", "params": {"topic": "cancel test", "sleep": 2}})
    assert resp.status_code == 200
    task_id = resp.json()["task_id"]
    # 立即发送取消
    cancel_resp = client.post(f"/tasks/{task_id}/cancel")
    assert cancel_resp.status_code == 200
    # 轮询直到状态确定
    for _ in range(40):
        r = client.get(f"/tasks/{task_id}")
        data = r.json()
        if data["status"] in ("CANCELLED", "FAILED", "SUCCESS"):
            break
        time.sleep(0.1)
    assert data["status"] == "CANCELLED"


def test_rewrite_strategy_stub():
    resp = client.post("/tasks", json={"strategy": "rewrite", "params": {"text": "这是一个测试文案。", "styles": ["简洁", "专业"]}})
    assert resp.status_code == 200
    task_id = resp.json()["task_id"]
    for _ in range(40):
        r = client.get(f"/tasks/{task_id}")
        data = r.json()
        if data["status"] in ("SUCCESS", "FAILED"):
            break
        time.sleep(0.05)
    assert data["status"] == "SUCCESS"
    assert data["result"]["original"].startswith("这是一个测试文案")
    assert len(data["result"]["rewrites"]) == 2
