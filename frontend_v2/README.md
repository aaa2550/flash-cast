# frontend_v2 (Next.js 迁移版)

本目录已从原来的 Create React App 改造成 **Next.js 14 + TypeScript + styled-components**。

## 核心变化

1. 移除 CRA 入口 (`src/index.tsx`, `public/index.html`) 与代理 `setupProxy.js`。
2. 新增 `pages` 目录：
   - `pages/_app.tsx` 注入主题与全局样式。
   - `pages/index.tsx` 重定向到 `/login`。
   - `pages/login.tsx` 登录页面（沿用原逻辑）。
3. API 调用通过 Next.js `rewrites` 将浏览器发起的 `/api/*` 请求转发到后端：
   - 配置文件：`next.config.js`
   - 环境变量：`BACKEND_ORIGIN` 控制后端根，如默认 `http://localhost:8080`
4. 统一 axios 基础地址为 `/api`（或由 `NEXT_PUBLIC_API_BASE` 覆盖）。
5. 登录失败与验证码发送失败优先显示后端返回 `message|msg|error|detail|description` 字段。

## 启动

```bash
cp .env.local.example .env.local   # 可修改 BACKEND_ORIGIN
npm install
npm run dev
# 打开 http://localhost:3000/login
```

## 环境变量

| 变量 | 说明 | 默认 |
| ---- | ---- | ---- |
| BACKEND_ORIGIN | 后端服务地址 (rewrites 目标) | http://localhost:8080 |
| NEXT_PUBLIC_API_BASE | axios 基础路径（前端可见） | /api |

## 代理机制说明

`next.config.js` 中：
```js
async rewrites() {
  return [
    { source: '/api/:path*', destination: `${BACKEND_ORIGIN}/api/:path*` }
  ];
}
```
浏览器访问 `http://localhost:3000/api/auth/sendCode` 时，Next 调用后端：
`http://localhost:8080/api/auth/sendCode`。

无需再使用 `setupProxy.js` 或本地 nginx。

## 目录结构（简）

```
frontend_v2/
  next.config.js
  next-env.d.ts
  src/
    pages/
      _app.tsx
      index.tsx
      login.tsx
  generate.tsx      # 生成/克隆页面
    screens/
      LoginScreen.tsx   # 具体 UI & 逻辑
    services/
      api.ts            # axios 客户端与接口方法
    styles/
      theme.ts
      theme-ref.ts
```

## API 约定

| 功能 | 方法 | 路径 | 备注 |
| ---- | ---- | ---- | ---- |
| 发送验证码 | POST | /api/auth/sendCode | body: { phone } |
| 登录 | POST | /api/phone/login | params: phone, code |
| 启动克隆 | POST | /api/clone/start | body: { douyinUrl, modelVideoUrl?, voiceId?, customVoiceText? } |
| 查询克隆状态 | GET | /api/clone/status/:id | 返回步骤进度、下载地址、抖音分享链接 |

如果后端调整为统一 body，修改 `loginWithCode` 即可：
```ts
export const loginWithCode = (phone: string, code: string) =>
  apiClient.post('/phone/login', { phone, code });
```

## 错误提示策略

捕获时按优先级提取：`message > msg > error > detail > description > err.message`。

## 生成页说明 (generate)

功能：输入抖音视频链接 + 可选模特视频 + 音色（预设/自定义），一键发起任务；展示五大步骤：
1. 解析视频(parse)
2. 智能生成文案(copywriting)
3. 合成音频(tts)
4. 合成视频(video)
5. 发布抖音(publish)

前端周期性轮询 `/api/clone/status/:id`，根据 `steps[]` 渲染状态与进度；成功后显示下载地址与抖音链接；失败显示 `errorMessage`。

示例状态结构：
```jsonc
{
  "id": "task123",
  "overallStatus": "running|success|failed",
  "steps": [
    { "key": "parse", "name": "解析视频", "status": "success", "progress": 100 },
    { "key": "copywriting", "name": "智能生成文案", "status": "running", "progress": 55 },
    { "key": "tts", "name": "合成音频", "status": "pending", "progress": 0 },
    { "key": "video", "name": "合成视频", "status": "pending", "progress": 0 },
    { "key": "publish", "name": "发布抖音", "status": "pending", "progress": 0 }
  ],
  "downloadUrl": "https://.../result.mp4",
  "douyinShareUrl": "https://v.douyin.com/...",
  "errorMessage": null
}
```

如需后端支持分步推送而非轮询，可将机制改为 SSE / WebSocket。

### HTTP Only 策略与轮询设计

当前明确不引入 WebSocket/SSE，原因：
1. 任务状态更新频率较低（秒级），长连接收益有限。
2. 降低连接管理与心跳/重连的复杂度，减少后端状态维护。
3. 更易部署（无额外 LB/WebSocket 支持要求）。

轮询策略（计划实现）：
| 阶段 | 间隔 | 说明 |
| ---- | ---- | ---- |
| 启动后 0-20s | 2000ms | 快速反馈初期阶段进度 |
| 20s-60s | 3000ms | 降低请求压力 |
| >60s | 5000ms | 长任务进入稳定期 |
| 错误（网络/超时） | 上次间隔 * 1.5 （上限 8000ms） | 指数退避，防止风暴 |
| 成功/失败 | 停止 | 清理定时器 |

附加：
* 提供“手动刷新”按钮立即触发一次拉取。
* 支持“取消任务”调用 `/api/clone/cancel/:id`（需后端实现）。
* 失败后显示“重新开始”按钮复用上次表单数据。


## 后续可选增强

- 中间件 `middleware.ts` 实现基于 token 的服务端重定向。
- 将登录成功后跳转至业务首页（当前用 alert）。
- SSG/ISR 支持和更多页面拆分。
- 添加 ESLint + Prettier 更严格规则。
- 统一错误 Toast（如使用 antd / sonner）。

## 已废弃

- 原 CRA `react-scripts` 及 `setupProxy.js`。
- 单独的 `frontend_next` 试验目录（已删除，逻辑合并进本目录）。

---
需要我帮你删除旧的 `frontend_next` 目录或增加更多鉴权逻辑，直接告诉我即可。
