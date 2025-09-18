// 用户相关类型
export interface User {
  id: string;
  phone: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  phone: string;
  verifyCode: string;
  agreeTerms: boolean;
  nickname?: string; // 首次登录时的昵称
}

export interface RegisterRequest {
  phone: string;
  verifyCode: string;
  nickname?: string;
}

export interface SendCodeRequest {
  phone: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  isNewUser: boolean; // 是否为新用户
}

// 媒体相关类型
export interface MediaFile {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  duration?: number;
  mimeType: string;
  type: 'video' | 'audio';
  createdAt: string;
  updatedAt: string;
}

export interface UploadMediaRequest {
  file: {
    uri: string;
    type: string;
    name: string;
  };
  type: 'video' | 'audio';
}

// 视频生成相关类型
export interface VideoGenerateRequest {
  videoId: string;
  audioId: string;
  script: string;
  topicId?: string;
}

export interface VideoGenerateResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress?: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  isHot: boolean;
  category: string;
  createdAt: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}