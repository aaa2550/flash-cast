// 简单的测试服务器来解决CORS问题
const express = require('express');
const cors = require('cors');
const app = express();

// 启用CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// 模拟发送验证码接口
app.post('/api/auth/sendCode', (req, res) => {
  const { phone } = req.body;
  console.log('发送验证码到:', phone);
  
  res.json({
    code: 200,
    message: '验证码发送成功',
    data: null,
    timestamp: Date.now()
  });
});

// 模拟登录接口
app.post('/api/auth/login', (req, res) => {
  const { phone, verifyCode } = req.body;
  console.log('登录请求:', { phone, verifyCode });
  
  // 模拟验证码验证（任何6位数字都视为有效）
  if (verifyCode && verifyCode.length === 6) {
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        userDO: {
          id: 1,
          phone: phone,
          nickname: `用户${phone.slice(-4)}`,
          avatar: null,
          createdAt: new Date().toISOString()
        },
        token: `mock_jwt_token_${Date.now()}`,
        tokenType: 'Bearer',
        expiresIn: 604800000
      },
      timestamp: Date.now()
    });
  } else {
    res.status(400).json({
      code: 400,
      message: '验证码错误',
      data: null,
      timestamp: Date.now()
    });
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`测试服务器运行在 http://localhost:${PORT}`);
  console.log('用于解决CORS问题和测试前端功能');
});