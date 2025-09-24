# AI Agent Service

基于 FastAPI + 策略模式 + crewAI(可选) 的通用异步任务执行服务。

## 功能特性
- 通过 POST /tasks 提交一个 AI 任务，指定 strategy 与 params
- 支持多策略：research / summarize / code，可按需扩展
- 新增 douyin 策略：批量解析抖音分享链接转文字（依赖 dashscope 语音识别）
- 新增 rewrite 策略：多风格文案改写（基于 crewai，多 Agent）
- 新增 publish_douyin 策略：模拟抖音视频发布（用户名/密码/视频路径）
 - 新增通用上传接口 `/api/resource/upload`：上传视频/音频文件（需要 Cookie 鉴权）
- 使用线程池异步执行，立即返回 task_id
- GET /tasks/{task_id} 查询状态：PENDING / RUNNING / SUCCESS / FAILED
- 结果或错误持久化到 `data/task_<id>.json`
- crewai 未安装时自动使用 stub 逻辑，便于本地快速调试

## 目录结构
```
requirements.txt
src/
  main.py               # FastAPI 入口
  core/
    status.py           # TaskStatus 枚举
    persistence.py      # 文件持久化
    task_manager.py     # 任务提交与执行调度
  strategies/
    base.py             # 策略抽象与注册表
    research.py         # research 策略
    summarize.py        # summarize 策略
    code.py             # code 生成策略
  models/
    schemas.py          # Pydantic 请求/响应模型
```

## 安装依赖
推荐使用 uv（或直接 pip）。

### 使用 uv
```bash
uv sync            # 安装全部主依赖
# 若只想安装核心再单独安装 douyin 相关，可: uv sync --no-dev ; uv pip install .[douyin]
```

### 使用传统 pip
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -e .          # 读取 pyproject.toml 安装
```

douyin 策略依赖在 pyproject.toml 已内置：requests / ffmpeg-python / dashscope。
需要本机有 ffmpeg 可执行文件：
```bash
brew install ffmpeg   # macOS
# 或参考各平台安装文档
```

(可选) 配置 OpenAI / LLM 相关环境变量供 crewai 使用：
```
export OPENAI_API_KEY=sk-xxx
export LLM_MODEL=gpt-4o
export LLM_PROVIDER=openai   # 可: openai | azure | dashscope | other
export LLM_TEMPERATURE=0.7
export LLM_MAX_TOKENS=2048
```

`.env` 文件示例：
```
OPENAI_API_KEY=sk-xxxx
LLM_MODEL=gpt-4o
LLM_PROVIDER=openai
LLM_TEMPERATURE=0.6
LLM_MAX_TOKENS=1500
```

在代码中可通过：
```python
from core.config import LLMConfig
model = LLMConfig.get_model()
provider = LLMConfig.get_provider()
api_key = LLMConfig.get_api_key()
params = LLMConfig.get_params()
print(model, provider, params)
```

## 启动服务
```bash
cd src
uvicorn main:app --reload --port 8000
```

## 提交任务示例
### 1. Research
```bash
curl -s -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"strategy":"research","params":{"topic":"vector databases"}}'
```

### 2. Summarize
```bash
curl -s -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"strategy":"summarize","params":{"texts":["LangChain is a framework...","Vector DB stores embeddings..."]}}'
```

### 3. Code 生成
```bash
curl -s -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"strategy":"code","params":{"instruction":"read a json file and pretty print it","language":"python"}}'
```

返回示例：
### 4. Douyin 文案提取
依赖额外安装: `pip install requests ffmpeg-python dashscope`

提交：
```bash
curl -s -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "strategy":"douyin",
    "params":{
      "api_key":"<DASHSCOPE_KEY>",
      "links":["<抖音分享文案或链接1>", "<抖音分享文案或链接2>"],
      "aggregate": true,
      "output_dir": "data/douyin_outputs"
    }
  }'
