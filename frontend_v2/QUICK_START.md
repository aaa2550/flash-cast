# 🚀 快速启动指南

## 前置要求

- Node.js 18+
- npm 或 yarn
- 后端服务运行在 http://localhost:8080

## 启动步骤

### 1. 安装依赖（首次运行）

```bash
cd frontend_v2
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务将运行在: http://localhost:3000

### 3. 访问应用

打开浏览器访问: http://localhost:3000

## 使用流程

### 登录
1. 访问 http://localhost:3000/login
2. 输入手机号
3. 点击"获取验证码"
4. 输入6位验证码
5. 勾选用户协议
6. 点击"登录/注册"

### 工作流页面
登录成功后自动跳转到 http://localhost:3000/workflow

#### 手动执行模式
1. 点击"扫码登录"卡片，使用抖音扫码
2. 点击"解析视频文案"卡片，输入抖音链接
3. 点击"执行此步骤"按钮
4. 依次手动执行后续步骤

#### 一键合成模式
1. 完成前面的步骤
2. 点击底部"一键合成"按钮
3. 系统自动执行剩余步骤直到视频合成
4. 手动点击"发布视频"

#### 一键发布模式
1. 完成扫码和解析
2. 点击底部"一键发布"按钮
3. 系统自动完成所有步骤并发布

## 页面路由

- `/` - 首页（重定向到登录或工作流）
- `/login` - 登录页面
- `/workflow` - 工作流主页面（需要登录）
- `/generate` - 旧版生成页面（已废弃）

## 开发命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm run start

# 代码检查
npm run lint
```

## 环境变量

创建 `.env.local` 文件（可选）:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
```

## 常见问题

### Q: 登录后显示404
A: 确保访问的是 `/workflow` 而不是 `/generate`

### Q: API请求失败
A: 检查后端服务是否在 http://localhost:8080 运行

### Q: 扫码功能报错
A: 确认后端抖音扫码接口正常工作

### Q: 超时错误
A: API超时时间已设置为60秒，如仍超时请检查网络和后端响应

## 技术栈

- React 18.2.0
- Next.js 14.2.12
- TypeScript 5.4.5
- Styled Components 6.1.19
- Axios 1.6.8

## 项目结构

```
frontend_v2/
├── src/
│   ├── pages/
│   │   ├── login.tsx          # 登录页
│   │   ├── workflow.tsx       # 工作流主页（新）
│   │   └── generate.tsx       # 旧版页面
│   ├── screens/
│   │   └── LoginScreen.tsx    # 登录组件
│   ├── components/
│   │   ├── DouyinQRScanner.tsx    # 扫码组件
│   │   ├── AuthGuard.tsx          # 认证守卫
│   │   ├── FileUploadBox.tsx      # 文件上传
│   │   └── NeonDropdown.tsx       # 下拉选择
│   ├── services/
│   │   ├── api.ts             # 基础API
│   │   ├── workflow.ts        # 工作流API（新）
│   │   ├── clone.ts           # 克隆服务
│   │   ├── voice.ts           # 音色服务
│   │   └── resource.ts        # 资源服务
│   └── styles/
│       └── theme.ts           # 主题配置
├── public/                    # 静态资源
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 调试技巧

### 1. 查看网络请求
打开浏览器开发者工具 > Network 标签

### 2. 查看控制台日志
打开浏览器开发者工具 > Console 标签

### 3. 查看React状态
安装 React Developer Tools 扩展

### 4. API调试
使用 `console.log` 或设置断点

## 部署

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm run build
npm run start
```

### Docker（可选）
```bash
docker build -t flash-cast-frontend .
docker run -p 3000:3000 flash-cast-frontend
```

## 性能优化

- 已启用生产模式优化
- 使用CSS3硬件加速动画
- 组件懒加载（可继续优化）
- API请求缓存（待实现）

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 获取帮助

- 查看 `WORKFLOW_FEATURE.md` 了解功能详情
- 查看 `REFACTOR_SUMMARY.md` 了解重构细节
- 检查控制台错误信息
- 查看后端日志

## 更新日志

### v2.0.0 (2025-10-02)
- ✨ 全新工作流系统
- ✨ 六步可视化流程
- ✨ 三种执行模式
- ✨ 科技感UI设计
- 🔧 修复扫码超时问题
- 📝 完善文档

### v1.0.0
- 基础功能实现
- 登录系统
- 克隆生成页面

---

**需要帮助？** 查看详细文档或联系开发团队。

**祝您使用愉快！** 🎉
