import { Platform } from 'react-native';

// 检测当前平台
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Web平台的存储适配
export const createWebStorage = () => {
  if (!isWeb) return null;
  
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Web storage getItem error:', error);
        return null;
      }
    },
    
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('Web storage setItem error:', error);
      }
    },
    
    removeItem: async (key: string): Promise<void> => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Web storage removeItem error:', error);
      }
    },
    
    clear: async (): Promise<void> => {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('Web storage clear error:', error);
      }
    },
  };
};

// Web平台的Alert适配
export const webAlert = (title: string, message?: string, buttons?: any[]) => {
  if (!isWeb) return;
  
  if (message) {
    alert(`${title}\n\n${message}`);
  } else {
    alert(title);
  }
  
  // 如果有按钮配置，执行第一个按钮的回调
  if (buttons && buttons[0] && buttons[0].onPress) {
    buttons[0].onPress();
  }
};

// 获取平台特定的样式
export const getPlatformStyle = (webStyle: any, nativeStyle: any) => {
  return isWeb ? webStyle : nativeStyle;
};

// Web平台的文件上传适配
export const createWebFileUpload = () => {
  if (!isWeb) return null;
  
  return {
    pickImage: () => {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                uri: reader.result,
                type: file.type,
                name: file.name,
                size: file.size,
              });
            };
            reader.readAsDataURL(file);
          } else {
            reject(new Error('No file selected'));
          }
        };
        input.click();
      });
    },
  };
};