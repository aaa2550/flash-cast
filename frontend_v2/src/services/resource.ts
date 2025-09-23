import { apiClient } from './api';

// 后端资源列表接口
// GET /resource/list?type=AUDIO  返回 { code, message, data: ResourceItem[] }
export interface ResourceItem {
  id: number;
  type: string; // 'AUDIO'
  userId: number;
  name: string;
  path: string; // 服务器返回的相对路径，例如 /1/xxx.m4a
  suffix: string;
  size: number;
  createTime: string;
  updateTime: string;
  deleted: number;
}

export interface ResourceListResponse {
  code: number;
  message: string;
  data: ResourceItem[];
  timestamp: number;
}

export const fetchAudioResources = () => {
  return apiClient.get<ResourceListResponse>('/resource/list', { params: { type: 'AUDIO' } });
};
