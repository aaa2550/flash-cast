import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // 存储字符串
  async setString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('StorageService setString error:', error);
      throw error;
    }
  }

  // 获取字符串
  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('StorageService getString error:', error);
      return null;
    }
  }

  // 存储对象
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('StorageService setObject error:', error);
      throw error;
    }
  }

  // 获取对象
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('StorageService getObject error:', error);
      return null;
    }
  }

  // 删除指定key
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('StorageService remove error:', error);
      throw error;
    }
  }

  // 删除多个key
  async removeMultiple(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('StorageService removeMultiple error:', error);
      throw error;
    }
  }

  // 清空所有存储
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('StorageService clear error:', error);
      throw error;
    }
  }

  // 获取所有key
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('StorageService getAllKeys error:', error);
      return [];
    }
  }

  // 检查key是否存在
  async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('StorageService hasKey error:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();