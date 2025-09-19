#!/bin/bash

# Flash Cast 项目启动脚本
# 自动启动后端和前端服务

echo "🚀 启动 Flash Cast 项目..."

# 检查并停止已运行的服务
echo "📋 检查现有进程..."
pkill -f "flash-cast-backend" 2>/dev/null || true
pkill -f "webpack serve" 2>/dev/null || true

# 等待进程完全停止
sleep 2

echo "🔧 启动后端服务..."
cd "$(dirname "$0")/../backend"
java -jar target/flash-cast-backend-1.0.0.jar > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "后端进程ID: $BACKEND_PID"

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 10

echo "🌐 启动前端服务..."
cd "$(dirname "$0")/../frontend"
npm run web > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端进程ID: $FRONTEND_PID"

# 等待前端启动
echo "⏳ 等待前端服务启动..."
sleep 15

echo "✅ 服务状态检查..."
if curl -s http://localhost:8080/api/actuator/health > /dev/null; then
    echo "✅ 后端服务已启动: http://localhost:8080"
else
    echo "❌ 后端服务启动失败"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 前端服务已启动: http://localhost:3000"
else
    echo "❌ 前端服务启动失败"
fi

echo "🎉 Flash Cast 项目启动完成！"
echo "📊 后端管理: http://localhost:8080"
echo "🌐 前端应用: http://localhost:3000"
echo ""
echo "停止服务命令: ./scripts/stop-all.sh"