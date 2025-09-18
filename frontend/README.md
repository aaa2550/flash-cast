# Flash Cast 前端项目启动指南

## 系统要求

### 1. 基础环境
- **Node.js**: 版本 16 或更高
- **npm** 或 **yarn**: 包管理工具
- **React Native CLI**: 全局安装

### 2. 移动端开发环境

#### Android 开发环境
- **Java Development Kit (JDK)**: 版本 11 或更高
- **Android Studio**: 最新版本
- **Android SDK**: API Level 28 或更高
- **Android Virtual Device (AVD)**: 用于模拟器测试

#### iOS 开发环境 (仅 macOS)
- **Xcode**: 最新版本
- **CocoaPods**: iOS 依赖管理工具
- **iOS Simulator**: 内置在 Xcode 中

## 安装步骤

### 1. 环境检查
首先确认你的开发环境是否正确配置：

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查 React Native CLI
npx react-native --version
```

### 2. 进入项目目录
```bash
cd /Users/king/cursor_ai/flash-cast/frontend
```

### 3. 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 4. iOS 特殊配置 (仅 macOS)
```bash
# 进入 ios 目录并安装 CocoaPods 依赖
cd ios
pod install
cd ..
```

## 启动项目

### 方式一：使用 npm scripts

#### 启动 Metro 打包服务器
```bash
npm start
```

#### 运行 Android 版本
```bash
# 确保 Android 模拟器已启动或设备已连接
npm run android
```

#### 运行 iOS 版本 (仅 macOS)
```bash
npm run ios
```

### 方式二：使用 React Native CLI

#### 启动 Metro 服务器
```bash
npx react-native start
```

#### 在新终端窗口中运行应用
```bash
# Android
npx react-native run-android

# iOS (仅 macOS)
npx react-native run-ios
```

## 开发调试

### 1. 启用调试菜单
- **Android**: 摇晃设备或按 `Ctrl + M` (模拟器)
- **iOS**: 摇晃设备或按 `Cmd + D` (模拟器)

### 2. 常用调试选项
- **Reload**: 重新加载应用
- **Debug with Chrome**: 在 Chrome 中调试
- **Toggle Inspector**: 开启元素检查器
- **Show Perf Monitor**: 显示性能监控

### 3. 热重载
项目已配置快速刷新，修改代码后会自动重新加载。

## 常见问题解决

### 1. Metro 服务器启动失败
```bash
# 清理缓存
npx react-native start --reset-cache
```

### 2. Android 构建失败
```bash
# 清理 Android 构建缓存
cd android
./gradlew clean
cd ..
```

### 3. iOS 构建失败 (macOS)
```bash
# 重新安装 Pods
cd ios
pod deintegrate
pod install
cd ..
```

### 4. 依赖冲突
```bash
# 删除 node_modules 重新安装
rm -rf node_modules
npm install
```

## 项目结构说明

```
frontend/
├── src/
│   ├── components/     # 公共组件
│   ├── screens/        # 页面组件
│   ├── navigation/     # 导航配置
│   ├── services/       # API 服务
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript 类型定义
│   ├── constants/      # 常量配置
│   └── App.tsx         # 应用入口
├── package.json        # 项目配置和依赖
├── tsconfig.json       # TypeScript 配置
├── babel.config.js     # Babel 配置
└── metro.config.js     # Metro 打包配置
```

## 开发命令

```bash
# 启动开发服务器
npm start

# 运行 Android 版本
npm run android

# 运行 iOS 版本 (仅 macOS)
npm run ios

# 代码检查
npm run lint

# 运行测试
npm test
```

## 注意事项

1. **首次启动**可能需要较长时间，请耐心等待
2. **确保模拟器或真机**已正确连接
3. **网络连接**需要稳定，用于下载依赖
4. **防火墙设置**不要阻止 Metro 服务器端口 (默认 8081)
5. **后端服务**需要同时启动才能完整测试应用功能

## 下一步

项目启动成功后，您可以：
1. 在模拟器或真机上测试应用功能
2. 修改代码并查看实时更新
3. 连接后端 API 进行完整功能测试
4. 开始开发剩余的业务功能

如遇到问题，请参考 React Native 官方文档或联系开发团队。