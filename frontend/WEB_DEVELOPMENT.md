# 🌐 Flash Cast Web 开发指南

## 🚀 快速开始 (Web 版本)

### 一键启动 Web 版本
```bash
cd /Users/king/cursor_ai/flash-cast/frontend
npm install
npm run web
```

浏览器会自动打开 `http://localhost:3000`，您就可以在浏览器中开发和调试了！

---

## 🛠️ 开发流程

### 1. 日常开发 (推荐)
```bash
npm run web          # 在浏览器中开发调试
```

### 2. 发布前测试
```bash
npm run android      # 测试 Android 版本
npm run ios          # 测试 iOS 版本 (仅 macOS)
```

### 3. 生产构建
```bash
npm run build:web    # 构建 Web 生产版本
```

---

## 🎯 Web 版本优势

### ✅ 开发效率
- **热重载**: 修改代码即时刷新
- **DevTools**: 使用浏览器开发者工具
- **快速预览**: 无需等待模拟器启动
- **响应式调试**: 轻松测试不同屏幕尺寸

### ✅ 调试便利
- **Console 调试**: `console.log` 直接在浏览器中查看
- **网络请求**: 在 Network 标签查看 API 调用
- **状态检查**: React DevTools 支持
- **样式调试**: 实时修改 CSS

### ✅ 跨平台预览
- **移动端模拟**: 自动适配移动端视口
- **响应式设计**: 支持不同屏幕尺寸
- **手势模拟**: 鼠标点击模拟触摸操作

---

## 📱 移动端模拟

### 浏览器模拟移动设备
1. 打开 Chrome DevTools (F12)
2. 点击设备图标 (Toggle Device Toolbar)
3. 选择移动设备型号 (iPhone, Android 等)
4. 测试不同屏幕尺寸和分辨率

### 手势操作
- **点击**: 鼠标左键
- **滑动**: 鼠标拖拽
- **双击**: 鼠标双击
- **长按**: 长时间按住鼠标

---

## 🔧 Web 平台特殊配置

### 本地存储
```javascript
// 自动适配 Web localStorage
import { storageService } from '@utils';

// 在 Web 端使用 localStorage
// 在移动端使用 AsyncStorage
await storageService.setString('key', 'value');
```

### 文件上传
```javascript
// Web 端使用文件选择器
// 移动端使用相机/相册
import { createWebFileUpload } from '@utils';

const fileUpload = createWebFileUpload();
const file = await fileUpload?.pickImage();
```

### 弹窗提示
```javascript
// 自动适配不同平台的提示方式
import { webAlert } from '@utils';

// Web 端使用 alert()
// 移动端使用 Alert.alert()
webAlert('提示', '这是一个提示消息');
```

---

## 🚨 注意事项

### ⚠️ 平台差异
1. **API 兼容性**: 某些原生 API 在 Web 端不可用
2. **样式差异**: 部分样式在不同平台表现不同
3. **性能差异**: Web 端性能可能与原生端有差异
4. **功能限制**: 部分硬件功能 (相机、传感器) 在 Web 端受限

### ✅ 开发建议
1. **优先 Web 开发**: 快速迭代和调试
2. **定期移动端测试**: 确保功能正常
3. **发布前全面测试**: Android 和 iOS 完整测试
4. **平台适配**: 使用平台检测做不同处理

---

## 📂 相关文件

- `webpack.config.js` - Web 构建配置
- `index.web.js` - Web 入口文件
- `public/index.html` - HTML 模板
- `src/utils/platform.ts` - 平台适配工具

---

## 🆘 常见问题

### Q: Web 版本启动失败？
```bash
# 清理缓存重新安装
npm run clean
npm run web
```

### Q: 样式在 Web 端显示异常？
检查是否使用了移动端特有的样式属性，使用平台适配：
```javascript
import { getPlatformStyle } from '@utils';

const styles = getPlatformStyle(webStyle, mobileStyle);
```

### Q: API 请求失败？
检查跨域配置，确保后端 API 支持 CORS。

---

**开发愉快！** 🎉