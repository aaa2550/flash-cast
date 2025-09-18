import { apiService } from './api';
import { VideoGenerateRequest, VideoGenerateResponse, Topic, PaginationParams, PaginationResponse, ApiResponse } from '@types';

class VideoService {
  // 生成视频
  async generateVideo(data: VideoGenerateRequest): Promise<ApiResponse<VideoGenerateResponse>> {
    return apiService.post('/video/generate', data);
  }

  // 获取生成任务状态
  async getTaskStatus(taskId: string): Promise<ApiResponse<VideoGenerateResponse>> {
    return apiService.get(`/video/task/${taskId}`);
  }

  // 获取热门话题
  async getHotTopics(params: PaginationParams): Promise<ApiResponse<PaginationResponse<Topic>>> {
    return apiService.get('/video/topics/hot', { params });
  }

  // 根据话题生成文案
  async generateScript(topicId: string): Promise<ApiResponse<{ script: string }>> {
    return apiService.post('/video/generate-script', { topicId });
  }

  // 获取话题分类
  async getTopicCategories(): Promise<ApiResponse<string[]>> {
    return apiService.get('/video/topics/categories');
  }

  // 根据分类获取话题
  async getTopicsByCategory(category: string, params: PaginationParams): Promise<ApiResponse<PaginationResponse<Topic>>> {
    return apiService.get('/video/topics', { params: { ...params, category } });
  }

  // 获取用户生成历史
  async getGenerateHistory(params: PaginationParams): Promise<ApiResponse<PaginationResponse<VideoGenerateResponse>>> {
    return apiService.get('/video/history', { params });
  }

  // 删除生成历史
  async deleteGenerateHistory(taskId: string): Promise<ApiResponse<null>> {
    return apiService.delete(`/video/history/${taskId}`);
  }
}

export const videoService = new VideoService();