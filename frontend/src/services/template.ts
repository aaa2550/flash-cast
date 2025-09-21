import { apiService } from './api';

export interface TemplateItem {
  id: number;
  name: string;
  coverUrl: string;
  description?: string;
  [key: string]: any;
}

class TemplateService {
  async getVideoTemplates(): Promise<TemplateItem[]> {
    const res = await apiService.get('/template/list?type=VIDEO&page=1&pageSize=20');
    if (res.code === 200 && res.data && Array.isArray(res.data.records)) {
      return res.data.records;
    }
    return [];
  }
}

export const templateService = new TemplateService();
