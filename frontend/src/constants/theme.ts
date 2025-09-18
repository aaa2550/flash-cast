// 主色调
export const COLORS = {
  // 主色调
  PRIMARY: '#6C63FF',
  PRIMARY_LIGHT: '#8B7FFF',
  PRIMARY_DARK: '#5A52E5',
  
  // 辅助色
  SECONDARY: '#FF6B6B',
  SECONDARY_LIGHT: '#FF8E8E',
  SECONDARY_DARK: '#E55555',
  
  // 中性色
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_100: '#F8F9FA',
  GRAY_200: '#E9ECEF',
  GRAY_300: '#DEE2E6',
  GRAY_400: '#CED4DA',
  GRAY_500: '#ADB5BD',
  GRAY_600: '#6C757D',
  GRAY_700: '#495057',
  GRAY_800: '#343A40',
  GRAY_900: '#212529',
  
  // 状态色
  SUCCESS: '#28A745',
  WARNING: '#FFC107',
  ERROR: '#DC3545',
  INFO: '#17A2B8',
  
  // 背景色
  BACKGROUND: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F8F9FA',
  SURFACE: '#FFFFFF',
  
  // 文本色
  TEXT_PRIMARY: '#212529',
  TEXT_SECONDARY: '#6C757D',
  TEXT_LIGHT: '#ADB5BD',
  TEXT_WHITE: '#FFFFFF',
  
  // 边框色
  BORDER: '#DEE2E6',
  BORDER_LIGHT: '#E9ECEF',
  
  // 透明度
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  BACKDROP: 'rgba(0, 0, 0, 0.3)',
};

// 字体大小
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  '2XL': 24,
  '3XL': 30,
  '4XL': 36,
  '5XL': 48,
};

// 字体粗细
export const FONT_WEIGHTS = {
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
};

// 间距
export const SPACING = {
  XS: 4,
  SM: 8,
  BASE: 16,
  LG: 24,
  XL: 32,
  '2XL': 48,
  '3XL': 64,
  '4XL': 80,
  '5XL': 96,
};

// 圆角
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 4,
  BASE: 8,
  LG: 12,
  XL: 16,
  '2XL': 24,
  FULL: 9999,
};

// 阴影
export const SHADOWS = {
  NONE: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  BASE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  LG: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  XL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};