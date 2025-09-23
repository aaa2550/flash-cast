import { apiClient } from './api';

/**
 * 自定义音色创建：上传音频文件并返回 voice 创建任务 id
 * 约定后端接口：POST /voice/create (multipart/form-data)
 * form fields:
 *  - file: File (必填)
 *  - name: string (可选，自定义显示名称)
 */
export interface VoiceCreateResponse {
  taskId: string; // 用于后续轮询状态
}

export const startVoiceCreation = (file: File, name?: string) => {
  const form = new FormData();
  form.append('file', file);
  if (name) form.append('name', name);
  return apiClient.post<VoiceCreateResponse>('/voice/create', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * 轮询音色解析状态
 * 约定后端接口：GET /voice/status/:taskId
 */
export interface VoiceStatusResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  progress: number; // 0-100
  voiceId?: string; // 成功后得到可供克隆引用的 voiceId
  message?: string; // 失败或提示信息
}

export const getVoiceStatus = (taskId: string) => {
  return apiClient.get<VoiceStatusResponse>(`/voice/status/${taskId}`);
};

/**
 * （可选）取消音色任务：POST /voice/cancel/:taskId
 */
export const cancelVoiceTask = (taskId: string) => {
  return apiClient.post(`/voice/cancel/${taskId}`);
};

// 获取音色试听音频的直链（假设后端直接返回 audio/* 流）
export const getVoiceSampleUrl = (voiceId: string) => {
  // 若需要鉴权 token，可在这里统一附加查询参数或使用受保护路由。
  return `${apiClient.defaults.baseURL}/voice/sample/${voiceId}`;
};

// 前端可用的统一类型，用于下拉展示
export interface VoiceOption {
  id: string;        // voiceId 或 临时 task 占位 id
  name: string;      // 展示名称
  type: 'preset' | 'custom' | 'creating';
  creatingTaskId?: string; // 若 type === 'creating'，对应的后台任务 id
  progress?: number; // creating 进度
  disabled?: boolean; // 是否禁用选择（进行中）
}