```

查询：
```bash
curl -s http://localhost:8000/tasks/<task_id>
```

成功 result 结构示例：
```json
{
  "items": [
    {"link": "分享1...", "text": "识别文本..."},
    {"link": "分享2...", "text": "识别文本..."}
  ],
  "count": 2,
  "aggregate_text": "识别文本...\n识别文本..."
}
```

输出文件：
- 单条：`<task_id>_1.json`, `<task_id>_2.json` ...
- 汇总文本：`<task_id>_all.txt`
- 汇总元数据：`<task_id>_result.json`

### 5. Rewrite 文案改写
```bash
curl -s -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "strategy":"rewrite",
    "params":{
      "text":"我们即将发布一款全新的 AI 产品，欢迎提前预约测试。",
      "styles":["简洁","专业","营销"],
      "tone":"friendly",
      "extra_instructions":"避免夸张用语",
      "model_key":"bailian-qwen-plus"
    }
  }'
```
查询：
```bash
curl -s http://localhost:8000/tasks/<task_id>
```
result 示例 (stub 情况)：
```json
{
  "original": "我们即将发布一款全新的 AI 产品，欢迎提前预约测试。",
  "rewrites": [
    {"style": "简洁", "content": "【简洁改写】我们即将发布一款全新的 AI 产品... (stub rewrite)"},
    {"style": "专业", "content": "【专业改写】我们即将发布一款全新的 AI 产品... (stub rewrite)"}
  ],
  "model": "bailian-qwen-plus"
}
```

可用模型来自 `config/llm_agents.yaml`，也可使用 `model` 或 `override_model` 作为同义参数。

### 6. Publish Douyin (发布抖音视频模拟)
参数：
```json
{
  "strategy": "publish_douyin",
  "params": {
    "username": "your_account",
    "password": "your_password",
    "video_path": "/absolute/path/video.mp4",
    "title": "视频标题(可选)",
    "description": "描述(可选)"
  }
}
```
示例：
```bash
curl -s -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "strategy":"publish_douyin",
    "params":{
      "username":"demo_user",
      "password":"secret",
      "video_path":"/tmp/demo.mp4",
      "title":"测试上传"
    }
  }'
```
查询：
```bash
curl -s http://localhost:8000/tasks/<task_id>
```
成功 result 示例：
```json
{
  "action": "publish",
  "username": "demo_user",
  "video_path": "/tmp/demo.mp4",
  "video_id": "dy_1730000000_1234",
  "status": "published",
  "title": "测试上传",
  "description": null
}
```
取消中的可能输出：
```json
{"status":"cancelled","progress":55,"message":"cancel requested"}
```
注意：当前为模拟流程（登录→分片上传→审核），实际接入抖音开放平台需替换为真实 API 调用、鉴权、回调处理等。

```json
{"task_id": "a1b2c3...", "status": "PENDING"}
```

## 查询任务
```bash
curl -s http://localhost:8000/tasks/<task_id>
```
成功示例：
```json
{
  "task_id": "a1b2c3...",
  "status": "SUCCESS",
  "strategy": "research",
  "params": {"topic": "vector databases"},
  "result": {"type": "research", "topic": "vector databases", "summary": "(stub) Research summary about vector databases"}
}
```
失败示例：
```json
{
  "task_id": "...",
  "status": "FAILED",
  "error": "Strategy 'xxx' not found; available: ['research','summarize','code']"
}
```

## 扩展新的策略
1. 在 `strategies/` 下新增文件，如 `my_strategy.py`
2. 继承 `TaskStrategy` 并使用 `@StrategyRegistry.register("my_strategy")`
3. 实现 `run()` 返回字典
4. FastAPI 无需改动，直接使用 `strategy":"my_strategy"` 提交

```python
from strategies.base import TaskStrategy, StrategyRegistry

@StrategyRegistry.register("my_strategy")
class MyStrategy(TaskStrategy):
    def run(self):
        # 自定义逻辑
        return {"type": "my_strategy", "message": "hello"}
```

## 测试 (待补充)
示例使用 `tests` 目录补充 TestClient 调用。

## License
MIT (根据需要自行调整)

## 取消任务
你可以在任务处于 PENDING 或 RUNNING 状态时尝试取消：

```bash
curl -X POST http://localhost:8000/tasks/<task_id>/cancel
```

