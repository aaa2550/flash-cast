# 新的任务流程说明

## 📋 任务创建流程

### 1. 创建任务（一键合成/一键发布时）

**接口**: `POST /task/create`

**参数**:
- `startStep`: 从第几步开始（0-4）
- `json`: 子任务数组的JSON字符串

**子任务定义**:
```typescript
[
  {
    type: 'LINK_PARSE',
    parameter: { link: 'https://v.douyin.com/...' }
  },
  {
    type: 'COPY_REPRODUCE', 
    parameter: { content: '...', styles: '...', tone: '...', extraInstructions: '...' }
  },
  {
    type: 'TIMBRE_SYNTHESIS',
    parameter: { audioPath: '...', content: '...', emotionText: '...' }
  },
  {
    type: 'VIDEO_SYNTHESIS',
    parameter: { audioPath: '...', videoPath: '...', pixelType: 'RATIO_9_16' }
  },
  {
    type: 'PUBLISH',
    parameter: { videoPath: '...', title: '...', description: '...' }
  }
]
```

**返回数据**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 123,  // 主任务ID
    "subTasks": [
      { "id": 456, "seq": 0, "type": "LINK_PARSE", "status": "PENDING", ... },
      { "id": 457, "seq": 1, "type": "COPY_REPRODUCE", "status": "PENDING", ... },
      { "id": 458, "seq": 2, "type": "TIMBRE_SYNTHESIS", "status": "PENDING", ... },
      { "id": 459, "seq": 3, "type": "VIDEO_SYNTHESIS", "status": "PENDING", ... },
      { "id": 460, "seq": 4, "type": "PUBLISH", "status": "PENDING", ... }
    ]
  }
}
```

### 2. 执行子任务

每个子任务都需要携带对应的`subTaskId`：

#### 解析链接
```
POST /task/linkParse?subTaskId=456&link=https://v.douyin.com/...
返回: { code: 0, message: "操作成功", data: null }
```

#### 重写文案
```
POST /task/rewrite?subTaskId=457&content=...&styles=...&tone=...&extraInstructions=...
返回: { code: 0, message: "操作成功", data: null }
```

#### 合成音频
```
POST /task/timbreSynthesis?subTaskId=458&audioPath=...&content=...&emotionText=...
返回: { code: 0, message: "操作成功", data: null }
```

#### 合成视频
```
POST /task/videoSynthesis?subTaskId=459&audioPath=...&videoPath=...&pixelType=RATIO_9_16
返回: { code: 0, message: "操作成功", data: null }
```

#### 发布视频
```
POST /task/publish?subTaskId=460&videoPath=...&title=...&description=...
返回: { code: 0, message: "操作成功", data: null }
```

### 3. 轮询子任务状态

**接口**: `GET /task/check?subTaskId=456`

**返回**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "status": "SUCCESS",  // PENDING | RUNNING | SUCCESS | FAILED
    "result": "解析的文案内容..."  // 任务结果
  }
}
```

## 🔄 前端执行流程

### 单步执行模式

```typescript
// 1. 用户在当前Tab填写表单
// 2. 点击"执行此步骤"

// 3. 创建单步任务
const subTasks = [{
  type: 'LINK_PARSE',
  parameter: { link: douyinUrl }
}];
const { data } = await createTask(0, subTasks);
const subTaskId = data.subTasks[0].id;

// 4. 执行子任务
await linkParse(subTaskId, douyinUrl);

// 5. 轮询状态
const pollStatus = setInterval(async () => {
  const { data: checkData } = await checkSubTask(subTaskId);
  if (checkData.status === 'SUCCESS') {
    clearInterval(pollStatus);
    // 使用结果：checkData.result
    setResult(checkData.result);
  } else if (checkData.status === 'FAILED') {
    clearInterval(pollStatus);
    setError('执行失败');
  }
}, 2000);
```

### 一键合成模式

```typescript
// 从当前步骤到视频合成的所有步骤

// 1. 构建子任务数组
const subTasks = [];
const startStep = getCurrentStepIndex(); // 例如：0

// 根据startStep添加对应的子任务
if (startStep <= 0) {
  subTasks.push({
    type: 'LINK_PARSE',
    parameter: { link: douyinUrl }
  });
}
if (startStep <= 1) {
  subTasks.push({
    type: 'COPY_REPRODUCE',
    parameter: { content, styles, tone, extraInstructions }
  });
}
// ... 依此类推

// 2. 创建任务
const { data } = await createTask(startStep, subTasks);

// 3. 依次执行每个子任务
for (const subTask of data.subTasks) {
  // 执行子任务
  await executeSubTask(subTask);
  
  // 轮询直到完成
  await pollUntilComplete(subTask.id);
  
  // 自动进入下一步
}
```

### 一键发布模式

