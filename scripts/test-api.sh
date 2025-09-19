#!/bin/bash

# Flash Cast API 测试脚本

BASE_URL="http://localhost:8080/api"
FRONTEND_URL="http://localhost:3000"

echo "🧪 Flash Cast API 测试"
echo "===================="

# 测试后端健康检查
echo "1. 测试后端服务..."
if curl -s "$BASE_URL/actuator/health" > /dev/null; then
    echo "  ✅ 后端服务正常"
else
    echo "  ❌ 后端服务异常"
    exit 1
fi

# 测试前端服务
echo "2. 测试前端服务..."
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo "  ✅ 前端服务正常"
else
    echo "  ❌ 前端服务异常"
fi

# 测试CORS配置
echo "3. 测试CORS配置..."
CORS_RESULT=$(curl -s -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS "$BASE_URL/auth/sendCode" \
    -w "%{http_code}")
    
if [[ "$CORS_RESULT" == *"200"* ]]; then
    echo "  ✅ CORS配置正常"
else
    echo "  ❌ CORS配置异常"
fi

# 测试发送验证码API
echo "4. 测试发送验证码API..."
SEND_CODE_RESULT=$(curl -s -X POST "$BASE_URL/auth/sendCode" \
    -H "Content-Type: application/json" \
    -d '{"phone": "13800138000"}' | grep -o '"code":[0-9]*' | cut -d':' -f2)

if [ "$SEND_CODE_RESULT" = "200" ]; then
    echo "  ✅ 发送验证码API正常"
else
    echo "  ❌ 发送验证码API异常 (返回码: $SEND_CODE_RESULT)"
fi

# 测试登录API格式
echo "5. 测试登录API格式..."
LOGIN_RESULT=$(curl -s -X POST "$BASE_URL/phone/login?phone=13800138000&code=123456" \
    -H "Content-Type: application/json" \
    -d '{}' | grep -o '"code":[0-9]*' | cut -d':' -f2)

# 401是预期的（验证码错误），200是成功
if [ "$LOGIN_RESULT" = "401" ] || [ "$LOGIN_RESULT" = "200" ]; then
    echo "  ✅ 登录API格式正确"
else
    echo "  ❌ 登录API格式异常 (返回码: $LOGIN_RESULT)"
fi

echo ""
echo "🎯 测试完成！"
echo "💡 提示: 如果所有测试都通过，说明前后端集成正常"
echo "🌐 前端地址: $FRONTEND_URL"
echo "🔧 后端地址: $BASE_URL"