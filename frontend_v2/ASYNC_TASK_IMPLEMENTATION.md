# 异步任务流程完整实现方案

## 🎯 核心流程

### 步骤1: 创建任务（一键合成/一键发布时）

**调用接口**: `POST /task/create?startStep=X&json=...`

**参数构建示例**（从步骤0开始一键发布）:
```json
startStep=0
json=[
  {"type":"LINK_PARSE","parameter":{"link":"https://v.douyin.com/xxx"}},
  {"type":"COPY_REPRODUCE","parameter":{"content":"","styles":"专业","tone":"友好","extraInstructions":""}},
  {"type":"TIMBRE_SYNTHESIS","parameter":{"audioPath":"","content":"","emotionText":"平静"}},
  {"type":"VIDEO_SYNTHESIS","parameter":{"audioPath":"","videoPath":"","pixelType":"RATIO_9_16"}},
  {"type":"PUBLISH","parameter":{"videoPath":"","title":"","description":""}}
]
```

**返回数据**:
```json
{
  "code": 0,
  "data": {
    "id": 100,
    "subTasks": [
      {"id": 1001, "seq": 0, "type": "LINK_PARSE", "status": "PENDING"},
      {"id": 1002, "seq": 1, "type": "COPY_REPRODUCE", "status": "PENDING"},
      {"id": 1003, "seq": 2, "type": "TIMBRE_SYNTHESIS", "status": "PENDING"},
      {"id": 1004, "seq": 3, "type": "VIDEO_SYNTHESIS", "status": "PENDING"},
      {"id": 1005, "seq": 4, "type": "PUBLISH", "status": "PENDING"}
    ]
  }
}
```

### 步骤2: 执行子任务

**根据seq顺序执行每个子任务**:

```typescript
// 执行第一个子任务（seq=0, LINK_PARSE）
await linkParse(1001, 'https://v.douyin.com/xxx');
// 返回: { code: 0, message: "操作成功", data: null }

// 开始轮询状态
while (true) {
  const { data } = await checkSubTask(1001);
  if (data.data.status === 'SUCCESS') {
    const parsedContent = data.data.result; // 解析的文案
    break;
  } else if (data.data.status === 'FAILED') {
    throw new Error('解析失败');
  }
  await sleep(2000); // 等待2秒继续轮询
}

// 执行第二个子任务（seq=1, COPY_REPRODUCE）
await rewrite(1002, parsedContent, '专业', '友好', '');

// 轮询第二个子任务状态
while (true) {
  const { data } = await checkSubTask(1002);
  if (data.data.status === 'SUCCESS') {
    const rewrittenContent = data.data.result;
    break;
  } else if (data.data.status === 'FAILED') {
    throw new Error('重写失败');
  }
  await sleep(2000);
}

// ... 继续执行后续子任务
```

## 📝 前端实现要点

### 1. SubTaskType 枚举映射

| 步骤索引 | 步骤名称 | SubTaskType | parameter字段 |
|---------|---------|-------------|--------------|
| 0 | 解析视频文案 | LINK_PARSE | link |
| 1 | 重写文案 | COPY_REPRODUCE | content, styles, tone, extraInstructions |
| 2 | 合成音频 | TIMBRE_SYNTHESIS | audioPath, content, emotionText |
| 3 | 合成视频 | VIDEO_SYNTHESIS | audioPath, videoPath, pixelType |
| 4 | 发布视频 | PUBLISH | videoPath, title, description |

### 2. 状态管理

```typescript
// 主任务ID
const [mainTaskId, setMainTaskId] = useState<number | null>(null);

// 子任务ID映射（按seq索引）
const [subTaskIds, setSubTaskIds] = useState<number[]>([]);

// 当前执行到哪个seq
const [currentSeq, setCurrentSeq] = useState<number>(-1);

// 每个步骤的结果
const [stepResults, setStepResults] = useState<{
  [seq: number]: string;
}>({});
```

### 3. 核心函数

