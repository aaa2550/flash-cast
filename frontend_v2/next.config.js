/** @type {import('next').NextConfig} */
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:8080';

module.exports = {
  reactStrictMode: true,
  compiler: { styledComponents: true },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_ORIGIN}/api/:path*`
      }
    ];
  }
};
