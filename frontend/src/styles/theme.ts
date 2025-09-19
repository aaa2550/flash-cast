// 设计系统 - 主题常量和样式定义
export const Colors = {
  // 主色调
  primary: '#007AFF',
  primaryLight: '#4DA6FF',
  primaryDark: '#0056CC',
  
  // 背景色
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F7FA',
  
  // 文本颜色
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#CCCCCC',
  textLight: '#FFFFFF',
  
  // 状态色
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // 边框和分割线
  border: '#E5E5E7',
  divider: '#F2F2F7',
  
  // 阴影和覆盖层
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // 特殊颜色
  accent: '#FF6B35',
  vip: '#FFD700',
  premium: '#8B5CF6',
};

export const Typography = {
  // 字体大小
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
    hero: 40,
  },
  
  // 字体权重
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  
  // 行高
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

export const Spacing = {
  // 间距系统 (4px 基准)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  
  // 组件间距
  componentGap: 16,
  sectionGap: 24,
  screenPadding: 20,
};

export const BorderRadius = {
  // 圆角系统
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 999,
};

export const Shadows = {
  // 阴影系统
  none: {},
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// 通用组件样式
export const CommonStyles = {
  // 容器样式
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  } as const,
  
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
  } as const,
  
  // 卡片样式
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.medium,
  } as const,
  
  // 按钮样式
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...Shadows.small,
  } as const,
  
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as const,
  
  // 文本样式
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeights.tight,
  } as const,
  
  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeights.normal,
  } as const,
  
  body: {
    fontSize: Typography.sizes.base,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeights.normal,
  } as const,
  
  caption: {
    fontSize: Typography.sizes.sm,
    fontWeight: '400' as const,
    color: Colors.textTertiary,
    lineHeight: Typography.lineHeights.normal,
  } as const,
  
  // 布局样式
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as const,
  
  rowBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  } as const,
  
  rowCenter: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  
  center: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as const,
  
  // 分割线
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  } as const,
};

// 状态徽章样式
export const StatusStyles = {
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.textLight,
  },
  
  success: {
    backgroundColor: Colors.success,
  },
  
  warning: {
    backgroundColor: Colors.warning,
  },
  
  error: {
    backgroundColor: Colors.error,
  },
  
  info: {
    backgroundColor: Colors.info,
  },
};

// 动画配置
export const Animations = {
  duration: {
    short: 150,
    medium: 250,
    long: 350,
  },
  
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// 布局常量
export const Layout = {
  tabBarHeight: 60,
  headerHeight: 56,
  buttonHeight: 48,
  inputHeight: 44,
  
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
  },
};

// 工具函数
export const utils = {
  getStatusColor: (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return Colors.success;
      case 'warning':
      case 'pending':
        return Colors.warning;
      case 'error':
      case 'failed':
        return Colors.error;
      case 'running':
      case 'processing':
        return Colors.info;
      default:
        return Colors.textSecondary;
    }
  },
  
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  formatDuration: (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
};