#### buildSubTasks - 构建子任务数组
```typescript
const buildSubTasks = (startStep: number, includePublish: boolean) => {
  const tasks = [];
  
  // startStep=0: 从解析开始
  if (startStep <= 0) {
    tasks.push({
      type: 'LINK_PARSE',
      parameter: { link: douyinUrl }
    });
  }
  
  // startStep<=1: 包含重写
  if (startStep <= 1) {
    tasks.push({
      type: 'COPY_REPRODUCE',
      parameter: {
        content: rewriteParams.content,
        styles: rewriteParams.styles,
        tone: rewriteParams.tone,
        extraInstructions: rewriteParams.extraInstructions
      }
    });
  }
  
  // startStep<=2: 包含音频合成
  if (startStep <= 2) {
    tasks.push({
      type: 'TIMBRE_SYNTHESIS',
      parameter: {
        audioPath: audioParams.audioPath,
        content: audioParams.content,
        emotionText: audioParams.emotionText
      }
    });
  }
  
  // startStep<=3: 包含视频合成
  if (startStep <= 3) {
    tasks.push({
      type: 'VIDEO_SYNTHESIS',
      parameter: {
        audioPath: videoParams.audioPath,
        videoPath: videoParams.videoPath,
        pixelType: videoParams.pixelType
      }
    });
  }
  
  // 如果是一键发布，包含发布步骤
  if (includePublish && startStep <= 4) {
    tasks.push({
      type: 'PUBLISH',
      parameter: {
        videoPath: publishParams.videoPath,
        title: publishParams.title,
        description: publishParams.description
      }
    });
  }
  
  return tasks;
};
```

#### executeSubTaskBySeq - 执行指定seq的子任务
```typescript
const executeSubTaskBySeq = async (seq: number, subTaskId: number) => {
  const stepIndex = seq; // seq对应步骤索引
  
  switch (stepIndex) {
    case 0: // LINK_PARSE
      await linkParse(subTaskId, douyinUrl);
      break;
    case 1: // COPY_REPRODUCE
      const content = stepResults[0] || rewriteParams.content;
      await rewrite(subTaskId, content, rewriteParams.styles, rewriteParams.tone, rewriteParams.extraInstructions);
      break;
    case 2: // TIMBRE_SYNTHESIS
      const textContent = stepResults[1] || audioParams.content;
      await timbreSynthesis(subTaskId, audioParams.audioPath, textContent, audioParams.emotionText);
      break;
    case 3: // VIDEO_SYNTHESIS
      const audioPath = stepResults[2] || videoParams.audioPath;
      await videoSynthesis(subTaskId, audioPath, videoParams.videoPath, videoParams.pixelType);
      break;
    case 4: // PUBLISH
      const videoPath = stepResults[3] || publishParams.videoPath;
      await publish(subTaskId, videoPath, publishParams.title, publishParams.description);
      break;
  }
};
```

#### pollSubTaskStatus - 轮询子任务状态
```typescript
const pollSubTaskStatus = (subTaskId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await checkSubTask(subTaskId);
        
        if (data.data.status === 'SUCCESS') {
          clearInterval(interval);
          resolve(data.data.result || '');
        } else if (data.data.status === 'FAILED') {
          clearInterval(interval);
          reject(new Error('任务执行失败'));
        }
        // PENDING 或 RUNNING 继续轮询
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 2000);
  });
};
```

#### runAutoWorkflow - 运行自动工作流
```typescript
const runAutoWorkflow = async (mode: 'synthesis' | 'publish') => {
  try {
    setAutoMode(mode === 'synthesis' ? 'auto-synthesis' : 'auto-publish');
    
    const currentStep = getCurrentStepIndex();
    const includePublish = mode === 'publish';
    
    // 1. 构建子任务数组
    const subTasks = buildSubTasks(currentStep, includePublish);
    
    // 2. 创建任务
    const { data: taskData } = await createTask(currentStep, subTasks);
    setMainTaskId(taskData.data.id);
    
    const subTaskList = taskData.data.subTasks;
    const ids = subTaskList.map(st => st.id);
    setSubTaskIds(ids);
    
    // 3. 依次执行每个子任务
    for (let i = 0; i < subTaskList.length; i++) {
      const subTask = subTaskList[i];
      const seq = subTask.seq;
      
      // 更新UI：当前步骤为执行中
      updateStepStatusBySeq(seq, 'running');
      setCurrentSeq(seq);
      
      // 执行子任务
      await executeSubTaskBySeq(seq, subTask.id);
      
      // 轮询状态直到完成
      const result = await pollSubTaskStatus(subTask.id);
      
      // 保存结果
      setStepResults(prev => ({ ...prev, [seq]: result }));
      
      // 更新UI：当前步骤为成功
      updateStepStatusBySeq(seq, 'success');
      
      // 自动填充到下一步的表单
      fillNextStepForm(seq, result);
    }
    
    setAutoMode('manual');
  } catch (error: any) {
    setError(error.message);
    setAutoMode('manual');
  }
};
```

## 🔄 完整流程示例

用户在"解析视频文案"步骤，点击"一键发布"：

