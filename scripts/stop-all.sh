#!/bin/bash

# Flash Cast 项目停止脚本

echo "🛑 停止 Flash Cast 项目..."

echo "📋 停止后端服务..."
pkill -f "flash-cast-backend" 2>/dev/null || true

echo "📋 停止前端服务..."
pkill -f "webpack serve" 2>/dev/null || true

# 清理端口占用
echo "🧹 清理端口占用..."
lsof -ti :8080 | xargs kill -9 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

echo "✅ 所有服务已停止"