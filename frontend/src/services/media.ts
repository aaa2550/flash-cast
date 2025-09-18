import { apiService } from './api';
import { MediaFile, UploadMediaRequest, PaginationParams, PaginationResponse, ApiResponse } from '@types';

class MediaService {
  // 上传媒体文件
  async uploadMedia(data: UploadMediaRequest): Promise<ApiResponse<MediaFile>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('type', data.type);
    
    return apiService.upload('/media/upload', formData);
  }

  // 获取媒体文件列表
  async getMediaList(params: PaginationParams & { type?: 'video' | 'audio' }): Promise<ApiResponse<PaginationResponse<MediaFile>>> {
    return apiService.get('/media', { params });
  }

  // 获取媒体文件详情
  async getMediaDetail(id: string): Promise<ApiResponse<MediaFile>> {
    return apiService.get(`/media/${id}`);
  }

  // 删除媒体文件
  async deleteMedia(id: string): Promise<ApiResponse<null>> {
    return apiService.delete(`/media/${id}`);
  }

  // 更新媒体文件信息
  async updateMedia(id: string, data: Partial<MediaFile>): Promise<ApiResponse<MediaFile>> {
    return apiService.put(`/media/${id}`, data);
  }

  // 解析视频音频
  async extractAudio(videoId: string): Promise<ApiResponse<MediaFile>> {
    return apiService.post('/media/extract-audio', { videoId });
  }
}

export const mediaService = new MediaService();