```
1. currentStep = 0
2. buildSubTasks(0, true) 返回5个子任务
3. createTask(0, subTasks) 
   → 返回主任务ID=100，子任务IDs=[1001,1002,1003,1004,1005]

4. 执行subTask[0] (seq=0, LINK_PARSE, id=1001)
   - linkParse(1001, 'https://...')
   - 轮询checkSubTask(1001)直到SUCCESS
   - result = "解析的文案内容"
   - stepResults[0] = result
   - 填充到rewriteParams.content

5. 执行subTask[1] (seq=1, COPY_REPRODUCE, id=1002)
   - rewrite(1002, stepResults[0], '专业', '友好', '')
   - 轮询checkSubTask(1002)直到SUCCESS
   - result = "重写后的文案"
   - stepResults[1] = result
   - 填充到audioParams.content

6. 执行subTask[2] (seq=2, TIMBRE_SYNTHESIS, id=1003)
   - timbreSynthesis(1003, '/path/audio', stepResults[1], '平静')
   - 轮询checkSubTask(1003)直到SUCCESS
   - result = "/path/to/synthesized/audio.mp3"
   - stepResults[2] = result
   - 填充到videoParams.audioPath

7. 执行subTask[3] (seq=3, VIDEO_SYNTHESIS, id=1004)
   - videoSynthesis(1004, stepResults[2], '/path/video', 'RATIO_9_16')
   - 轮询checkSubTask(1004)直到SUCCESS
   - result = "/path/to/final/video.mp4"
   - stepResults[3] = result
   - 填充到publishParams.videoPath

8. 执行subTask[4] (seq=4, PUBLISH, id=1005)
   - publish(1005, stepResults[3], 'title', 'desc')
   - 轮询checkSubTask(1005)直到SUCCESS
   - result = "发布成功"

9. 完成，autoMode = 'manual'
```

## ⚠️ 关键注意事项

1. **parameter必须包含当前步骤的所有参数**，即使某些值为空
2. **每个步骤使用上一步的result**填充参数
3. **一键合成模式在VIDEO_SYNTHESIS后停止**，不执行PUBLISH
4. **一键发布模式执行所有步骤**包括PUBLISH
5. **轮询间隔2秒**，直到状态为SUCCESS或FAILED
6. **任何步骤失败立即停止**整个流程

## 📊 状态更新逻辑

```typescript
// seq到步骤ID的映射
const SEQ_TO_STEP_ID = {
  0: 'parse_video',
  1: 'rewrite_content',
  2: 'synthesize_audio',
  3: 'synthesize_video',
  4: 'publish_video'
};

// 更新步骤状态
const updateStepStatusBySeq = (seq: number, status: StepStatus) => {
  const stepId = SEQ_TO_STEP_ID[seq];
  updateStepStatus(stepId, { status });
};

// 填充下一步表单
const fillNextStepForm = (seq: number, result: string) => {
  switch (seq) {
    case 0: // 解析结果 → 重写文案
      setRewriteParams(prev => ({ ...prev, content: result }));
      break;
    case 1: // 重写结果 → 音频合成
      setAudioParams(prev => ({ ...prev, content: result }));
      break;
    case 2: // 音频URL → 视频合成
      setVideoParams(prev => ({ ...prev, audioPath: result }));
      break;
    case 3: // 视频URL → 发布
      setPublishParams(prev => ({ ...prev, videoPath: result }));
      break;
  }
};
```

## 🎨 UI状态同步

每个步骤的状态需要实时更新：

```typescript
// 执行前
updateStepStatusBySeq(seq, 'running');

// 执行中（轮询时）
updateStepStatusBySeq(seq, 'running');

// 执行成功
updateStepStatusBySeq(seq, 'success');
setStepResults(prev => ({ ...prev, [seq]: result }));

// 执行失败
updateStepStatusBySeq(seq, 'error');
setError(errorMessage);
```

## 🚀 实现清单

- [ ] 创建task.ts API服务（已完成）
- [ ] 修改workflow.tsx实现新流程
  - [ ] buildSubTasks函数
  - [ ] executeSubTaskBySeq函数
  - [ ] pollSubTaskStatus函数
  - [ ] runAutoWorkflow函数
  - [ ] 修改handleAutoSynthesis
  - [ ] 修改handleAutoPublish
  - [ ] 添加状态管理
- [ ] 测试单步执行
- [ ] 测试一键合成
- [ ] 测试一键发布
- [ ] 错误处理测试

---

**状态**: 准备实施  
**预计时间**: 1-2小时  
**复杂度**: 高
