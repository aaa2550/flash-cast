#!/bin/bash

# Flash Cast 前端项目快速启动脚本

echo "🚀 Flash Cast 前端项目启动中..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 frontend 目录下运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖中..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

# 检查是否为 macOS (iOS 开发)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 检测到 macOS，配置 iOS 依赖..."
    if [ -d "ios" ]; then
        cd ios
        if command -v pod &> /dev/null; then
            pod install
        else
            echo "⚠️  CocoaPods 未安装，跳过 iOS 配置"
        fi
        cd ..
    fi
fi

echo "✅ 依赖安装完成！"
echo ""
echo "🎯 启动选项："
echo "1. 启动 Web 版本 (推荐开发调试): npm run web"
echo "2. 启动 Metro 服务器: npm start"
echo "3. 运行 Android 版本: npm run android"
echo "4. 运行 iOS 版本: npm run ios (仅 macOS)"
echo ""
echo "💡 建议："
echo "- 开发调试时使用: npm run web (在浏览器中打开)"
echo "- 发布前测试时使用: npm run android 或 npm run ios"
echo ""
echo "📱 Web版本会在浏览器中自动打开 http://localhost:3000"