import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useRouter } from 'next/router';
import { theme } from '../styles/theme';
import { DouyinQRScanner } from '../components/DouyinQRScanner';
import { DouyinUserInfo } from '../services/api';
import { AuthGuard } from '../components/AuthGuard';
import {
  TaskStatus,
  SubTaskType,
  PixelType,
  SubTaskDef,
  Task,
  SubTask,
  CheckResponse,
  Resource,
  createTask,
  linkParse,
  rewrite,
  timbreSynthesis,
  videoSynthesis,
  publish,
  checkSubTask,
  uploadFile
} from '../services/task';

// 步骤类型定义
type WorkflowStep = 'parse_video' | 'rewrite_content' | 'synthesize_audio' | 'synthesize_video' | 'publish_video';
type StepStatus = 'pending' | 'running' | 'success' | 'error';

interface WorkflowStepInfo {
  id: WorkflowStep;
  name: string;
  description: string;
  status: StepStatus;
  error?: string;
  result?: string;
}

// 工作流步骤配置
const WORKFLOW_STEPS: WorkflowStepInfo[] = [
  { id: 'parse_video', name: '解析视频文案', description: '从抖音链接解析视频文案内容', status: 'pending' },
  { id: 'rewrite_content', name: '重写文案', description: '根据风格和语气重写文案', status: 'pending' },
  { id: 'synthesize_audio', name: '合成音频', description: '使用AI语音合成技术生成音频', status: 'pending' },
  { id: 'synthesize_video', name: '合成视频', description: '将音频与视频素材合成', status: 'pending' },
  { id: 'publish_video', name: '发布视频', description: '扫码授权并发布视频到抖音平台', status: 'pending' }
];

// seq到stepId的映射
const SEQ_TO_STEP_ID: { [key: number]: WorkflowStep } = {
  0: 'parse_video',
  1: 'rewrite_content',
  2: 'synthesize_audio',
  3: 'synthesize_video',
  4: 'publish_video'
};

// 表单参数类型
interface RewriteParams {
  content: string;
  styles: string;
  tone: string;
  extraInstructions: string;
}

interface AudioParams {
  audioResourceId: number | null;
  audioFileName: string;
  content: string;
  emotionText: string;
}

interface VideoParams {
  audioResourceId: number | null;
  audioFileName: string;
  videoResourceId: number | null;
  videoFileName: string;
  pixelType: PixelType;
}

interface PublishParams {
  videoPath: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  videoResourceId?: number | null;
}

// 动画效果
const flowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${theme.colors.primary}; }
  50% { box-shadow: 0 0 40px ${theme.colors.primary}, 0 0 60px ${theme.colors.primary}; }
`;

// 页面容器
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bgDeep};
  color: ${theme.colors.text};
  position: relative;
  overflow: hidden;
`;

// 网格背景
const GridBackground = styled.div`
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(${theme.colors.border} 1px, transparent 1px),
    linear-gradient(to right, ${theme.colors.border} 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.1;
  pointer-events: none;
`;

// 主容器
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

// 标题
const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  text-shadow: ${theme.shadows.glow};
  letter-spacing: 2px;
`;

// Tab导航容器
const TabNav = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.xs};
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.bgSlight};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 2px;
  }
`;

