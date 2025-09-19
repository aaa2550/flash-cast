# Flash Cast 自动化脚本使用指南

## 🚀 一键启动（推荐）

```bash
# 进入项目目录
cd /Users/king/cursor_ai/flash-cast

# 一键启动所有服务（自动编译、安装依赖、启动服务、运行测试）
./quick-start.sh
```

## 🔧 脚本说明

### 主要脚本

| 脚本 | 功能 | 使用场景 |
|------|------|----------|
| `quick-start.sh` | 一键启动全部服务 | **首次使用或日常开发启动** |
| `scripts/dev-tools.sh` | 交互式开发工具 | 需要选择性操作时 |
| `scripts/test-api.sh` | API接口测试 | 验证服务是否正常 |

### 服务管理脚本

| 脚本 | 功能 |
|------|------|
| `scripts/start-all.sh` | 启动后端和前端服务 |
| `scripts/stop-all.sh` | 停止所有服务 |
| `scripts/restart-all.sh` | 重启所有服务 |

## 📝 使用流程

### 1. 首次使用
```bash
cd /Users/king/cursor_ai/flash-cast
./quick-start.sh
```

### 2. 日常开发
```bash
# 启动服务
./quick-start.sh

# 或者使用交互式工具
./scripts/dev-tools.sh
```

### 3. 停止服务
```bash
./scripts/stop-all.sh
```

### 4. 测试API
```bash
./scripts/test-api.sh
```

## 🌐 服务地址

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8080/api
- **健康检查**: http://localhost:8080/api/actuator/health

## 📊 查看日志

```bash
# 后端日志
tail -f logs/backend.log

# 前端日志
tail -f logs/frontend.log

# 查看最新10行日志
./scripts/dev-tools.sh  # 选择选项5
```

## 🔥 常见问题

### Q: 端口被占用怎么办？
A: 脚本会自动清理端口占用，如果仍有问题，手动执行：
```bash
./scripts/stop-all.sh
lsof -ti :8080 | xargs kill -9
lsof -ti :3000 | xargs kill -9
```

### Q: 后端编译失败怎么办？
A: 检查Java版本和Maven配置：
```bash
java -version  # 需要Java 17
mvn -version   # 需要Maven 3.6+
```

### Q: 前端启动失败怎么办？
A: 重新安装依赖：
```bash
cd frontend
rm -rf node_modules
npm install
```

## 🎯 自动化特性

这些脚本提供了以下自动化功能：

1. ✅ **自动编译后端**（如果jar包不存在）
2. ✅ **自动安装前端依赖**（如果node_modules不存在）
3. ✅ **自动停止现有服务**（避免端口冲突）
4. ✅ **自动等待服务启动**（确保服务完全就绪）
5. ✅ **自动运行API测试**（验证集成是否正常）
6. ✅ **自动创建日志目录**（便于调试）

## 💡 开发建议

1. **首次使用**：运行 `./quick-start.sh`
2. **日常开发**：使用 `./scripts/dev-tools.sh` 进行交互式管理
3. **调试问题**：查看 `logs/` 目录下的日志文件
4. **停止服务**：使用 `./scripts/stop-all.sh` 而不是 Ctrl+C

现在你可以通过运行这些脚本来自动化管理整个项目，无需手动执行多个命令！