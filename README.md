# Flash Cast - 智能生成主播口播视频AI应用

## 项目概述
Flash Cast 是一个智能生成主播口播视频的AI应用，支持用户通过上传视频、音频定制人物和声音，并生成对应的口播视频。

## 项目架构
- **前端 (frontend/)**: React Native 移动端应用，支持安卓、iOS、微信小程序
- **接口服务端 (backend/)**: Java Spring Boot 后端服务
- **AI服务端 (backend_ai/)**: Python CrewAI 智能服务

## 主要功能
1. **用户认证**: 手机号注册/登录
2. **媒体管理**: 视频、音频上传、编辑、删除
3. **AI生成**: 基于用户素材和文案生成口播视频
4. **内容管理**: 文案输入、话题生成、热门话题选择

## 开发进度

### 2025年9月16日
- ✅ 初始化项目结构
- ✅ 创建项目文档
- ✅ 完成React Native应用基础配置
- ✅ 创建项目目录结构 (components, screens, services, utils, types, constants, navigation)
- ✅ 实现公共组件库
  - Button: 支持多种样式和状态的按钮组件
  - Input: 支持验证码、密码等多种类型的输入框组件
- ✅ 封装API调用服务
  - ApiService: 统一的HTTP请求封装，支持拦截器
  - AuthService: 用户认证相关API
  - MediaService: 媒体文件管理API
  - VideoService: 视频生成相关API
- ✅ 创建工具函数库
  - 表单验证工具
  - 文件大小、时长格式化
  - 时间格式化
  - 存储服务封装
- ✅ 实现导航和路由配置
  - 底部Tab导航
  - Stack导航
  - 路由参数类型定义
- ✅ 完成用户认证功能
  - 登录页面 (手机号 + 验证码)
  - 注册页面 (手机号 + 验证码 + 昵称)
  - 验证码倒计时功能

### 下一步计划
- 实现首页和主要功能页面
- 媒体文件上传和管理功能
- 视频生成功能
- 用户个人中心

## 技术栈
- **前端**: React Native + TypeScript
- **后端**: Java + Spring Boot + MySQL
- **AI服务**: Python + CrewAI
- **移动端**: 支持Android、iOS、微信小程序

## 开发规范
- 前端遵循扁平化设计，确保跨平台兼容
- 所有公共组件统一封装管理
- API调用统一封装，不在页面直接调用