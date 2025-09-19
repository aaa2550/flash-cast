#!/bin/bash

# Flash Cast 项目重启脚本

echo "🔄 重启 Flash Cast 项目..."

# 执行停止脚本
./scripts/stop-all.sh

# 等待停止完成
sleep 3

# 执行启动脚本
./scripts/start-all.sh