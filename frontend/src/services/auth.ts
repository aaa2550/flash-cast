import { apiService } from './api';
import { User, LoginRequest, RegisterRequest, SendCodeRequest, LoginResponse, ApiResponse } from '@types';

class AuthService {
  // 发送验证码
  async sendVerifyCode(data: SendCodeRequest): Promise<ApiResponse<null>> {
    return apiService.post('/auth/send-code', data);
  }

  // 用户登录（支持自动注册）
  async loginOrRegister(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post('/auth/login-or-register', data);
  }

  // 用户登录
  async login(data: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiService.post('/auth/login', data);
  }

  // 用户注册
  async register(data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiService.post('/auth/register', data);
  }

  // 获取用户信息
  async getUserInfo(): Promise<ApiResponse<User>> {
    return apiService.get('/auth/profile');
  }

  // 更新用户信息
  async updateUserInfo(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put('/auth/profile', data);
  }

  // 退出登录
  async logout(): Promise<ApiResponse<null>> {
    return apiService.post('/auth/logout');
  }

  // 刷新token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiService.post('/auth/refresh');
  }
}

export const authService = new AuthService();