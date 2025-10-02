import axios from 'axios';

declare global {
  interface Window { __REDIRECTING_401?: boolean; }
}

// Next.js rewrite: /api/* -> BACKEND_ORIGIN/api/*
// 统一 baseURL 指向 /api 即可；无需直连后端域名。
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// 统一注入 Authorization + 调试日志 + 401 处理
apiClient.interceptors.request.use(c => {
  // 注入 token（localStorage key: authToken）
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      if (c.headers && typeof (c.headers as any).set === 'function') {
        (c.headers as any).set('Authorization', `Bearer ${token}`);
      } else {
        c.headers = { ...(c.headers||{}), Authorization: `Bearer ${token}` } as any;
      }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log('[API][REQ]', c.method?.toUpperCase(), (c.baseURL||'') + (c.url||''));
  }
  return c;
});

apiClient.interceptors.response.use(r => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[API][RES]', r.status, r.config.url);
  }
  return r;
}, e => {
  const status = e.response?.status;
  if (process.env.NODE_ENV !== 'production') {
    console.log('[API][ERR]', status, e.message);
  }
  if (status === 401 && typeof window !== 'undefined') {
    try { localStorage.removeItem('authToken'); localStorage.removeItem('user'); } catch {}
    // 避免重复跳转：同一 tick 内只跳一次
    if (!window.__REDIRECTING_401) {
      window.__REDIRECTING_401 = true;
      window.location.href = '/login';
    }
  }
  return Promise.reject(e);
});

// 最终确定形态：POST /auth/sendCode  body: { phone }
export const sendCode = (phone: string) => apiClient.post('/auth/sendCode', { phone });

// 登录形态：POST /phone/login  params: phone, code (若后端改为 body 可同步调整)
export const loginWithCode = (phone: string, code: string) => apiClient.post('/phone/login', null, { params: { phone, code } });

export interface LoginResponse {
  expiresIn: number;
  token: string;
  tokenType: string;
  userDO: {
    id: number;
    nickname: string;
    phone: string;
    status: number;
    createTime: string;
    updateTime: string;
    deleted: number;
    gender: number;
  };
}

// 抖音扫码相关接口
export interface DouyinUserInfo {
  nickname: string;
  avatar?: string;
  openId?: string;
}

// 获取抖音扫码二维码base64
export const getDouyinQRCode = () => apiClient.get('/douyin/getImageBase64');

// 查询抖音扫码状态
export const getDouyinScanStatus = () => apiClient.get('/douyin/douyinGetDouyinInfo');
