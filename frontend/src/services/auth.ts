import { apiService } from './api';
import { User, LoginRequest, RegisterRequest, SendCodeRequest, LoginResponse, ApiResponse } from '@types';

class AuthService {
  // 发送验证码
  async sendVerifyCode(data: SendCodeRequest): Promise<ApiResponse<null>> {
    return apiService.post('/auth/sendCode', data);
  }

  // 用户登录（通过Spring Security处理）
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // 新的登录接口：使用URL查询参数
    const params = new URLSearchParams({
      phone: data.phone,
      code: data.verifyCode  // 前端verifyCode转换为后端的code参数
    });
    return apiService.post(`/phone/login?${params.toString()}`, {});
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