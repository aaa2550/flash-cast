// --- 科技感扁平化设计系统 ---

const C = {
  // =================================
  // 色彩方案 (冷色调 + 高对比度)
  // =================================

  // 背景色
  bgDeepSpace: '#0F1419', // 深空黑，作为主背景
  bgPanel: '#1B232B',     // 面板背景，比主背景稍亮
  bgLayer: '#252E38',     // 浮层或卡片背景
  bgSubtle: '#303A45',    // 更微妙的背景层次
  bgMuted: '#404A54',     // 禁用或非活动元素背景

  // 强调色 (高对比度)
  accentTechBlue: '#00D4FF', // 科技蓝，用于关键交互和高亮
  accentNeonGreen: '#00FF88',// 霓虹绿，用于成功状态或次要高亮

  // 文本颜色
  textTitle: '#FFFFFF',       // 标题白
  textPrimary: '#E1E8ED',    // 主要文本
  textSecondary: '#AAB8C2',   // 次要文本
  textTertiary: '#788896',    // 辅助或占位文本
  textInverse: '#0F1419',    // 反色文本，用于亮色背景

  // 状态色
  stateSuccess: '#00FF88',   // 成功 (霓虹绿)
  stateError: '#FF4757',     // 错误 (亮红)
  stateWarning: '#FFD700',   // 警告 (亮黄)
  stateInfo: '#00D4FF',      // 信息 (科技蓝)

  // 边框和线条
  lineStrong: '#404A54',     // 强分割线
  lineSubtle: '#252E38',     // 弱分割线
  cardBorder: '#303A45',     // 卡片边框

  // 按钮
  buttonPrimaryBg: '#00D4FF',
  buttonPrimaryBgHover: '#33E0FF',
  buttonPrimaryText: '#0F1419',
  buttonSecondaryBg: 'transparent',
  buttonSecondaryBgHover: 'rgba(0, 212, 255, 0.1)',
  buttonSecondaryBorder: '#404A54',
  buttonSecondaryText: '#E1E8ED',

  // 进度条
  progressTrack: '#252E38',
  progressFill: '#00D4FF',
};

const S = {
  // =================================
  // 间距系统 (4px 基准)
  // =================================
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

const R = {
  // =================================
  // 圆角系统 (锐利清晰)
  // =================================
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  full: 999,
};

const TY = {
  // =================================
  // 字体系统
  // =================================
  families: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "SF Mono", "Menlo", "Monaco", monospace',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  shadows: {
    sm: {
      shadowColor: C.bgDeepSpace,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: C.bgDeepSpace,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export const TechTheme = {
  colors: C,
  spacing: S,
  radius: R,
  typography: TY,
};






