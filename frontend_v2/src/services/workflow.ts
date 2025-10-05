import { apiClient } from './api';

// 工作流步骤类型
export type WorkflowStep = 
  | 'parse_video'
  | 'rewrite_content'
  | 'synthesize_audio'
  | 'synthesize_video'
  | 'publish_video';

// 步骤状态
export type StepStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

// 画面比例类型
export enum PixelType {
  RATIO_9_16 = 'RATIO_9_16',  // 9:16 竖屏
  RATIO_16_9 = 'RATIO_16_9',  // 16:9 横屏
  RATIO_1_1 = 'RATIO_1_1'     // 1:1 正方形
}

// 步骤结果数据
export interface StepResult {
  parsedContent?: string;      // 解析的文案
  rewrittenContent?: string;   // 重写后的文案
  audioUrl?: string;           // 合成的音频URL
  videoUrl?: string;           // 合成的视频URL
  publishStatus?: boolean;     // 发布状态
}

// 工作流步骤信息
export interface WorkflowStepInfo {
  id: WorkflowStep;
  name: string;
  description: string;
  status: StepStatus;
  progress?: number;
  error?: string;
  result?: StepResult;
  startTime?: number;
  endTime?: number;
}

// 解析视频文案
export const parseVideoContent = async (link: string) => {
  return apiClient.post('/task/linkParse', null, {
    params: { link }
  });
};

// 重写文案参数
export interface RewriteParams {
  content: string;
  styles: string;
  tone: string;
  extraInstructions: string;
}

// 重写文案
export const rewriteContent = async (params: RewriteParams) => {
  return apiClient.post('/task/rewrite', null, {
    params: params
  });
};

// 合成音频参数
export interface SynthesizeAudioParams {
  audioPath: string;
  content: string;
  emotionText: string;
}

// 合成音频
export const synthesizeAudio = async (params: SynthesizeAudioParams) => {
  return apiClient.post('/task/timbreSynthesis', null, {
    params: params
  });
};

// 合成视频参数
export interface SynthesizeVideoParams {
  audioPath: string;
  videoPath: string;
  pixelType: PixelType;
}

// 合成视频
export const synthesizeVideo = async (params: SynthesizeVideoParams) => {
  return apiClient.post('/task/videoSynthesis', null, {
    params: params
  });
};

// 发布视频参数
export interface PublishVideoParams {
  videoPath: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  videoResourceId?: number | null;
}

// 发布视频
export const publishVideo = async (params: PublishVideoParams) => {
  return apiClient.post('/task/publish', null, {
    params: params
  });
};

// 工作流配置
export const WORKFLOW_STEPS: WorkflowStepInfo[] = [
  {
    id: 'parse_video',
    name: '解析视频文案',
    description: '从抖音链接解析视频文案内容',
    status: 'pending'
  },
  {
    id: 'rewrite_content',
    name: '重写文案',
    description: '根据风格和语气重写文案',
    status: 'pending'
  },
  {
    id: 'synthesize_audio',
    name: '合成音频',
    description: '使用AI语音合成技术生成音频',
    status: 'pending'
  },
  {
    id: 'synthesize_video',
    name: '合成视频',
    description: '将音频与视频素材合成',
    status: 'pending'
  },
  {
    id: 'publish_video',
    name: '发布视频',
    description: '扫码授权并发布视频到抖音平台',
    status: 'pending'
  }
];
