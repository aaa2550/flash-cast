// 路由参数类型定义
export type RootStackParamList = {
  // 认证相关
  Login: undefined;
  Register: undefined;
  
  // 主要页面
  Main: undefined;
  
  // 媒体管理
  MediaList: { type?: 'video' | 'audio' };
  MediaDetail: { id: string };
  MediaUpload: { type: 'video' | 'audio' };
  
  // 视频生成
  VideoGenerate: undefined;
  TopicList: undefined;
  GenerateHistory: undefined;
  
  // 个人中心
  Profile: undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  MediaManage: undefined;
  VideoGenerate: undefined;
  Profile: undefined;
};