import { apiClient } from './api';

// 任务状态枚举
export enum TaskStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED'
}

// 子任务类型枚举
export enum SubTaskType {
  LINK_PARSE = 'LINK_PARSE',           // 链接解析文案
  COPY_REPRODUCE = 'COPY_REPRODUCE',   // 文案复刻（重写）
  TIMBRE_SYNTHESIS = 'TIMBRE_SYNTHESIS', // 音色合成
  VIDEO_SYNTHESIS = 'VIDEO_SYNTHESIS',  // 视频合成
  PUBLISH = 'PUBLISH'                   // 发布
}

// 画面比例类型
export enum PixelType {
  RATIO_9_16 = 'P9_16',  // 9:16 (竖屏)
  RATIO_16_9 = 'RATIO_16_9',
  RATIO_1_1 = 'RATIO_1_1'
}

// 子任务定义
export interface SubTaskDef {
  type: SubTaskType;
  parameter: Record<string, any>;
}

// 任务响应
export interface Task {
  id: number;
  type: string;
  json: string;
  userId: number;
  progress: number;
  status: TaskStatus;
  resultResourceId?: number;
  startStep: number;
  createTime: string;
  updateTime: string;
  deleted: number;
  subTasks: SubTask[];
}

// 子任务
export interface SubTask {
  id: number;
  mainTaskId: number;
  seq: number;
  type: SubTaskType;
  parameter: string;
  platformType?: string;
  content?: string;
  dependOnIds?: string;
  runningHubId?: string;
  status: TaskStatus;
  createTime: string;
  updateTime: string;
  deleted: number;
}

// 检查响应
export interface CheckResponse {
  status: TaskStatus;
  result?: string;
  resourceId?: number;
}

// 创建任务
export const createTask = async (startStep: number, subTaskDefs: SubTaskDef[]) => {
  const json = JSON.stringify(subTaskDefs);
  return apiClient.post<{ code: number; message: string; data: Task }>('/task/create', {
    startStep,
    json
  });
};

// 解析视频链接
export const linkParse = async (subTaskId: number, link: string) => {
  return apiClient.post('/task/linkParse', {
    subTaskId,
    link
  });
};

// 重写文案
export const rewrite = async (
  subTaskId: number,
  content: string,
  styles: string,
  tone: string,
  extraInstructions: string
) => {
  return apiClient.post('/task/rewrite', {
    subTaskId,
    content,
    styles,
    tone,
    extraInstructions
  });
};

// 合成音频
export const timbreSynthesis = async (
  subTaskId: number,
  audioResourceId: number,
  content: string,
  emotionText: string
) => {
  return apiClient.post('/task/timbreSynthesis', {
    subTaskId,
    audioResourceId,
    content,
    emotionText
  });
};

// 合成视频
export const videoSynthesis = async (
  subTaskId: number,
  audioResourceId: number,
  videoResourceId: number,
  pixelType: PixelType
) => {
  return apiClient.post('/task/videoSynthesis', {
    subTaskId,
    audioResourceId,
    videoResourceId,
    pixelType
  });
};

// 发布视频
export const publish = async (
  subTaskId: number,
  videoPath: string,
  title?: string,
  description?: string
) => {
  return apiClient.post('/task/publish', {
    subTaskId,
    videoPath,
    title,
    description
  });
};

// 检查子任务状态
export const checkSubTask = async (subTaskId: number) => {
  return apiClient.get<{ code: number; message: string; data: CheckResponse }>('/task/check', {
    params: { subTaskId }
  });
};

// 资源类型
export interface Resource {
  id: number;
  type: string;
  userId: number;
  name: string;
  path: string;
  suffix: string;
  size: number;
  createTime: string;
  updateTime: string;
  deleted: number;
}

// 上传文件
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post<{ code: number; message: string; data: Resource }>('/resource/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
