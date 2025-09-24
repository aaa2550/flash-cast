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

// 上传资源：POST /resource/upload  (需要 multipart form: file + type)
export interface UploadResourceResponse {
  code: number;
  message: string;
  data: ResourceItem; // 假设直接返回新增资源
  timestamp: number;
}

export const uploadAudioResource = (file: File, onProgress?: (p:number)=>void) => {
  const form = new FormData();
  form.append('file', file);
  form.append('type', 'AUDIO');
  return apiClient.post<UploadResourceResponse>('/resource/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e)=>{ if(onProgress && e.total) onProgress(Math.round(e.loaded / e.total * 100)); }
  });
};
