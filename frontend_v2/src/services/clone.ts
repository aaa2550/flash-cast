import { apiClient } from './api';

export interface CloneStartPayload {
  douyinUrl: string;
  modelVideoUrl?: string; // 模特视频地址（假设前端上传后得到的URL）
  voiceId?: string;       // 选中的音色标识
  customVoiceText?: string; // 如果是自定义音色描述
}

export interface CloneStartResponse { id: string; }

export type CloneStepKey = 'parse' | 'copywriting' | 'tts' | 'video' | 'publish';

export interface CloneStepStatus {
  key: CloneStepKey;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  progress: number; // 0-100
  message?: string;
}

export interface CloneStatusResponse {
  id: string;
  overallStatus: 'running' | 'success' | 'failed';
  steps: CloneStepStatus[];
  downloadUrl?: string;
  douyinShareUrl?: string;
  errorMessage?: string;
}

// 启动克隆任务
export const startClone = (payload: CloneStartPayload) => {
  return apiClient.post<CloneStartResponse>('/clone/start', payload);
};

// 查询任务状态
export const fetchCloneStatus = (id: string) => {
  return apiClient.get<CloneStatusResponse>(`/clone/status/${id}`);
};

// 取消任务（假设为 POST，没有 body）
export const cancelClone = (id: string) => {
  return apiClient.post(`/clone/cancel/${id}`);
};

// Mock 辅助（如后端暂未就绪，可前端自演）
// 简单示例: 返回一个静态序列（可用于 Storybook 或前端演示）
export const mockProgressSequence = (id: string): CloneStatusResponse[] => {
  return [
    {
      id,
      overallStatus: 'running',
      steps: [
        { key: 'parse', name: '解析视频', status: 'running', progress: 40 },
        { key: 'copywriting', name: '智能生成文案', status: 'pending', progress: 0 },
        { key: 'tts', name: '合成音频', status: 'pending', progress: 0 },
        { key: 'video', name: '合成视频', status: 'pending', progress: 0 },
        { key: 'publish', name: '发布抖音', status: 'pending', progress: 0 }
      ]
    }
  ];
};
