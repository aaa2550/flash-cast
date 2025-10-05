const { createProxyMiddleware } = require('http-proxy-middleware');

// 强提示：如果你看不到这一行，说明 CRA 没有加载 setupProxy.js
console.log('[setupProxy] loaded (minimal)');

module.exports = function (app) {
  // 纯测试：验证是否进入 express 链路（不会走后端）
  app.get('/api/__ping__', (req, res) => {
    console.log('[setupProxy] /api/__ping__ HIT');
    res.json({ ok: true, ts: Date.now() });
  });

  // 单一代理：所有 /api 前缀直接转发 8080
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    logLevel: 'debug',
    timeout: 0,  // 不设置超时限制
    proxyTimeout: 0,  // 代理超时：0表示无限制
    onProxyReq(proxyReq, req) {
      console.log('[proxy][REQ]', req.method, req.originalUrl);
    },
    onProxyRes(proxyRes, req) {
      console.log('[proxy][RES]', req.method, req.originalUrl, 'status=', proxyRes.statusCode);
    },
    onError(err, req, res) {
      console.error('[proxy][ERROR]', err.message);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ proxyError: err.message }));
    }
  }));
};
