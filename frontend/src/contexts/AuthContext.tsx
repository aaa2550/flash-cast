import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '../utils';
import { STORAGE_KEYS } from '../constants';
import { User } from '../types';
import { apiService } from '../services';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查认证状态
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const savedToken = await storageService.getString(STORAGE_KEYS.USER_TOKEN);
      const savedUser = await storageService.getObject<User>(STORAGE_KEYS.USER_INFO);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        setIsAuthenticated(true);
        
        // 设置API服务的token
        apiService.setAuthToken(savedToken);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('检查认证状态失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登录
  const login = async (userData: User, authToken: string): Promise<void> => {
    try {
      await storageService.setString(STORAGE_KEYS.USER_TOKEN, authToken);
      await storageService.setObject(STORAGE_KEYS.USER_INFO, userData);
      
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // 设置API服务的token
      apiService.setAuthToken(authToken);
    } catch (error) {
      console.error('保存登录信息失败:', error);
      throw error;
    }
  };

  // 登出
  const logout = async (): Promise<void> => {
    try {
      await storageService.remove(STORAGE_KEYS.USER_TOKEN);
      await storageService.remove(STORAGE_KEYS.USER_INFO);
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // 清除API服务的token
      apiService.clearAuthToken();
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  };

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    checkAuthStatus,
  };

  // 如果还在加载中，可以显示加载界面
  if (isLoading) {
    return null; // 或者返回一个加载组件
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};