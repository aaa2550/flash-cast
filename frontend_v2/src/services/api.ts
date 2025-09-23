import axios from 'axios';

// Next.js rewrite: /api/* -> BACKEND_ORIGIN/api/*
// 统一 baseURL 指向 /api 即可；无需直连后端域名。
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

if (process.env.NODE_ENV !== 'production') {
  apiClient.interceptors.request.use(c => { console.log('[API][REQ]', c.method?.toUpperCase(), (c.baseURL||'') + (c.url||'')); return c; });
  apiClient.interceptors.response.use(r => { console.log('[API][RES]', r.status, r.config.url); return r; }, e => { console.log('[API][ERR]', e.response?.status, e.message); return Promise.reject(e); });
}

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
