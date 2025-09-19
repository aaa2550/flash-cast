#!/bin/bash

# Flash Cast 项目开发工具脚本

echo "🔧 Flash Cast 开发工具"
echo "===================="
echo "1. 启动所有服务"
echo "2. 停止所有服务" 
echo "3. 重启所有服务"
echo "4. 查看服务状态"
echo "5. 查看日志"
echo "6. 清理项目"
echo "7. 编译后端"
echo "8. 退出"
echo ""

while true; do
    read -p "请选择操作 (1-8): " choice
    
    case $choice in
        1)
            echo "🚀 启动所有服务..."
            ./scripts/start-all.sh
            ;;
        2)
            echo "🛑 停止所有服务..."
            ./scripts/stop-all.sh
            ;;
        3)
            echo "🔄 重启所有服务..."
            ./scripts/restart-all.sh
            ;;
        4)
            echo "📊 服务状态:"
            echo "后端服务 (8080):"
            if curl -s http://localhost:8080/api/actuator/health > /dev/null; then
                echo "  ✅ 运行中"
            else
                echo "  ❌ 未运行"
            fi
            echo "前端服务 (3000):"
            if curl -s http://localhost:3000 > /dev/null; then
                echo "  ✅ 运行中"
            else
                echo "  ❌ 未运行"
            fi
            ;;
        5)
            echo "📝 最新日志:"
            echo "--- 后端日志 ---"
            tail -n 10 logs/backend.log 2>/dev/null || echo "无后端日志"
            echo "--- 前端日志 ---"
            tail -n 10 logs/frontend.log 2>/dev/null || echo "无前端日志"
            ;;
        6)
            echo "🧹 清理项目..."
            ./scripts/stop-all.sh
            rm -rf logs/*.log
            rm -rf backend/target
            rm -rf frontend/node_modules/.cache
            echo "✅ 清理完成"
            ;;
        7)
            echo "🔨 编译后端..."
            cd backend
            mvn clean package -DskipTests
            cd ..
            echo "✅ 编译完成"
            ;;
        8)
            echo "👋 再见！"
            exit 0
            ;;
        *)
            echo "❌ 无效选择，请输入 1-8"
            ;;
    esac
    echo ""
done