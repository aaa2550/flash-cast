# 抖音扫码集成测试

## 测试目的

验证前端能够正确接收和显示后端返回的base64二维码图片。

## 数据流程

```
前端请求
    ↓
GET /api/douyin/getImageBase64
    ↓
Java后端 (8080) → Python AI Agent (8000)
    ↓
返回数据：
{
  "code": 0,
  "message": "操作成功",
  "data": "data:image/svg+xml;base64,PHN2ZyB4bWxu...",
  "timestamp": 1759387745991
}
    ↓
前端接收并显示
```

## 前端代码验证

### 1. API调用 ✅
```typescript
// src/services/api.ts
export const getDouyinQRCode = () => apiClient.get('/douyin/getImageBase64');
```

### 2. 数据接收 ✅
```typescript
// src/components/DouyinQRScanner.tsx
const response = await getDouyinQRCode();
if (response.data.code === 0 && response.data.data) {
  setQrCodeBase64(response.data.data);  // 直接使用完整的data URI
}
```

### 3. 图片显示 ✅
```typescript
<QRImage 
  src={qrCodeBase64}  // 直接使用data URI，无需添加前缀
  alt="抖音扫码登录"
  $isExpired={isExpired}
/>
```

## 支持的图片格式

前端支持任何标准的data URI格式：

- ✅ `data:image/png;base64,iVBORw0KGgo...`
- ✅ `data:image/svg+xml;base64,PHN2ZyB4bWxu...`
- ✅ `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
- ✅ `data:image/gif;base64,R0lGODlhAQAB...`

## 测试步骤

### 1. 启动服务

#### 启动Python AI Agent (端口8000)
```bash
cd ai_agent
source .venv/bin/activate
python src/main.py
```

#### 启动Java后端 (端口8080)
```bash
cd backend
mvn spring-boot:run
```

#### 启动前端 (端口3000)
```bash
cd frontend_v2
npm run dev
```

### 2. 访问页面

打开浏览器访问：http://localhost:3000/workflow

### 3. 验证步骤

1. **查看扫码登录步骤**
   - 页面加载后应该自动显示扫码登录卡片

2. **检查二维码加载**
   - 应该看到"抖音账号授权"标题
   - 看到一个带边框的二维码容器
   - 二维码图片应该在2-3秒内加载出来
   - 下方显示倒计时："二维码将在 XX 秒后过期"

3. **检查网络请求**
   打开浏览器开发者工具 > Network标签
   - 应该看到 `GET /api/douyin/getImageBase64` 请求
   - 状态码应该是 200
   - 响应格式应该是：
     ```json
     {
       "code": 0,
       "message": "操作成功", 
       "data": "data:image/svg+xml;base64,...",
       "timestamp": 1759387745991
     }
     ```

4. **检查图片显示**
   - 在Elements标签中检查 `<img>` 元素
   - `src` 属性应该是完整的 data URI
   - 图片应该可见（不是broken image图标）

### 4. 测试二维码过期

等待30秒后：
- 二维码应该变灰
- 显示"二维码已过期"遮罩
- 出现"刷新二维码"按钮
- 点击刷新应该重新获取新的二维码

### 5. 测试错误处理

模拟后端错误（停止Python服务）：
- 应该显示友好的错误提示
- 不应该显示broken image
- 应该提供刷新按钮

## 常见问题排查

### 问题1: 二维码不显示

**症状**: 看到空白或broken image

**检查**:
1. 打开Console查看是否有错误
2. 检查Network标签，API是否返回200
3. 检查响应数据中的`code`是否为0
4. 检查`data`字段是否包含完整的data URI

**可能原因**:
- Python服务未启动或报错
- Java后端未正确代理到Python服务
- 网络请求被CORS拦截

### 问题2: 二维码显示但很小

**症状**: 二维码太小看不清

**解决**: 检查CSS样式
```typescript
const QRContainer = styled.div`
  width: 220px;  // 可以调整大小
  height: 220px;
`;
```

### 问题3: 二维码加载很慢

**症状**: 等待很久才显示

**检查**:
- Python服务是否正常（Playwright可能需要时间启动浏览器）
- 首次启动可能较慢，后续应该快很多
- 检查Python服务日志是否有超时错误

### 问题4: API返回500错误

**参考**: `ai_agent/BUGFIX_SUMMARY.md`

**快速修复**:
1. 检查Python服务日志
2. 确认Pydantic模型字段有默认值
3. 确认Playwright能找到二维码元素
4. 确认错误处理返回了响应体

## 调试命令

### 直接测试Python接口
```bash
curl 'http://localhost:8000/api/douyin/get_image_base64?user_id=1'
```

### 直接测试Java接口
```bash
curl 'http://localhost:8080/api/douyin/getImageBase64' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 查看前端请求
```bash
# 在浏览器Console中运行
fetch('/api/douyin/getImageBase64', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  }
}).then(r => r.json()).then(console.log)
```

## 性能指标

### 正常情况下的时间
- API响应时间: 2-5秒（首次），< 1秒（缓存）
- 前端渲染: < 100ms
- 总体用户感知: 2-6秒

### 超时设置
- 前端API超时: 60秒
- Python Playwright超时: 5秒（每个选择器）
- 二维码有效期: 30秒

## 成功标准

- ✅ 页面加载后3-5秒内显示二维码
- ✅ 二维码清晰可见
- ✅ 倒计时正常显示和递减
- ✅ 30秒后自动过期
- ✅ 刷新按钮正常工作
- ✅ 错误提示友好明确
- ✅ 无Console错误

## 已知限制

1. **首次加载慢**: Playwright首次启动浏览器需要时间
2. **二维码缓存**: 30秒内重复请求返回缓存的二维码
3. **并发限制**: 多个用户同时请求可能导致Playwright资源竞争

## 后续优化

- [ ] 添加二维码加载骨架屏
- [ ] 实现二维码预加载
- [ ] 优化Playwright启动速度
- [ ] 添加二维码质量检测
- [ ] 实现二维码重试机制

---

**测试日期**: 2025-10-02  
**测试环境**: 开发环境  
**测试状态**: 准备就绪

请按照以上步骤进行测试，如有问题请查看对应的故障排查部分。