// Tab按钮
const TabButton = styled.button<{ $active: boolean; $status: StepStatus }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${props => props.$active ? theme.colors.bgSlight : theme.colors.bgDeep};
  border: 2px solid ${props => {
    if (props.$active) return theme.colors.primary;
    switch (props.$status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'running': return theme.colors.primary;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.text};
  font-family: ${theme.typography.fontFamily};
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  position: relative;
  
  ${props => props.$active && css`
    box-shadow: 0 0 15px ${theme.colors.primary}44;
  `}
  
  ${props => props.$status === 'running' && !props.$active && css`
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}
  
  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }
`;

// Tab步骤编号
const TabStepNumber = styled.div<{ $status: StepStatus }>`
  width: 28px;
  height: 28px;
  background: ${props => {
    switch (props.$status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'running': return theme.colors.primary;
      default: return theme.colors.border;
    }
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
`;

// Tab内容区域
const TabContent = styled.div`
  flex: 1;
  background: ${theme.colors.bgSlight};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.bgDeep};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 3px;
  }
`;

// 内容行 - 左右布局（内容在左，按钮在右）
const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: ${theme.spacing.lg};
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 主内容区（左侧）
const MainContent = styled.div`
  min-height: 0;
`;

// 侧边栏（右侧按钮区）
const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  position: sticky;
  top: 0;
  
  @media (max-width: 1024px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    position: static;
  }
`;

// 步骤标题
const StepHeader = styled.div`
  margin-bottom: ${theme.spacing.md};
  flex-shrink: 0;
`;

const StepTitle = styled.h2`
  color: ${theme.colors.primary};
  font-size: 1.3rem;
  margin-bottom: ${theme.spacing.xs};
`;

const StepDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.85rem;
`;

// 步骤状态徽章
const StatusBadge = styled.div<{ $status: StepStatus }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${props => {
    switch (props.$status) {
      case 'success': return theme.colors.success + '22';
      case 'error': return theme.colors.error + '22';
      case 'running': return theme.colors.primary + '22';
      default: return theme.colors.border + '22';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'running': return theme.colors.primary;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${theme.radius.sm};
  color: ${props => {
    switch (props.$status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'running': return theme.colors.primary;
      default: return theme.colors.textSecondary;
    }
  }};
  font-size: 0.85rem;
  font-weight: bold;
  margin-top: ${theme.spacing.xs};
`;

// 表单组
const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

// 标签
const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs};
  font-weight: 500;
`;

// 输入框
const Input = styled.input`
  width: 100%;
  background: ${theme.colors.bgDeep};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text};
  font-family: ${theme.typography.fontFamily};
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}22;
  }
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

// 文本域
const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  max-height: 150px;
  background: ${theme.colors.bgDeep};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text};
  font-family: ${theme.typography.fontFamily};
  font-size: 0.95rem;
  resize: vertical;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}22;
  }
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

// 选择框
const Select = styled.select`
  width: 100%;
  background: ${theme.colors.bgDeep};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text};
  font-family: ${theme.typography.fontFamily};
  font-size: 0.95rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}22;
  }
  
  option {
    background: ${theme.colors.bgDeep};
    color: ${theme.colors.text};
  }
`;

// 结果显示框
const ResultBox = styled.div`
  background: ${theme.colors.bgDeep};
  border: 1px solid ${theme.colors.success};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  max-height: 200px;
  overflow-y: auto;
  
  pre {
    margin: 0;
    color: ${theme.colors.success};
    font-size: 0.85rem;
    white-space: pre-wrap;
    word-break: break-all;
  }
`;

// 错误提示
const ErrorBox = styled.div`
  background: ${theme.colors.error}22;
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  color: ${theme.colors.error};
  font-size: 0.9rem;
`;

// 加载动画
const LoadingSpinner = styled.div`
  width: 35px;
  height: 35px;
  border: 3px solid ${theme.colors.border};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: ${theme.spacing.md} auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 操作按钮区域
const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
  justify-content: center;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

// 按钮 - 统一样式
const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.radius.sm};
  font-family: ${theme.typography.fontFamily};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
  color: ${theme.colors.white};
  
  ${props => props.$variant === 'danger' && css`
    background: ${theme.colors.error};
    &:hover:not(:disabled) {
      background: ${theme.colors.error}dd;
    }
  `}
  
  &:hover:not(:disabled) {
    box-shadow: ${theme.shadows.glow};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 1024px) {
    width: auto;
    min-width: 140px;
  }
`;

// 提示框 - 更紧凑
const HintBox = styled.div`
  background: ${theme.colors.primary}11;
  border-left: 3px solid ${theme.colors.primary};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  line-height: 1.4;
  font-size: 0.8rem;
  
  strong {
    color: ${theme.colors.primary};
  }
`;

// QR扫码容器（居中）
const QRScannerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${theme.spacing.md} 0;
`;

function WorkflowPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<WorkflowStep>('parse_video');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepInfo[]>(
    WORKFLOW_STEPS.map(step => ({ ...step }))
  );
  const [autoMode, setAutoMode] = useState<'manual' | 'auto-synthesis' | 'auto-publish'>('manual');
  
  // 扫码状态（全局，在发布步骤使用）
  const [douyinScanned, setDouyinScanned] = useState(false);
  const [douyinUserInfo, setDouyinUserInfo] = useState<DouyinUserInfo | null>(null);
  
  // 异步任务状态
  const [mainTaskId, setMainTaskId] = useState<number | null>(null);
  const [subTaskIds, setSubTaskIds] = useState<SubTask[]>([]);
  const [currentSeq, setCurrentSeq] = useState<number>(-1);
  const [stepResults, setStepResults] = useState<{ [seq: number]: string }>({});
  
  // 各步骤的表单数据
  const [douyinUrl, setDouyinUrl] = useState('');
  const [rewriteParams, setRewriteParams] = useState<RewriteParams>({
    content: '',
    styles: '专业',
    tone: '友好',
    extraInstructions: ''
  });
  const [audioParams, setAudioParams] = useState<AudioParams>({
    audioResourceId: null,
    audioFileName: '',
    content: '',
    emotionText: '平静'
  });
  const [videoParams, setVideoParams] = useState<VideoParams>({
    audioResourceId: null,
    audioFileName: '',
    videoResourceId: null,
    videoFileName: '',
    pixelType: PixelType.RATIO_9_16
  });
  const [publishParams, setPublishParams] = useState<PublishParams>({
    videoPath: '',
    title: '',
    description: '',
    videoUrl: '',
    videoResourceId: null
  });

  // 更新步骤状态
  const updateStepStatus = (stepId: WorkflowStep, updates: Partial<WorkflowStepInfo>) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  // 获取当前步骤信息
  const getCurrentStep = () => {
    return workflowSteps.find(step => step.id === currentTab);
  };

  // 获取当前步骤索引
  const getCurrentStepIndex = () => {
    return workflowSteps.findIndex(step => step.id === currentTab);
  };

  // 自动执行下一步
  const autoExecuteNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < workflowSteps.length - 1) {
      const nextStep = workflowSteps[currentIndex + 1];
      
      // 如果是一键合成模式且到了发布步骤，则停止
      if (autoMode === 'auto-synthesis' && nextStep.id === 'publish_video') {
        setAutoMode('manual');
        return;
      }
      
      // 切换到下一个tab并执行
      setTimeout(() => {
        setCurrentTab(nextStep.id);
        executeStep(nextStep.id);
      }, 1000);
    } else {
      setAutoMode('manual');
    }
  };

  // 执行单步骤（使用异步任务流程）
  const executeStep = async (stepId: WorkflowStep) => {
    try {
      // 校验当前步骤参数
      const validationError = validateCurrentStep(stepId);
      if (validationError) {
        updateStepStatus(stepId, { status: 'error', error: validationError });
        return;
      }

      const stepIndex = workflowSteps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) return;
      
      // 获取当前步骤对应的seq
      const currentSeq = Object.keys(SEQ_TO_STEP_ID).find(key => SEQ_TO_STEP_ID[parseInt(key)] === stepId);
      // 执行当前步骤本身
      const startStep = currentSeq ? parseInt(currentSeq) : stepIndex;
      
      updateStepStatus(stepId, { status: 'running' });
      
      // 创建单步任务
      const subTaskDefs = buildSubTasks(startStep, false).slice(0, 1);
      if (subTaskDefs.length === 0) {
        throw new Error('无法创建任务');
      }
      
      const { data: taskData } = await createTask(startStep, subTaskDefs);
      const subTask = taskData.data.subTasks[0];
      
      // 确保使用正确的seq值，而不是依赖subTask.seq
      // 将步骤ID转换为正确的seq
      const correctSeq = Object.keys(SEQ_TO_STEP_ID).find(
        key => SEQ_TO_STEP_ID[parseInt(key)] === stepId
      );
      
      if (!correctSeq) {
        throw new Error(`无法确定步骤 ${stepId} 的序列号`);
      }
      
      const seqNumber = parseInt(correctSeq);
      console.log(`执行步骤: ${stepId}, 正确的seq: ${seqNumber}, 子任务ID: ${subTask.id}`);
      
      // 使用正确的seq值调用executeSubTaskBySeq
      await executeSubTaskBySeq(seqNumber, subTask.id);
      
      // 轮询状态
      const result = await pollSubTaskStatus(subTask.id);
      
      // 保存结果并更新状态
      setStepResults(prev => ({ ...prev, [subTask.seq]: result }));
      updateStepStatus(stepId, { status: 'success', result });
      fillNextStepForm(subTask.seq, result);
      
    } catch (error: any) {
      updateStepStatus(stepId, { status: 'error', error: error.message || '操作失败' });
    }
  };

  // 扫码成功回调
  const handleDouyinScanSuccess = (userInfo: DouyinUserInfo) => {
    setDouyinScanned(true);
    setDouyinUserInfo(userInfo);
  };

  // 校验当前步骤参数
  const validateCurrentStep = (stepId: WorkflowStep): string | null => {
    switch (stepId) {
      case 'parse_video':
        if (!douyinUrl.trim()) {
          return '请输入抖音视频链接';
        }
        break;
      case 'rewrite_content':
        if (!rewriteParams.content.trim()) {
          return '请输入原始文案';
        }
        if (!rewriteParams.styles.trim()) {
          return '请输入风格';
        }
        if (!rewriteParams.tone.trim()) {
          return '请输入语气';
        }
        break;
      case 'synthesize_audio':
        if (!audioParams.audioResourceId) {
          return '请上传参考音色文件';
        }
        if (!audioParams.content.trim()) {
          return '请输入文本内容';
        }
        if (!audioParams.emotionText.trim()) {
          return '请输入情绪描述';
        }
        break;
      case 'synthesize_video':
        if (!videoParams.audioResourceId) {
          return '请上传音频文件';
        }
        if (!videoParams.videoResourceId) {
          return '请上传视频素材文件';
        }
        break;
      case 'publish_video':
        if (!publishParams.videoPath.trim()) {
          return '请输入视频路径';
        }
        if (!douyinScanned) {
          return '请先完成抖音扫码授权';
        }
        break;
    }
    return null;
  };

  // 校验从当前步骤到目标步骤的所有参数
  const validateStepsRange = (fromSeq: number, toSeq: number): string | null => {
    for (let seq = fromSeq; seq <= toSeq; seq++) {
      const stepId = SEQ_TO_STEP_ID[seq];
      if (stepId) {
        const error = validateCurrentStep(stepId);
        if (error) {
          const stepName = WORKFLOW_STEPS.find(s => s.id === stepId)?.name || '未知步骤';
          return `${stepName}: ${error}`;
        }
      }
    }
    return null;
  };

  // === 异步任务核心函数 ===
  
  // 构建子任务数组
  const buildSubTasks = (startStep: number, includePublish: boolean): SubTaskDef[] => {
    const tasks: SubTaskDef[] = [];
    console.log(`构建子任务数组，从步骤 ${startStep} 开始，${includePublish ? '包含' : '不包含'}发布步骤`);
    
    // 只添加从startStep开始的任务
    for (let seq = startStep; seq <= 4; seq++) {
      // 根据序号添加对应的子任务
      switch (seq) {
        case 0:
          tasks.push({ 
            type: SubTaskType.LINK_PARSE, 
            parameter: { link: douyinUrl } 
          });
          console.log('添加任务: 解析视频文案');
          break;
          
        case 1:
          tasks.push({
            type: SubTaskType.COPY_REPRODUCE,
            parameter: {
              content: rewriteParams.content,
              styles: rewriteParams.styles,
              tone: rewriteParams.tone,
              extraInstructions: rewriteParams.extraInstructions
            }
          });
          console.log('添加任务: 重写文案');
          break;
          
        case 2:
          tasks.push({
            type: SubTaskType.TIMBRE_SYNTHESIS,
            parameter: {
              audioResourceId: audioParams.audioResourceId,
              content: audioParams.content,
              emotionText: audioParams.emotionText
            }
          });
          console.log('添加任务: 合成音频');
          break;
          
        case 3:
          tasks.push({
            type: SubTaskType.VIDEO_SYNTHESIS,
            parameter: {
              audioResourceId: videoParams.audioResourceId,
              videoResourceId: videoParams.videoResourceId,
              pixelType: videoParams.pixelType
            }
          });
          console.log('添加任务: 合成视频');
          break;
          
        case 4:
          if (includePublish) {
            tasks.push({
              type: SubTaskType.PUBLISH,
              parameter: {
                videoPath: publishParams.videoPath,
                title: publishParams.title || '',
                description: publishParams.description || ''
              }
            });
            console.log('添加任务: 发布视频');
          }
          break;
      }
      
      // 如果不包含发布且已经到达视频合成，则停止
      if (seq === 3 && !includePublish) {
        break;
      }
    }
    
    console.log(`构建完成，共 ${tasks.length} 个子任务`);
    return tasks;
  };

  // 执行指定seq的子任务
  const executeSubTaskBySeq = async (seq: number, subTaskId: number, previousResults?: { [key: number]: string }) => {
    // 根据SubTaskType枚举执行对应的API
    // LINK_PARSE = 'LINK_PARSE',           // 链接解析文案 (seq=0)
    // COPY_REPRODUCE = 'COPY_REPRODUCE',   // 文案复刻（重写）(seq=1)
    // TIMBRE_SYNTHESIS = 'TIMBRE_SYNTHESIS', // 音色合成 (seq=2)
    // VIDEO_SYNTHESIS = 'VIDEO_SYNTHESIS',  // 视频合成 (seq=3)
    // PUBLISH = 'PUBLISH'                   // 发布 (seq=4)
    
    // 合并当前保存的结果和传入的结果
    const allResults = { ...stepResults, ...previousResults };
    
    console.log(`执行子任务: seq=${seq}, subTaskId=${subTaskId}`);
    
    // 直接使用传入的seq作为步骤序号，不再依赖当前显示的步骤
    // 这样可以确保只执行正确的步骤，而不会受到当前显示步骤的影响
    switch (seq) {
      case 0: // 链接解析
        await linkParse(subTaskId, douyinUrl);
        break;
      case 1: // 文案重写
        const content = allResults[0] || rewriteParams.content;
        await rewrite(subTaskId, content, rewriteParams.styles, rewriteParams.tone, rewriteParams.extraInstructions);
        break;
      case 2: // 音频合成
        const textContent = allResults[1] || audioParams.content;
        if (!audioParams.audioResourceId) throw new Error('请上传参考音色文件');
        await timbreSynthesis(subTaskId, audioParams.audioResourceId, textContent, audioParams.emotionText);
        break;
      case 3: // 视频合成
        // 尝试从前一步结果中获取音频资源ID
        let audioResourceId = videoParams.audioResourceId;
        
        // 如果是一键合成流程，尝试从前一步结果中解析音频资源ID
        if (allResults[seq-1] && !audioResourceId) {
          try {
            const result = allResults[seq-1];
            // 尝试解析结果中的资源ID
            try {
              const resultObj = JSON.parse(result);
              if (resultObj.resourceId || resultObj.id) {
                audioResourceId = resultObj.resourceId || resultObj.id;
                console.log('从结果中解析到音频资源ID:', audioResourceId);
              }
            } catch {
              // 如果不是JSON，尝试从URL中提取ID
              const match = result.match(/\/resource\/(\d+)/);
              if (match) {
                audioResourceId = parseInt(match[1]);
                console.log('从URL中提取到音频资源ID:', audioResourceId);
              }
            }
          } catch (error) {
            console.error('解析音频资源ID失败:', error);
          }
        }
        
        // 第三步是音频合成，不需要视频资源ID
        if (!audioResourceId) throw new Error('请上传音频文件或等待音频合成完成');
        
        console.log('执行视频合成，使用音频资源ID:', audioResourceId);
        await videoSynthesis(subTaskId, audioResourceId, videoParams.videoResourceId || 0, videoParams.pixelType);
        break;
      case 4: // 发布视频
        const videoPath = allResults[seq-1] || publishParams.videoPath;
        if (!douyinScanned) throw new Error('请先完成抖音扫码授权');
        await publish(subTaskId, videoPath, publishParams.title, publishParams.description);
        break;
      default:
        throw new Error(`未知的任务序号: ${seq}`);
    }
  };

  // 轮询子任务状态
  const pollSubTaskStatus = (subTaskId: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const { data } = await checkSubTask(subTaskId);
          
          if (data.data.status === TaskStatus.SUCCESS) {
            clearInterval(interval);
            // 直接使用API返回的result和resourceId
            const result = data.data.result || '';
            const resourceId = data.data.resourceId;
            console.log(`子任务 ${subTaskId} 成功完成，结果路径:`, result, '资源ID:', resourceId);
            
            // 构建结果对象，包含result和resourceId
            const resultObj = {
              result: result,
              resourceId: resourceId
            };
            
            // 返回JSON字符串，方便后续处理
            resolve(JSON.stringify(resultObj));
          } else if (data.data.status === TaskStatus.FAILED) {
            clearInterval(interval);
            console.error(`子任务 ${subTaskId} 执行失败`);
            reject(new Error('任务执行失败'));
          } else {
            console.log(`子任务 ${subTaskId} 状态:`, data.data.status);
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 2000);
    });
  };

  // 更新步骤状态通过seq
  const updateStepStatusBySeq = (seq: number, status: StepStatus, error?: string, result?: string) => {
    // 直接使用传入的seq作为步骤序号，不再依赖当前显示的步骤
    // 这样可以确保只更新正在执行的步骤的状态，而不会影响其他步骤
    const stepId = SEQ_TO_STEP_ID[seq];
    if (stepId) {
      console.log(`更新步骤 ${stepId} (seq=${seq}) 的状态为 ${status}`);
      updateStepStatus(stepId, { status, error, result });
    } else {
      console.error(`无法找到序号 ${seq} 对应的步骤ID`);
    }
  };

  // 填充下一步表单
  const fillNextStepForm = (seq: number, result: string) => {
    switch (seq) {
      case 0:
        setRewriteParams(prev => ({ ...prev, content: result }));
        break;
      case 1:
        setAudioParams(prev => ({ ...prev, content: result }));
        break;
      case 2:
        try {
          // 音频合成结果包含资源ID和结果路径
          let audioResourceId: number | null = null;
          let audioResultPath: string | null = null;
          
          if (result) {
            try {
              // 解析JSON字符串获取resourceId和result
              const resultObj = JSON.parse(result);
              audioResourceId = resultObj.resourceId;
              audioResultPath = resultObj.result;
              console.log('从JSON中解析到音频资源ID:', audioResourceId, '结果路径:', audioResultPath);
              
              // 构建完整的音频URL
              let audioUrl: string | null = null;
              if (audioResultPath) {
                // 直接使用返回的相对路径拼接
                audioUrl = `http://localhost:3000/resources${audioResultPath}`;
                console.log('构建音频完整URL:', audioUrl);
              }
              
              if (audioResourceId) {
                setVideoParams(prev => ({ 
                  ...prev, 
                  audioResourceId: audioResourceId,
                  audioFileName: `音频合成结果-${audioResourceId}`,
                  audioUrl: audioUrl
                }));
              }
            } catch (parseError) {
              console.error('解析音频合成结果JSON失败:', parseError);
              // 如果不是JSON，尝试直接使用result作为路径
              setVideoParams(prev => ({ 
                ...prev, 
                audioPath: result
              }));
            }
          }
        } catch (error) {
          console.error('处理音频合成结果失败:', error);
        }
        break;
      case 3:
        try {
          // 视频合成结果包含资源ID和结果路径
          let videoResourceId: number | null = null;
          let videoResultPath: string | null = null;
          
          if (result) {
            try {
              // 解析JSON字符串获取resourceId和result
              const resultObj = JSON.parse(result);
              videoResourceId = resultObj.resourceId;
              videoResultPath = resultObj.result;
              console.log('从JSON中解析到视频资源ID:', videoResourceId, '结果路径:', videoResultPath);
              
              // 构建完整的视频URL
              let videoUrl: string | null = null;
              if (videoResultPath) {
                // 直接使用返回的相对路径拼接
                videoUrl = `http://localhost:3000/resources${videoResultPath}`;
                console.log('构建视频完整URL:', videoUrl);
                
                // 更新发布参数
                setPublishParams(prev => ({ 
                  ...prev, 
                  videoPath: videoResultPath || '',
                  videoUrl: videoUrl || '',
                  videoResourceId: videoResourceId
                }));
              } else if (videoResourceId) {
                setPublishParams(prev => ({ 
                  ...prev, 
                  videoPath: result || '',
                  videoResourceId: videoResourceId
                }));
              }
            } catch (parseError) {
              console.error('解析视频合成结果JSON失败:', parseError);
              // 如果不是JSON，尝试直接使用result作为路径
              setPublishParams(prev => ({ ...prev, videoPath: result || '' }));
            }
          }
        } catch (error) {
          console.error('处理视频合成结果失败:', error);
          setPublishParams(prev => ({ ...prev, videoPath: result || '' }));
        }
        break;
    }
  };

  // 运行自动工作流
  const runAutoWorkflow = async (mode: 'synthesis' | 'publish') => {
    try {
      setAutoMode(mode === 'synthesis' ? 'auto-synthesis' : 'auto-publish');
      
      // 获取当前步骤的序号
      const currentStep = getCurrentStep();
      if (!currentStep) {
        console.error('无法获取当前步骤');
        return;
      }
      
      // 查找当前步骤对应的seq值
      const currentSeq = Object.entries(SEQ_TO_STEP_ID).find(([seq, id]) => id === currentStep.id)?.[0];
      if (!currentSeq) {
        console.error('无法找到当前步骤对应的序号');
        return;
      }
      
      // 从当前步骤开始执行，包含当前步骤
      const startStep = parseInt(currentSeq);
      console.log(`从步骤 ${startStep} (${currentStep.name}) 开始执行`);
      
      const includePublish = mode === 'publish';
      
      // 只校验当前步骤的参数，后续步骤的参数可以通过前一步结果自动填充
      const currentStepValidationError = validateCurrentStep(currentStep.id);
      if (currentStepValidationError) {
        setAutoMode('manual');
        updateStepStatus(currentStep.id, { status: 'error', error: currentStepValidationError });
        return;
      }
      
      // 1. 构建子任务数组
      const subTaskDefs = buildSubTasks(startStep, includePublish);
      
      // 2. 创建任务
      const { data: taskData } = await createTask(startStep, subTaskDefs);
      setMainTaskId(taskData.data.id);
      setSubTaskIds(taskData.data.subTasks);
      
      // 3. 依次执行每个子任务
      const tempResults: { [key: number]: string } = {};
      
      // 将当前步骤的序号映射到工作流步骤的实际序号
      const workflowSeqMap: { [key: number]: number } = {};
      for (let i = 0; i < taskData.data.subTasks.length; i++) {
        const subTask = taskData.data.subTasks[i];
        // 子任务的序号是相对于开始步骤的，需要映射到工作流的绝对序号
        workflowSeqMap[subTask.seq] = startStep + i;
      }
      
      console.log('工作流序号映射:', workflowSeqMap);
      
      for (let i = 0; i < taskData.data.subTasks.length; i++) {
        const subTask = taskData.data.subTasks[i];
        const seq = subTask.seq;
        // 获取当前子任务对应的工作流步骤序号
        const workflowSeq = workflowSeqMap[seq];
        
        console.log(`执行子任务: 子任务序号=${seq}, 工作流序号=${workflowSeq}, 子任务ID=${subTask.id}`);
        
        setCurrentSeq(seq);
        // 使用工作流序号更新对应步骤的状态
        updateStepStatusBySeq(workflowSeq, 'running');
        
        // 执行子任务，传递之前的临时结果
        await executeSubTaskBySeq(seq, subTask.id, tempResults);
        
        // 轮询状态直到完成
        const result = await pollSubTaskStatus(subTask.id);
        
        // 保存结果到临时结果和状态中
        tempResults[seq] = result;
        setStepResults(prev => ({ ...prev, [seq]: result }));
        updateStepStatusBySeq(workflowSeq, 'success', undefined, result);
        
        // 特殊处理音频合成结果
        if (workflowSeq === 2) {
          try {
            console.log('处理音频合成结果:', result);
            // 尝试解析结果中的资源ID
            let audioResourceId: number | null = null;
            let audioResultPath: string | null = null;
            
            try {
              const resultObj = JSON.parse(result);
              audioResourceId = resultObj.resourceId;
              audioResultPath = resultObj.result;
              console.log('从JSON中解析到音频资源ID:', audioResourceId, '结果路径:', audioResultPath);
            } catch {
              // 如果不是JSON，尝试从URL中提取ID
              const match = result.match(/\/resource\/(\d+)/);
              if (match) {
                audioResourceId = parseInt(match[1]);
                console.log('从URL中提取到音频资源ID:', audioResourceId);
              } else {
                console.log('无法从结果中提取音频资源ID');
              }
            }
            
            // 构建完整的音频URL
            let audioUrl: string | null = null;
            if (audioResultPath) {
              audioUrl = `http://localhost:3000/resources${audioResultPath}`;
              console.log('构建音频完整URL:', audioUrl);
            }
            
            if (audioResourceId) {
              // 更新视频参数中的音频资源ID和URL
              setVideoParams(prev => ({
                ...prev,
                audioResourceId: audioResourceId,
                audioFileName: `音频合成结果-${audioResourceId}`,
                audioUrl: audioUrl
              }));
              console.log('已更新视频参数中的音频资源ID:', audioResourceId);
            }
          } catch (error) {
            console.error('处理音频合成结果失败:', error);
          }
        }
        
        // 自动填充到下一步
        if (i < taskData.data.subTasks.length - 1) {
          fillNextStepForm(workflowSeq, result);
        }
      }
      
      setAutoMode('manual');
    } catch (error: any) {
      console.error('执行工作流出错:', error);
      // 直接更新当前步骤的状态
      const currentStep = getCurrentStep();
      if (currentStep) {
        updateStepStatus(currentStep.id, { status: 'error', error: error.message });
      }
      setAutoMode('manual');
    }
  };

  // 检查后续步骤所需的素材是否已上传
  const checkMaterialsForWorkflow = (currentStepId: string, mode: 'synthesis' | 'publish'): boolean => {
    // 获取当前步骤序号
    const currentSeqStr = Object.entries(SEQ_TO_STEP_ID).find(([seq, id]) => id === currentStepId)?.[0];
    if (!currentSeqStr) return false;
    
    const currentSeq = parseInt(currentSeqStr);
    console.log(`检查从步骤 ${currentSeq} (${currentStepId}) 开始的工作流所需素材`);
    
    // 如果当前步骤是合成音频，检查是否已上传参考音色
    if (currentStepId === 'synthesize_audio' && !audioParams.audioResourceId) {
      alert('请先上传参考音色文件，再点击一键' + (mode === 'synthesis' ? '合成' : '发布'));
      return false;
    }
    
    // 如果当前步骤是合成视频，检查是否已上传音频和视频素材
    if (currentStepId === 'synthesize_video') {
      if (!videoParams.audioResourceId) {
        alert('请先上传音频文件，再点击一键' + (mode === 'synthesis' ? '合成' : '发布'));
        return false;
      }
      if (!videoParams.videoResourceId) {
        alert('请先上传视频素材文件，再点击一键' + (mode === 'synthesis' ? '合成' : '发布'));
        return false;
      }
    }
    
    // 如果当前步骤是合成音频之前的步骤，但工作流会执行到合成视频，检查视频素材
    if (currentSeq < 3 && (mode === 'synthesis' || mode === 'publish')) {
      // 检查视频素材是否已上传
      if (!videoParams.videoResourceId) {
        alert('请先上传视频素材文件（在"合成视频"步骤），再点击一键' + (mode === 'synthesis' ? '合成' : '发布'));
        return false;
      }
    }
    
    return true;
  };

  // 一键合成（到视频合成为止）
  const handleAutoSynthesis = () => {
    // 获取当前步骤
    const currentStep = getCurrentStep();
    if (!currentStep) return;
    
    // 检查所需素材
    if (!checkMaterialsForWorkflow(currentStep.id, 'synthesis')) {
      return;
    }
    
    runAutoWorkflow('synthesis');
  };

  // 一键发布（自动执行所有步骤）
  const handleAutoPublish = () => {
    // 获取当前步骤
    const currentStep = getCurrentStep();
    if (!currentStep) return;
    
    // 检查所需素材
    if (!checkMaterialsForWorkflow(currentStep.id, 'publish')) {
      return;
    }
    
    runAutoWorkflow('publish');
  };

  // 获取步骤状态文本
  const getStepStatusText = (status: StepStatus) => {
    switch (status) {
      case 'pending': return '待执行';
      case 'running': return '执行中...';
      case 'success': return '✓ 已完成';
      case 'error': return '✗ 执行失败';
      default: return '';
    }
  };

  // 渲染当前Tab的内容
  const renderTabContent = () => {
    const step = getCurrentStep();
    if (!step) return null;

    switch (step.id) {

      case 'parse_video':
        return (
          <>
            <HintBox>
              <strong>💡 操作提示：</strong> 输入抖音视频分享链接，系统将自动解析视频中的文案内容。
            </HintBox>
            <FormGroup>
              <Label>抖音视频链接 *</Label>
              <Input
                type="text"
                placeholder="https://v.douyin.com/..."
                value={douyinUrl}
                onChange={(e) => setDouyinUrl(e.target.value)}
                disabled={step.status === 'running'}
                required
              />
            </FormGroup>
            {step.status === 'running' && <LoadingSpinner />}
            {step.result && (
              <ResultBox>
                <Label>解析结果</Label>
                <pre>{step.result}</pre>
              </ResultBox>
            )}
            {step.error && <ErrorBox>❌ {step.error}</ErrorBox>}
          </>
        );

      case 'rewrite_content':
        return (
          <>
            <HintBox>
              <strong>💡 操作提示：</strong> 根据原始文案，设置期望的风格和语气，AI将智能重写文案内容。
            </HintBox>
            <FormGroup>
              <Label>原始文案 *</Label>
              <TextArea
                value={rewriteParams.content}
                onChange={(e) => setRewriteParams(prev => ({ ...prev, content: e.target.value }))}
                placeholder="输入或从上一步自动获取文案"
                disabled={step.status === 'running'}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>风格 *</Label>
              <Input
                type="text"
                value={rewriteParams.styles}
                onChange={(e) => setRewriteParams(prev => ({ ...prev, styles: e.target.value }))}
                placeholder="例如：专业、轻松、幽默"
                disabled={step.status === 'running'}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>语气 *</Label>
              <Input
                type="text"
                value={rewriteParams.tone}
                onChange={(e) => setRewriteParams(prev => ({ ...prev, tone: e.target.value }))}
                placeholder="例如：友好、正式、活泼"
                disabled={step.status === 'running'}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>附加要求（可选）</Label>
              <TextArea
                value={rewriteParams.extraInstructions}
                onChange={(e) => setRewriteParams(prev => ({ ...prev, extraInstructions: e.target.value }))}
                placeholder="例如：需要包含特定关键词、控制字数等"
                disabled={step.status === 'running'}
              />
            </FormGroup>
            {step.status === 'running' && <LoadingSpinner />}
            {step.result && (
              <ResultBox>
                <Label>重写结果</Label>
                <pre>{step.result}</pre>
              </ResultBox>
            )}
            {step.error && <ErrorBox>❌ {step.error}</ErrorBox>}
          </>
        );

      case 'synthesize_audio':
        return (
          <>
            <HintBox>
              <strong>💡 操作提示：</strong> 选择参考音色，系统将使用AI语音合成技术生成音频文件。
            </HintBox>
            <FormGroup>
              <Label>参考音色 *</Label>
              {audioParams.audioFileName && (
                <div style={{ marginBottom: '8px', color: theme.colors.success }}>
                  已上传：{audioParams.audioFileName}
                </div>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const { data } = await uploadFile(file);
                      if (data.code === 0) {
                        setAudioParams(prev => ({ 
                          ...prev, 
                          audioResourceId: data.data.id,
                          audioFileName: file.name
                        }));
                        alert('音频上传成功');
                      } else {
                        alert('音频上传失败：' + data.message);
                      }
                    } catch (error: any) {
                      alert('音频上传失败：' + error.message);
                    }
                  }
                }}
                disabled={step.status === 'running'}
                style={{ fontSize: '14px' }}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>文本内容 *</Label>
              <TextArea
                value={audioParams.content}
                onChange={(e) => setAudioParams(prev => ({ ...prev, content: e.target.value }))}
                placeholder="输入或从上一步自动获取文案"
                disabled={step.status === 'running'}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>情绪描述 *</Label>
              <Input
                type="text"
                value={audioParams.emotionText}
                onChange={(e) => setAudioParams(prev => ({ ...prev, emotionText: e.target.value }))}
                placeholder="例如：平静、激动、温柔"
                disabled={step.status === 'running'}
                required
              />
            </FormGroup>
            {step.status === 'running' && <LoadingSpinner />}
            {step.result && (
              <ResultBox>
                <Label>音频预览</Label>
                {(() => {
                  // 解析结果获取正确的音频URL
                  try {
                    const resultObj = JSON.parse(step.result);
                    if (resultObj.result) {
                      const audioUrl = `http://localhost:3000/resources${resultObj.result}`;
                      return <audio controls src={audioUrl} style={{ width: '100%', marginTop: theme.spacing.md }} />;
                    }
                  } catch (e) {
                    // 如果解析失败，尝试直接使用result作为URL
                    return <audio controls src={step.result} style={{ width: '100%', marginTop: theme.spacing.md }} />;
                  }
                })()}
              </ResultBox>
            )}
            {step.error && <ErrorBox>❌ {step.error}</ErrorBox>}
          </>
        );

      case 'synthesize_video':
        return (
          <>
            <HintBox>
              <strong>💡 操作提示：</strong> 上传视频素材，选择画面比例，系统将自动合成音频和视频。
            </HintBox>
            <FormGroup>
              <Label>音频文件 *</Label>
              {videoParams.audioFileName && (
                <div style={{ marginBottom: '8px', color: theme.colors.success }}>
                  已上传：{videoParams.audioFileName}
                </div>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const { data } = await uploadFile(file);
                      if (data.code === 0) {
                        setVideoParams(prev => ({ 
                          ...prev, 
                          audioResourceId: data.data.id,
                          audioFileName: file.name
                        }));
                        alert('音频上传成功');
                      } else {
                        alert('音频上传失败：' + data.message);
                      }
                    } catch (error: any) {
                      alert('音频上传失败：' + error.message);
                    }
                  }
                }}
                disabled={step.status === 'running'}
                style={{ fontSize: '14px' }}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>视频素材 *</Label>
              {videoParams.videoFileName && (
                <div style={{ marginBottom: '8px', color: theme.colors.success }}>
                  已上传：{videoParams.videoFileName}
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const { data } = await uploadFile(file);
                      if (data.code === 0) {
                        setVideoParams(prev => ({ 
                          ...prev, 
                          videoResourceId: data.data.id,
                          videoFileName: file.name
                        }));
                        alert('视频上传成功');
                      } else {
                        alert('视频上传失败：' + data.message);
                      }
                    } catch (error: any) {
                      alert('视频上传失败：' + error.message);
                    }
                  }
                }}
                disabled={step.status === 'running'}
                style={{ fontSize: '14px' }}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>画面比例</Label>
              <Select
                value={videoParams.pixelType}
                onChange={(e) => setVideoParams(prev => ({ ...prev, pixelType: e.target.value as PixelType }))}
                disabled={step.status === 'running'}
              >
                <option value={PixelType.RATIO_9_16}>9:16 (竖屏 - 抖音推荐)</option>
                <option value={PixelType.RATIO_16_9}>16:9 (横屏)</option>
                <option value={PixelType.RATIO_1_1}>1:1 (正方形)</option>
              </Select>
            </FormGroup>
            {step.status === 'running' && <LoadingSpinner />}
            {step.result && (
              <ResultBox>
                <Label>视频预览</Label>
                {(() => {
                  // 解析结果获取正确的视频URL
                  try {
                    const resultObj = JSON.parse(step.result);
                    if (resultObj.result) {
                      const videoUrl = `http://localhost:3000/resources${resultObj.result}`;
                      return <video controls src={videoUrl} style={{ width: '100%', maxHeight: '400px', marginTop: theme.spacing.md }} />;
                    }
                  } catch (e) {
                    // 如果解析失败，尝试直接使用result作为URL
                    return <video controls src={step.result} style={{ width: '100%', maxHeight: '400px', marginTop: theme.spacing.md }} />;
                  }
                })()}
              </ResultBox>
            )}
            {step.error && <ErrorBox>❌ {step.error}</ErrorBox>}
          </>
        );

      case 'publish_video':
        return (
          <>
            <HintBox>
              <strong>💡 操作提示：</strong> 先完成抖音扫码授权，然后设置视频标题和描述（可选），最后点击发布按钮将视频上传到抖音平台。
            </HintBox>
            
            {/* 扫码区域 */}
            <FormGroup>
              <Label>抖音账号授权</Label>
              {!douyinScanned ? (
                <QRScannerWrapper>
                  <DouyinQRScanner
                    onScanSuccess={handleDouyinScanSuccess}
                    onScanStatusChange={setDouyinScanned}
                  />
                </QRScannerWrapper>
              ) : (
                <ResultBox>
                  <Label>已授权账号</Label>
                  <pre>✅ {douyinUserInfo?.nickname}</pre>
                </ResultBox>
              )}
            </FormGroup>
            
            {/* 发布表单 */}
            <FormGroup>
              <Label>视频路径</Label>
              <Input
                type="text"
                value={publishParams.videoPath}
                onChange={(e) => setPublishParams(prev => ({ ...prev, videoPath: e.target.value }))}
                placeholder="待发布视频路径（自动从上一步获取）"
                disabled={step.status === 'running' || !douyinScanned}
              />
            </FormGroup>
            <FormGroup>
              <Label>标题（可选）</Label>
              <Input
                type="text"
                value={publishParams.title || ''}
                onChange={(e) => setPublishParams(prev => ({ ...prev, title: e.target.value }))}
                placeholder="视频标题"
                disabled={step.status === 'running' || !douyinScanned}
              />
            </FormGroup>
            <FormGroup>
              <Label>描述（可选）</Label>
              <TextArea
                value={publishParams.description || ''}
                onChange={(e) => setPublishParams(prev => ({ ...prev, description: e.target.value }))}
                placeholder="视频描述"
                disabled={step.status === 'running' || !douyinScanned}
              />
            </FormGroup>
            {step.status === 'running' && <LoadingSpinner />}
            {step.result && (
              <ResultBox>
                <Label>发布状态</Label>
                <pre>✅ 发布成功！视频已上传到抖音平台</pre>
              </ResultBox>
            )}
            {step.error && <ErrorBox>❌ {step.error}</ErrorBox>}
          </>
        );

      default:
        return null;
    }
  };

  const currentStep = getCurrentStep();

  return (
    <PageContainer>
      <GridBackground />
      <Container>
        <Title>智能视频创作工作流</Title>
        
        {/* Tab导航 */}
        <TabNav>
          {workflowSteps.map((step, index) => (
            <TabButton
              key={step.id}
              $active={currentTab === step.id}
              $status={step.status}
              onClick={() => setCurrentTab(step.id)}
            >
              <TabStepNumber $status={step.status}>
                {step.status === 'success' ? '✓' : index + 1}
              </TabStepNumber>
              <div>
                <div>{step.name}</div>
                {currentTab !== step.id && (
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    {getStepStatusText(step.status)}
                  </div>
                )}
              </div>
            </TabButton>
          ))}
        </TabNav>
        
        {/* Tab内容 */}
        <TabContent>
          {currentStep && (
            <>
              <StepHeader>
                <StepTitle>{currentStep.name}</StepTitle>
                <StepDescription>{currentStep.description}</StepDescription>
                <StatusBadge $status={currentStep.status}>
                  {getStepStatusText(currentStep.status)}
                </StatusBadge>
              </StepHeader>
              
              <ContentRow>
                {/* 左侧：内容区 */}
                <MainContent>
                  {renderTabContent()}
                </MainContent>
                
                {/* 右侧：按钮区 */}
                <Sidebar>
                  <Button
                    onClick={() => executeStep(currentStep.id)}
                    disabled={currentStep.status === 'running' || autoMode !== 'manual'}
                  >
                    {currentStep.status === 'running' ? '执行中...' : '执行此步骤'}
                  </Button>
                  
                  <Button
                    onClick={handleAutoSynthesis}
                    disabled={autoMode !== 'manual' || currentStep.status === 'running'}
                  >
                    {autoMode === 'auto-synthesis' ? '合成中...' : '一键合成'}
                  </Button>
                  
                  <Button
                    onClick={handleAutoPublish}
                    disabled={autoMode !== 'manual' || currentStep.status === 'running'}
                  >
                    {autoMode === 'auto-publish' ? '发布中...' : '一键发布'}
                  </Button>
                  
                  {autoMode !== 'manual' && (
                    <Button
                      $variant="danger"
                      onClick={() => setAutoMode('manual')}
                    >
                      停止执行
                    </Button>
                  )}
                  
                  {currentStep.status === 'error' && (
                    <Button
                      $variant="danger"
                      onClick={() => updateStepStatus(currentStep.id, { status: 'pending', error: undefined })}
                    >
                      重置
                    </Button>
                  )}
                </Sidebar>
              </ContentRow>
            </>
          )}
        </TabContent>
      </Container>
    </PageContainer>
  );
}

export default function WorkflowPageWithAuth() {
  return (
    <AuthGuard>
      <WorkflowPage />
    </AuthGuard>
  );
}