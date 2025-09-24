/**
 * Next.js 配置
 * /api/** 全部代理到后端 API (需要鉴权)
 * /resources/** 直接映射到本地 /Users/king/resources 目录的静态文件
 */
/** @type {import('next').NextConfig} */
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:8080';

module.exports = {
  reactStrictMode: true,
  compiler: { styledComponents: true },
  async rewrites() {
    return [
      // /resources/** 路径映射到本地 API 路由处理
      {
        source: '/resources/:path*',
        destination: '/api/resources/:path*'
      },
      // /api/resources/** 路径不代理，让它命中本地 API 路由
      // 其他所有 /api/** 路径代理到后端服务器
      {
        source: '/api/resource/:path*',
        destination: `${BACKEND_ORIGIN}/api/resource/:path*`
      },
      {
        source: '/api/:path*',
        destination: `${BACKEND_ORIGIN}/api/:path*`
      }
    ];
  }
};
