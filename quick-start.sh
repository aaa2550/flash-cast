#!/bin/bash

# Flash Cast 一键启动脚本
# 自动化完成所有开发环境设置

echo "🚀 Flash Cast 一键启动器"
echo "========================"

# 设置项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# 创建日志目录
mkdir -p logs

echo "📋 检查项目状态..."

# 检查后端jar包是否存在
if [ ! -f "backend/target/flash-cast-backend-1.0.0.jar" ]; then
    echo "🔨 后端jar包不存在，开始编译..."
    cd backend
    mvn clean package -DskipTests
    cd ..
    if [ ! -f "backend/target/flash-cast-backend-1.0.0.jar" ]; then
        echo "❌ 后端编译失败，请检查"
        exit 1
    fi
    echo "✅ 后端编译完成"
else
    echo "✅ 后端jar包已存在"
fi

# 检查前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 前端依赖不存在，开始安装..."
    cd frontend
    npm install
    cd ..
    echo "✅ 前端依赖安装完成"
else
    echo "✅ 前端依赖已存在"
fi

# 停止现有服务
echo "🛑 停止现有服务..."
pkill -f "flash-cast-backend" 2>/dev/null || true
pkill -f "webpack serve" 2>/dev/null || true
lsof -ti :8080 | xargs kill -9 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
sleep 3

# 启动后端
echo "🔧 启动后端服务..."
cd backend
nohup java -jar target/flash-cast-backend-1.0.0.jar > ../logs/backend.log 2>&1 &
cd ..

# 等待后端启动
echo "⏳ 等待后端启动..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
        echo "✅ 后端服务启动成功 (耗时: ${i}秒)"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo "❌ 后端服务启动超时"
        exit 1
    fi
done

# 启动前端
echo "🌐 启动前端服务..."
cd frontend
nohup npm run web > ../logs/frontend.log 2>&1 &
cd ..

# 等待前端启动
echo "⏳ 等待前端启动..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 前端服务启动成功 (耗时: ${i}秒)"
        break
    fi
    sleep 1
    if [ $i -eq 60 ]; then
        echo "❌ 前端服务启动超时"
        exit 1
    fi
done

# 运行API测试
echo "🧪 运行API测试..."
sleep 2
./scripts/test-api.sh

echo ""
echo "🎉 Flash Cast 项目启动完成！"
echo "================================"
echo "🌐 前端应用: http://localhost:3000"
echo "🔧 后端API: http://localhost:8080/api"
echo "📊 后端监控: http://localhost:8080/api/actuator/health"
echo "📝 查看日志: tail -f logs/backend.log"
echo "🛑 停止服务: ./scripts/stop-all.sh"
echo ""
echo "💡 现在可以在浏览器中访问 http://localhost:3000 开始使用！"