取消语义：
1. PENDING：如果线程池尚未开始执行，直接标记为 CANCELLED。
2. RUNNING：当前实现为“软取消”，仅做标记，策略完成后如果检测到取消标记，则丢弃结果写入 CANCELLED。（当前基础策略运行中没有细粒度中断点，仅在结束时检查。）
3. SUCCESS/FAILED/CANCELLED：返回 400，拒绝取消。

测试时可在 params 中加入 `{"sleep": 5}` 或 `{"simulate_delay": 5}` 模拟耗时。

示例：
```bash
curl -s -X POST http://localhost:8000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"strategy":"research","params":{"topic":"python","sleep":5}}' | tee /tmp/task.json
TASK_ID=$(jq -r '.task_id' /tmp/task.json)
curl -s -X POST http://localhost:8000/tasks/$TASK_ID/cancel
curl -s http://localhost:8000/tasks/$TASK_ID
```

## 未来改进（取消相关）
- 在策略执行过程中增加周期性检查以更快响应取消
- 支持真正可中断的 I/O 或异步协程模式
- 引入队列优先级与限流

## LLMFactory (基于 YAML 的 Agent 构建)
你可以在 `config/llm_agents.yaml` 中集中管理可用模型与 Agent 偏好，然后通过工厂创建：

```python
from core.llm_factory import LLMFactory

print(LLMFactory.list_models())
print(LLMFactory.list_agents())
agent = LLMFactory.create_agent('小学课程设计专家')
print(agent.goal)

# 覆盖指定模型
agent2 = LLMFactory.create_agent('小学课程设计专家', override_model='bailian-qwen-plus')

# 批量
agents = LLMFactory.create_agents(['小学课程设计专家','课件内容整合专家'])

print(LLMFactory.debug_summary())
```

如果未安装 crewai 或缺少依赖，将返回 stub dict；正式环境会返回 crewai.Agent。

## LLMModelFactory (按模型名获取 LLM 对象)
当你只需要通过模型名称获取一个可用于 Agent 的 LLM（或其参数）而不是直接构建 Agent 时，可使用：

```python
from core.llm_model_factory import LLMModelFactory

print(LLMModelFactory.summary())
llm_obj = LLMModelFactory.create_llm('bailian-qwen-plus')
print(llm_obj)
params = LLMModelFactory.get_model_params('bailian-qwen-plus')
```

在未安装 crewai 时返回结构中会包含 `stub: True` 及模型配置参数；安装后返回 `crewai.LLM` 实例。

## 通用上传接口
接口：`POST /api/resource/upload`

鉴权：需要在请求中携带 Cookie `JSESSIONID=<session>`（当前示例接受任意非空值，生产需校验合法性）。

请求示例（curl）：
```bash
curl --location --request POST 'http://localhost:8000/api/resource/upload' \
  --header 'Cookie: JSESSIONID=ABC123SESSION' \
  --form 'file=@/absolute/path/demo.mp4'
```

成功响应示例：
```json
{
  "id": "f0e1d2c3...",
  "filename": "demo.mp4",
  "saved_path": "/.../uploads/f0e1d2c3.mp4",
  "media_type": "video",
  "size": 1234567,
  "content_type": "video/mp4"
}
```

错误：
- 401 未携带或无效会话 Cookie
- 400 不支持的 content_type（仅 video/* 或 audio/*）

### 前端预览区域建议
手机竖屏常见宽高比 9:16，可使用如下容器：
```html
<div class="phone-preview">
  <video id="previewVideo" playsinline controls></video>
</div>
```
```css
.phone-preview {
  width: 270px;              /* 可调：依据设计稿 */
  height: calc(270px * 16 / 9);
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.phone-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 填满裁切 */
}
```
说明：
1. 固定宽度按 9:16 计算高度，保证统一竖屏框。
2. `object-fit: cover` 保证视频内容铺满区域。
3. 音频文件可在同容器内用波形或封面替代 `<video>`。

### 去掉音频名称输入
上传音频时通常文件名即可标识；若仍需展示，可在上传完成后只做只读展示而非输入框。前端处理：检测 `media_type === 'audio'` 时隐藏“名称”输入组件。
