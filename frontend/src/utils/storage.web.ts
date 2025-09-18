// Web兼容的存储服务
class WebStorageService {
  // 存储字符串
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('WebStorageService setItem error:', error);
      throw error;
    }
  }

  // 获取字符串
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('WebStorageService getItem error:', error);
      return null;
    }
  }

  // 移除键值对
  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('WebStorageService removeItem error:', error);
      throw error;
    }
  }

  // 清空所有存储
  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('WebStorageService clear error:', error);
      throw error;
    }
  }

  // 获取所有键名
  async getAllKeys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('WebStorageService getAllKeys error:', error);
      return [];
    }
  }

  // 批量获取多个键值对
  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      const result: Array<[string, string | null]> = [];
      for (const key of keys) {
        const value = localStorage.getItem(key);
        result.push([key, value]);
      }
      return result;
    } catch (error) {
      console.error('WebStorageService multiGet error:', error);
      return [];
    }
  }

  // 批量设置多个键值对
  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      for (const [key, value] of keyValuePairs) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('WebStorageService multiSet error:', error);
      throw error;
    }
  }

  // 批量删除多个键值对
  async multiRemove(keys: string[]): Promise<void> {
    try {
      for (const key of keys) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('WebStorageService multiRemove error:', error);
      throw error;
    }
  }

  // 兼容方法
  async setString(key: string, value: string): Promise<void> {
    return this.setItem(key, value);
  }

  async getString(key: string): Promise<string | null> {
    return this.getItem(key);
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      return this.setItem(key, jsonValue);
    } catch (error) {
      console.error('WebStorageService setObject error:', error);
      throw error;
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('WebStorageService getObject error:', error);
      return null;
    }
  }
}

const AsyncStorage = new WebStorageService();

// 默认导出，兼容AsyncStorage API
export default AsyncStorage;

// 同时也创建一个storageService实例供其他地方使用
export const storageService = AsyncStorage;