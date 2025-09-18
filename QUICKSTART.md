# 🚀 Flash Cast 前端快速启动指南

## 📋 预备条件

确保您的系统已安装以下工具：

1. **Node.js** (版本 16+): [下载地址](https://nodejs.org/)
2. **React Native CLI**: 
   ```bash
   npm install -g react-native-cli
   ```

### Android 开发 (可选)
- **Android Studio**: [下载地址](https://developer.android.com/studio)
- **Java JDK 11+**: 通常随 Android Studio 安装

### iOS 开发 (仅 macOS)
- **Xcode**: 从 App Store 安装
- **CocoaPods**: 
   ```bash
   sudo gem install cocoapods
   ```

---

## ⚡ 快速启动 (3 步骤)

### 1️⃣ 进入项目目录
```bash
cd /Users/king/cursor_ai/flash-cast/frontend
```

### 2️⃣ 安装依赖
```bash
npm install
```

### 3️⃣ 启动应用

**🌐 Web 版本 (推荐开发调试):**
```bash
npm run web
```
浏览器会自动打开 http://localhost:3000

**📱 移动端版本 (发布前测试):**
```bash
# 🤖 Android 
npm run android

# 🍎 iOS (仅 macOS)
npm run ios
```

---

## 🔧 常用命令

```bash
# 🌐 Web 开发 (推荐)
npm run web

# 📱 移动端开发
npm start           # 启动 Metro 服务器
npm run android     # Android 版本
npm run ios         # iOS 版本 (仅 macOS)

# 🛠️ 工具命令
npm run clean       # 重新安装依赖
npm run reset-cache # 清理缓存
npm run build:web   # 构建 Web 生产版本
```

---

## 🆘 遇到问题？

### 问题 1: Web 版本启动失败
```bash
npm run clean
npm run web
```

### 问题 2: Metro 服务器无法启动
```bash
npm run reset-cache
```

### 问题 3: Android 构建失败
```bash
npm run clean:android
npm run android
```

### 问题 4: iOS 构建失败 (macOS)
```bash
npm run clean:ios
npm run ios
```

---

## 📱 开发模式

### 🌐 Web 开发模式 (推荐)
- **优势**: 快速预览、热重载、浏览器调试工具
- **使用场景**: 日常开发、UI 调试、功能测试
- **启动**: `npm run web`
- **访问**: http://localhost:3000

### 📱 移动端模式
- **优势**: 真实设备体验、原生功能测试
- **使用场景**: 发布前测试、性能优化
- **Android**: `npm run android`
- **iOS**: `npm run ios` (仅 macOS)

---

## ✅ 启动成功标志

### Web 版本启动成功
- 浏览器自动打开 http://localhost:3000
- 看到 Flash Cast 登录页面
- 控制台显示 "Webpack compiled successfully"

### 移动端启动成功
- Metro 服务器在终端中运行
- 应用在设备/模拟器上打开
- 显示 Flash Cast 登录页面

---

## 🎯 下一步

项目启动后，您可以：
1. 测试登录/注册功能
2. 查看底部导航栏
3. 体验各个页面功能
4. 开始开发新功能

---

**需要帮助？** 查看完整的 [详细启动指南](./README.md) 或联系开发团队。