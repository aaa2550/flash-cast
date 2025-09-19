// API配置
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api', // 后端服务端口
  TIMEOUT: 10000,
};

// 应用配置
export const APP_CONFIG = {
  NAME: 'Flash Cast',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@flashcast.com',
};

// 屏幕尺寸
export const SCREEN_CONFIG = {
  SMALL_SCREEN_WIDTH: 375,
  MEDIUM_SCREEN_WIDTH: 414,
  LARGE_SCREEN_WIDTH: 768,
};

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_AUDIO_SIZE: 50 * 1024 * 1024,  // 50MB
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'mov', 'avi'],
  SUPPORTED_AUDIO_FORMATS: ['mp3', 'wav', 'aac'],
  MAX_VIDEO_DURATION: 300, // 5分钟
  MAX_AUDIO_DURATION: 600, // 10分钟
};

// 验证码配置
export const VERIFY_CODE_CONFIG = {
  RESEND_INTERVAL: 60, // 秒
  CODE_LENGTH: 6,
  EXPIRE_TIME: 300, // 5分钟
};

// 存储键名
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_INFO: 'user_info',
  REMEMBER_PHONE: 'remember_phone',
  APP_SETTINGS: 'app_settings',
};