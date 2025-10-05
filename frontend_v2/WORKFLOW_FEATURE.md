# 智能视频创作工作流系统

## 概述

全新的工作流系统，以流程图形式展示从抖音扫码到视频发布的完整创作流程，每一步都可以独立执行或自动流转。

## 功能特性

### 🎯 六大核心步骤

1. **扫码登录** - 抖音账号授权
2. **解析视频文案** - 从抖音链接提取文案内容
3. **重写文案** - AI智能重写，支持自定义风格和语气
4. **合成音频** - 使用参考音色生成语音
5. **合成视频** - 音频与视频素材合成
6. **发布视频** - 一键发布到抖音平台

### ⚡ 三种执行模式

#### 1. 手动执行模式
- 用户可以单独执行任意步骤
- 完全手动控制流程
- 适合需要精细调整的场景

#### 2. 一键合成模式
- 从当前步骤自动执行到"合成视频"
- 发布视频需要手动点击
- 适合快速生成视频内容

#### 3. 一键发布模式
- 从当前步骤自动执行所有后续步骤
- 包括自动发布视频
- 适合完全自动化场景

### 🎨 科技感UI设计

#### 视觉风格
- **深色主题**: 深空蓝黑背景 (#0a0a1a)
- **霓虹色彩**: 青色主色调 (#00f6ff) + 粉色辅助色 (#ff00e5)
- **网格背景**: 科技感网格纹理
- **发光效果**: 边框和文字发光动效

#### 动画效果
- **流动边框**: 执行中的步骤显示流动的边框动画
- **脉冲发光**: 当前激活步骤的脉冲发光效果
- **悬停提升**: 卡片悬停时的3D提升效果
- **状态过渡**: 所有状态变化的平滑过渡

#### 步骤卡片
- **状态指示**: 不同颜色标识不同状态
  - 待执行: 灰色边框
  - 执行中: 青色流动边框
  - 已完成: 绿色边框 + ✓ 标记
  - 执行失败: 红色边框
- **连接线**: 步骤间的箭头连接线
- **可折叠**: 点击卡片展开详细内容

### 📊 状态管理

#### 步骤状态
```typescript
type StepStatus = 
  | 'pending'   // 待执行
  | 'running'   // 执行中
  | 'success'   // 已完成
  | 'error'     // 执行失败
  | 'skipped';  // 已跳过
```

#### 自动流转逻辑
```typescript
// 一键合成流程
扫码登录 → 解析文案 → 重写文案 → 合成音频 → 合成视频 (停止)

// 一键发布流程
扫码登录 → 解析文案 → 重写文案 → 合成音频 → 合成视频 → 发布视频
```

## 技术实现

### 架构设计

```
workflow.tsx (主页面)
├── WorkflowStepInfo (步骤信息管理)
├── StepCard (步骤卡片组件)
│   ├── DouyinQRScanner (扫码组件)
│   ├── ParseVideoForm (解析表单)
│   ├── RewriteContentForm (重写表单)
│   ├── SynthesizeAudioForm (音频表单)
│   ├── SynthesizeVideoForm (视频表单)
│   └── PublishVideoForm (发布表单)
└── ActionBar (全局操作栏)
```

### API服务层

**workflow.ts** - 统一的工作流API服务
```typescript
// 解析视频文案
parseVideoContent(link: string)

// 重写文案
rewriteContent(params: RewriteParams)

// 合成音频
synthesizeAudio(params: SynthesizeAudioParams)

// 合成视频
synthesizeVideo(params: SynthesizeVideoParams)

// 发布视频
publishVideo(params: PublishVideoParams)
```

### 后端接口映射

| 前端功能 | 后端接口 | 方法 |
|---------|---------|------|
| 解析视频文案 | `/task/linkParse` | POST |
| 重写文案 | `/task/rewrite` | POST |
| 合成音频 | `/task/timbreSynthesis` | POST |
| 合成视频 | `/task/videoSynthesis` | POST |
| 发布视频 | `/task/publish` | POST |

### 状态管理

```typescript
// 步骤状态数组
const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepInfo[]>([...]);

// 当前激活步骤
const [activeStep, setActiveStep] = useState<WorkflowStep>('douyin_scan');

// 自动执行模式
const [autoMode, setAutoMode] = useState<'manual' | 'auto-synthesis' | 'auto-publish'>('manual');
```

### 自动流转实现

```typescript
const autoExecuteNext = () => {
  const currentIndex = getCurrentStepIndex();
  if (currentIndex < workflowSteps.length - 1) {
    const nextStep = workflowSteps[currentIndex + 1];
    
    // 一键合成模式：到发布步骤时停止
    if (autoMode === 'auto-synthesis' && nextStep.id === 'publish_video') {
      setAutoMode('manual');
      return;
    }
    
    // 延迟执行下一步
    setTimeout(() => {
      setActiveStep(nextStep.id);
      executeStep(nextStep.id);
    }, 1000);
  }
};
```

## 用户体验流程

### 典型使用场景

#### 场景1: 手动精细控制
```
1. 用户点击"扫码登录"卡片，完成抖音授权
2. 用户点击"解析视频文案"卡片，输入抖音链接
3. 用户点击"执行此步骤"，获得解析结果
4. 用户在"重写文案"中调整风格和语气
5. 依次手动执行后续步骤
```

#### 场景2: 一键合成
```
1. 用户完成扫码登录
2. 用户输入抖音链接，点击"解析视频文案"
3. 用户点击底部"一键合成"按钮
4. 系统自动执行：重写文案 → 合成音频 → 合成视频
5. 停在"发布视频"步骤，等待用户确认
```

#### 场景3: 一键发布
```
1. 用户完成扫码登录
2. 用户输入抖音链接
3. 用户直接点击"一键发布"
4. 系统自动完成所有步骤并发布视频
```

## 响应式设计

### 桌面端 (>1200px)
- 所有步骤卡片横向排列
- 带有横向滚动条
- 卡片最小宽度 280px

### 移动端 (<1200px)
- 待优化：垂直堆叠布局
- 步骤间的连接线改为垂直方向

## 错误处理

### 步骤执行失败
- 显示红色边框
- 显示错误信息
- 提供"重置"按钮
- 自动模式停止

### 网络异常
- 超时设置: 60秒
- 自动重试机制（待实现）
- 友好的错误提示

## 性能优化

### 状态管理
- 使用React Hooks管理本地状态
- 避免不必要的重新渲染
- 步骤结果缓存

### 动画性能
- 使用CSS3动画和transform
- GPU硬件加速
- 避免重排和重绘

### 异步操作
- 非阻塞UI
- 加载状态指示
- 可取消的请求（待实现）

## 待优化功能

### 即将实现
- [ ] 步骤执行历史记录
- [ ] 批量任务处理
- [ ] 自定义工作流模板
- [ ] 步骤执行时间统计
- [ ] 失败重试机制
- [ ] 结果预览功能
- [ ] 导出工作流配置

### 用户反馈收集
- [ ] 步骤耗时监控
- [ ] 用户行为分析
- [ ] 错误日志上报
- [ ] 性能指标监控

## 开发指南

### 本地开发
```bash
cd frontend_v2
npm run dev
# 访问 http://localhost:3000/workflow
```

### 添加新步骤
1. 在 `workflow.ts` 中定义步骤类型
2. 添加对应的API服务函数
3. 在 `WORKFLOW_STEPS` 中注册新步骤
4. 在 `renderStepContent` 中实现UI
5. 在 `executeStep` 中实现执行逻辑

### 调试技巧
- 使用浏览器开发者工具查看网络请求
- 查看Console日志了解状态变化
- 使用React DevTools检查组件状态

## 部署说明

### 生产环境配置
- 设置正确的API_BASE环境变量
- 启用生产模式优化
- 配置CDN加速静态资源

### 监控和维护
- 配置错误追踪服务
- 设置性能监控
- 定期检查API健康状态

## 联系方式

如有问题或建议，请联系开发团队。

---

**版本**: v2.0.0  
**最后更新**: 2025-10-02  
**维护者**: Flash Cast Team