与一键合成类似，但包含PUBLISH步骤。

## 🎯 步骤索引对应

| startStep | 步骤名称 | SubTaskType |
|-----------|---------|-------------|
| 0 | 解析视频文案 | LINK_PARSE |
| 1 | 重写文案 | COPY_REPRODUCE |
| 2 | 合成音频 | TIMBRE_SYNTHESIS |
| 3 | 合成视频 | VIDEO_SYNTHESIS |
| 4 | 发布视频 | PUBLISH |

## 📝 前端状态管理

需要保存以下状态：

```typescript
// 主任务
const [mainTaskId, setMainTaskId] = useState<number | null>(null);

// 每个步骤的子任务ID映射
const [subTaskIds, setSubTaskIds] = useState<{
  parse?: number;
  rewrite?: number;
  audio?: number;
  video?: number;
  publish?: number;
}>({});

// 每个步骤的执行结果
const [stepResults, setStepResults] = useState<{
  parse?: string;
  rewrite?: string;
  audio?: string;
  video?: string;
  publish?: boolean;
}>({});
```

## 🔍 轮询策略

```typescript
const pollSubTask = (subTaskId: number, onComplete: (result: string) => void) => {
  const interval = setInterval(async () => {
    try {
      const { data } = await checkSubTask(subTaskId);
      
      if (data.data.status === 'SUCCESS') {
        clearInterval(interval);
        onComplete(data.data.result);
      } else if (data.data.status === 'FAILED') {
        clearInterval(interval);
        throw new Error('任务执行失败');
      }
      // PENDING 或 RUNNING 继续轮询
    } catch (error) {
      clearInterval(interval);
      throw error;
    }
  }, 2000); // 每2秒轮询一次
  
  return interval; // 返回interval ID以便取消
};
```

## 🎨 前端实现要点

### 1. 创建任务时机
- 点击"执行此步骤"：创建单步任务
- 点击"一键合成"：创建从当前步到视频合成的任务
- 点击"一键发布"：创建从当前步到发布的所有任务

### 2. parameter参数构建
根据不同的SubTaskType，parameter包含不同的字段：
- `LINK_PARSE`: `{ link }`
- `COPY_REPRODUCE`: `{ content, styles, tone, extraInstructions }`
- `TIMBRE_SYNTHESIS`: `{ audioPath, content, emotionText }`
- `VIDEO_SYNTHESIS`: `{ audioPath, videoPath, pixelType }`
- `PUBLISH`: `{ videoPath, title, description }`

### 3. 自动流转逻辑
```typescript
// 一键模式下
for (let i = 0; i < subTasks.length; i++) {
  const subTask = subTasks[i];
  
  // 1. 执行子任务API
  await executeSubTaskAPI(subTask);
  
  // 2. 轮询状态直到完成
  const result = await pollUntilSuccess(subTask.id);
  
  // 3. 保存结果到下一步的参数
  updateNextStepParams(result);
  
  // 4. 更新UI状态
  updateStepStatus(subTask.type, 'SUCCESS');
  
  // 5. 如果是一键合成且到了视频合成，停止
  if (autoMode === 'auto-synthesis' && subTask.type === 'VIDEO_SYNTHESIS') {
    break;
  }
}
```

### 4. 错误处理
- 任何步骤失败立即停止
- 显示具体错误信息
- 允许重置后重试

## 🚀 使用示例

```typescript
// 示例：一键发布从解析开始

// 1. 构建子任务数组
const subTasks = [
  { type: 'LINK_PARSE', parameter: { link: douyinUrl } },
  { type: 'COPY_REPRODUCE', parameter: { content: '', styles: '专业', tone: '友好', extraInstructions: '' } },
  { type: 'TIMBRE_SYNTHESIS', parameter: { audioPath: '', content: '', emotionText: '平静' } },
  { type: 'VIDEO_SYNTHESIS', parameter: { audioPath: '', videoPath: '', pixelType: 'RATIO_9_16' } },
  { type: 'PUBLISH', parameter: { videoPath: '', title: '', description: '' } }
];

// 2. 创建任务（startStep=0表示从第一步开始）
const { data: taskData } = await createTask(0, subTasks);

// 3. 执行第一步：解析链接
const parseSubTaskId = taskData.data.subTasks[0].id;
await linkParse(parseSubTaskId, douyinUrl);

// 4. 轮询第一步状态
const parseResult = await pollUntilSuccess(parseSubTaskId);

// 5. 使用第一步结果执行第二步
const rewriteSubTaskId = taskData.data.subTasks[1].id;
await rewrite(rewriteSubTaskId, parseResult, '专业', '友好', '');

// ... 依此类推
```

---

**文档版本**: v2.0  
**更新时间**: 2025-10-02  
**状态**: 准备实现
