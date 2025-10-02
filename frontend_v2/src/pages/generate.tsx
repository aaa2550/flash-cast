import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { startClone, fetchCloneStatus, cancelClone, CloneStepStatus } from '../services/clone';
// voice 相关：创建 + 状态 + 试听 URL 构造
import { VoiceOption, startVoiceCreation, getVoiceStatus, cancelVoiceTask, getVoiceSampleUrl } from '../services/voice';
import { fetchAudioResources, ResourceItem, uploadAudioResource } from '../services/resource';
import { FileUploadBox } from '../components/FileUploadBox';
import { NeonDropdown } from '../components/NeonDropdown';
import { DouyinQRScanner } from '../components/DouyinQRScanner';
import { DouyinUserInfo } from '../services/api';

// ---- Layout & Style ----
const Page = styled.div`min-height:100vh;display:flex;flex-direction:column;background:${theme.colors.bgDeep};color:${theme.colors.text};position:relative;overflow:hidden;`;
const Grid = styled.div`position:absolute;inset:0;opacity:.15;background-image:linear-gradient(${theme.colors.border} 1px,transparent 1px),linear-gradient(to right,${theme.colors.border} 1px,transparent 1px);background-size:40px 40px;pointer-events:none;`;
const Container = styled.div`width:100%;max-width:1400px;margin:0 auto;padding:${theme.spacing.xl} ${theme.spacing.xl} 160px;position:relative;z-index:1;`; 
const Title = styled.h1`font-size:${theme.typography.h1};color:${theme.colors.primary};text-shadow:${theme.shadows.glow};margin-bottom:${theme.spacing.lg};`;
const Flex = styled.div`display:grid;grid-template-columns:1fr 400px 1fr;gap:${theme.spacing.xl};align-items:start;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.div`background:${theme.colors.bgSlight};border:1px solid ${theme.colors.border};border-radius:${theme.radius.lg};padding:${theme.spacing.lg};position:relative;min-height:520px;display:flex;flex-direction:column;`;
const Label = styled.label`display:block;font-size:.8rem;margin-bottom:${theme.spacing.xs};color:${theme.colors.textSecondary};letter-spacing:.5px;`;
const Input = styled.input`width:100%;background:${theme.colors.bgDeep};border:1px solid ${theme.colors.border};border-radius:${theme.radius.sm};padding:${theme.spacing.sm} ${theme.spacing.md};color:${theme.colors.text};font-family:${theme.typography.fontFamily};margin-bottom:${theme.spacing.md};&:focus{outline:none;border-color:${theme.colors.primary};box-shadow:${theme.shadows.glow};}`;
// 移除原生 Select/UploadBox，使用独立组件
const Button = styled.button<{secondary?:boolean}>`width:100%;padding:${theme.spacing.md};margin-top:${theme.spacing.sm};border:none;border-radius:${theme.radius.sm};cursor:pointer;font-weight:bold;font-family:${theme.typography.fontFamily};background:${p=>p.secondary?theme.colors.bgDeep:`linear-gradient(90deg,${theme.colors.primary},${theme.colors.secondary})`};color:${p=>p.secondary?theme.colors.primary:theme.colors.white};opacity:${p=>p.disabled?0.5:1};transition:.3s;position:relative;overflow:hidden; &:hover:not(:disabled){box-shadow:${theme.shadows.glow};}`;
const StepsWrap = styled.div`display:flex;flex-direction:column;gap:${theme.spacing.sm};margin-top:${theme.spacing.md};`;
const StepRow = styled.div<{state:string}>`display:flex;align-items:center;gap:${theme.spacing.md};padding:${theme.spacing.sm} ${theme.spacing.md};background:${theme.colors.bgDeep};border:1px solid ${theme.colors.border};border-left:4px solid ${p=>p.state==='success'?theme.colors.success:p.state==='failed'?theme.colors.error:p.state==='running'?theme.colors.primary:theme.colors.border};border-radius:${theme.radius.sm};`;
const ProgressBarOuter = styled.div`flex:1;height:8px;background:${theme.colors.bgSlight};border-radius:4px;overflow:hidden;`;
// (预留动画，可用于条纹进度) const progressAnim = keyframes`from{transform:translateX(-100%);}to{transform:translateX(0);}`;
const ProgressBarInner = styled.div<{w:number;state:string}>`height:100%;width:${p=>p.w}%;background:${p=>p.state==='failed'?theme.colors.error:theme.colors.primary};box-shadow:0 0 6px currentColor;transition:width .4s;`;
const StatusText = styled.span`font-size:.7rem;color:${theme.colors.textSecondary};min-width:60px;text-align:right;`;
const ErrorMsg = styled.div`margin-top:${theme.spacing.sm};color:${theme.colors.error};min-height:1.2rem;font-size:.85rem;`;

const StatusIndicator = styled.div<{ $status: 'pending' | 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  background: ${theme.colors.bgDeep};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${theme.radius.sm};
  color: ${props => {
    switch (props.$status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  }};
  font-size: 0.9rem;
`;
const ResultBox = styled.div`margin-top:${theme.spacing.lg};padding:${theme.spacing.md};border:1px solid ${theme.colors.border};background:${theme.colors.bgDeep};border-radius:${theme.radius.md};display:flex;flex-direction:column;gap:${theme.spacing.sm};`;
const LinkA = styled.a`color:${theme.colors.primary};text-decoration:none;&:hover{text-decoration:underline;}`;
// 视频预览盒子：固定最大尺寸，按原始比例 contain 缩放
const VideoBox = styled.div<{ratio:number}>`
  width:100%;
  max-width:320px;
  /* 通过内边距占位比率 (H/W * 100%) */
  position:relative;
  margin-top:8px;
  border:1px solid ${theme.colors.border};
  border-radius:8px;
  background:#000;
  aspect-ratio:${p=>p.ratio? p.ratio : 16/9};
  display:flex;align-items:center;justify-content:center;overflow:hidden;
  box-shadow:0 0 0 1px rgba(255,255,255,0.04);
  video{width:100%;height:100%;object-fit:contain;}
`;

// ---- Component ----
export default function GeneratePage(){
  const [douyinUrl,setDouyinUrl] = useState('');
  const [modelVideo,setModelVideo] = useState<File|null>(null);
  const [modelVideoUrl,setModelVideoUrl] = useState<string>('');
  const [modelVideoThumb,setModelVideoThumb] = useState<string>('');
  const [videoAspect,setVideoAspect] = useState<number>(16/9); // 默认 16:9
  // 克隆任务相关状态
  const [taskId,setTaskId] = useState<string>('');
  const [steps,setSteps] = useState<CloneStepStatus[]>([]);
  const [overall,setOverall] = useState<'idle'|'running'|'success'|'failed'>('idle');
  const [error,setError] = useState<string>('');
  const [downUrl,setDownUrl] = useState<string>('');
  const [shareUrl,setShareUrl] = useState<string>('');
  // 下拉音色列表（含“创建”占位项）
  const [voiceOptions,setVoiceOptions] = useState<VoiceOption[]>([{ id: 'create_new', name: '＋ 创建自定义音色', type: 'creating', disabled: false }]);
  const [selectedVoiceId,setSelectedVoiceId] = useState<string>('');
  const [loadingVoices,setLoadingVoices] = useState<boolean>(false);
  const [voiceLoadError,setVoiceLoadError] = useState<string>('');
  const [audioResources,setAudioResources] = useState<ResourceItem[]>([]); // 保存原始后端资源
  const [showCreateVoice,setShowCreateVoice] = useState<boolean>(false);
  // 自定义音色创建相关
  const [voiceFile,setVoiceFile] = useState<File|null>(null);
  const [voiceProgress,setVoiceProgress] = useState<number>(0); // 上传进度
  const [voiceCreating,setVoiceCreating] = useState<boolean>(false); // 上传中
  const [voiceCreateError,setVoiceCreateError] = useState<string>('');
  // 试听播放相关
  const [playingVoiceId,setPlayingVoiceId] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const voiceTimerRef = useRef<NodeJS.Timeout|null>(null); // 已不再使用轮询，保留引用避免报错
  const timerRef = useRef<NodeJS.Timeout|null>(null);
  const intervalRef = useRef<number>(2000); // 动态间隔
  const attemptRef = useRef<number>(0); // 失败次数
  const cancelledRef = useRef<boolean>(false);
  const uploadingRef = useRef<boolean>(false);
  // 抖音扫码相关状态
  const [douyinScanned, setDouyinScanned] = useState<boolean>(false);
  const [douyinUserInfo, setDouyinUserInfo] = useState<DouyinUserInfo | null>(null);

  // 假设：上传模特视频到对象存储获得 URL，这里先模拟
  async function mockUpload(file: File){
    uploadingRef.current = true;
    await new Promise(r=>setTimeout(r,1000));
    uploadingRef.current = false;
    return URL.createObjectURL(file); // 演示用，真实应返回后端给的永久链接
  }

  const resetState = () => { setSteps([]); setOverall('idle'); setError(''); setDownUrl(''); setShareUrl(''); setTaskId(''); };

  // ============================== 拉取后端音色列表 ==============================
  useEffect(()=>{
    const load = async ()=>{
      setLoadingVoices(true); setVoiceLoadError('');
      try {
        const { data } = await fetchAudioResources();
        if(data.code!==0) { throw new Error(data.message||'获取音色失败'); }
        const list = (data.data||[]) as ResourceItem[];
        // 直接映射为 VoiceOption；后端 path 通过 getVoiceSampleUrl(id) 统一转换
  setAudioResources(list);
  const opts: VoiceOption[] = list.map(r=>({ id: String(r.id), name: r.name || `音色${r.id}`, type:'preset' }));
        setVoiceOptions(prev=>{ const createOpt = prev.find(p=>p.id==='create_new'); return [...opts, ...(createOpt?[createOpt]:[])]; });
        if(opts.length && !selectedVoiceId) setSelectedVoiceId(String(opts[0].id));
      } catch(e:any){ setVoiceLoadError(e.message||'音色列表加载失败'); }
      finally { setLoadingVoices(false); }
    };
    load();
  },[]);

  const start = async () => {
    if(!douyinUrl.trim()) { setError('请填写抖音视频链接'); return; }
    if(!modelVideo){ setError('请上传模特视频'); return; }
    if(modelVideo && !modelVideoUrl){
      try{ const url = await mockUpload(modelVideo); setModelVideoUrl(url);}catch{ setError('模特视频上传失败'); return; }
    }
    if(selectedVoiceId === 'create_new') { setError('请先创建并选择自定义音色'); return; }
    if(!douyinScanned || !douyinUserInfo) { setError('请先完成抖音扫码授权'); return; }
    setError('');
    resetState();
    try {
      const payload = { douyinUrl, modelVideoUrl, voiceId: selectedVoiceId };
      const { data } = await startClone(payload as any);
      setTaskId(data.id);
      setOverall('running');
    } catch(e:any){
      setError(e.response?.data?.message || e.message || '启动生成失败');
    }
  };

  // ============================== 克隆任务轮询 ==============================
  // 自适应轮询（setTimeout 实现，便于动态间隔 & 退避）
  useEffect(()=>{
    if(!taskId) return;
    cancelledRef.current = false;
    intervalRef.current = 2000;
    attemptRef.current = 0;

    const schedule = () => {
      if(timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(run, intervalRef.current);
    };

    const adjustInterval = (elapsedMs: number) => {
      if(elapsedMs < 20000) intervalRef.current = 2000;
      else if(elapsedMs < 60000) intervalRef.current = 3000;
      else intervalRef.current = 5000;
    };

    const startTs = Date.now();

    const run = async () => {
      if(cancelledRef.current) return;
      try {
        const { data } = await fetchCloneStatus(taskId);
        setSteps(data.steps);
        if(data.downloadUrl) setDownUrl(data.downloadUrl);
        if(data.douyinShareUrl) setShareUrl(data.douyinShareUrl);
        if(data.overallStatus === 'success') { setOverall('success'); return; }
        if(data.overallStatus === 'failed') { setOverall('failed'); setError(data.errorMessage||'生成失败'); return; }
        // 正常继续
        attemptRef.current = 0; // reset error attempts
        adjustInterval(Date.now() - startTs);
        schedule();
      } catch(e:any){
        attemptRef.current += 1;
        const backoff = Math.min(intervalRef.current * 1.5, 8000);
        intervalRef.current = backoff;
        setError(e.response?.data?.message || e.message || '状态获取失败');
        schedule();
      }
    };

    // 立即执行一次
    run();

    return ()=>{ if(timerRef.current) clearTimeout(timerRef.current); };
  },[taskId]);

  const manualRefresh = async () => {
    if(!taskId || overall==='success' || overall==='failed') return;
    if(timerRef.current) clearTimeout(timerRef.current);
    try {
      const { data } = await fetchCloneStatus(taskId);
      setSteps(data.steps);
      if(data.downloadUrl) setDownUrl(data.downloadUrl);
      if(data.douyinShareUrl) setShareUrl(data.douyinShareUrl);
      if(data.overallStatus === 'success') { setOverall('success'); return; }
      if(data.overallStatus === 'failed') { setOverall('failed'); setError(data.errorMessage||'生成失败'); return; }
      // 重置间隔重新调度
      intervalRef.current = 2000;
      attemptRef.current = 0;
      if(timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(()=>{}, 0); // no-op placeholder
    } catch(e:any){
      setError(e.response?.data?.message || e.message || '状态获取失败');
    }
  };

  const cancelTask = async () => {
    if(!taskId) return;
    try {
      await cancelClone(taskId);
      cancelledRef.current = true;
      if(timerRef.current) clearTimeout(timerRef.current);
      setOverall('failed');
      setError('任务已取消');
    } catch(e:any){
      setError(e.response?.data?.message || e.message || '取消失败');
    }
  };

  const restart = () => {
    if(overall!=='failed') return;
    setTaskId('');
    setSteps([]);setOverall('idle');setError('');setDownUrl('');setShareUrl('');
  };

  const disableForm = overall==='running';
  // 兼容旧逻辑：现在只根据上传状态禁用按钮
  const voiceBlocking = voiceCreating;

  // 处理选择变化
  const handleVoiceChange = (val: string) => {
    if(val === 'create_new') { setSelectedVoiceId(val); setShowCreateVoice(true); }
    else { setSelectedVoiceId(val); setShowCreateVoice(false); }
  };
  // ============================== 自定义音色创建 ==============================
  // 启动音色创建
  const startCreateVoice = async () => {
    if(!voiceFile) { setVoiceCreateError('请先选择音频文件'); return; }
    setVoiceCreateError(''); setVoiceCreating(true); setVoiceProgress(0);
    try {
      const { data } = await uploadAudioResource(voiceFile, (p)=>setVoiceProgress(p));
      const newRes = data.data;
      // 上传完成后重新获取列表，使用服务端最终名称
      setLoadingVoices(true);
      try {
        const listResp = await fetchAudioResources();
        if(listResp.data.code!==0) throw new Error(listResp.data.message||'刷新列表失败');
        const list = listResp.data.data || [];
        setAudioResources(list as ResourceItem[]);
        const opts: VoiceOption[] = list.map(r=>({ id:String(r.id), name:r.name || `音色${r.id}`, type:'preset' }));
        setVoiceOptions(prev=>{ const createOpt = prev.find(p=>p.id==='create_new'); return [...opts, ...(createOpt?[createOpt]:[])]; });
      } catch(inner:any) {
        console.warn('刷新音色列表失败', inner);
      } finally { setLoadingVoices(false); }
      // 选中新上传 id
      setSelectedVoiceId(String(newRes.id));
      setShowCreateVoice(false);
      setVoiceFile(null);
    } catch(e:any){
      setVoiceCreateError(e.response?.data?.message || e.message || '音色上传失败');
    } finally {
      setVoiceCreating(false);
      setVoiceProgress(0);
    }
  };
  const cancelVoiceCreation = async () => { setVoiceCreating(false); setVoiceProgress(0); setVoiceFile(null); setVoiceCreateError(''); setShowCreateVoice(false); };

  // ============================== 音色试听逻辑 ==============================
  const handlePreviewVoice = (opt: { id:string; sampleUrl?:string }) => {
    if(opt.id==='create_new') return;
    // 若当前正在播放同一个 -> 停止
    if(playingVoiceId === opt.id) {
      if(audioRef.current){ audioRef.current.pause(); audioRef.current.currentTime = 0; }
      setPlayingVoiceId('');
      return;
    }
    const url = opt.sampleUrl || getVoiceSampleUrl(opt.id);
    if(audioRef.current){
      audioRef.current.src = url;
      audioRef.current.play().then(()=>{
        setPlayingVoiceId(opt.id);
      }).catch(()=>{
        setPlayingVoiceId('');
      });
    }
  };

  // 播放结束或错误时重置状态
  useEffect(()=>{
    const el = audioRef.current; if(!el) return;
    const onEnd = () => setPlayingVoiceId('');
    const onErr = () => setPlayingVoiceId('');
    el.addEventListener('ended', onEnd); el.addEventListener('error', onErr);
    return ()=>{ el.removeEventListener('ended', onEnd); el.removeEventListener('error', onErr); };
  },[audioRef.current]);

  // 卸载时停止
  useEffect(()=>()=>{ if(audioRef.current){ audioRef.current.pause(); } },[]);

  // 抖音扫码成功回调
  const handleDouyinScanSuccess = (userInfo: DouyinUserInfo) => {
    setDouyinUserInfo(userInfo);
    setDouyinScanned(true);
  };

  // 抖音扫码状态变化回调
  const handleDouyinScanStatusChange = (isScanned: boolean) => {
    setDouyinScanned(isScanned);
    if (!isScanned) {
      setDouyinUserInfo(null);
    }
  };

  return <Page>
    <Grid />
    <Container>
      <Title>一键克隆 · 智能生成</Title>
      <Flex>
        {/* 左侧：输入表单 */}
        <Card>
          <Label>抖音视频链接</Label>
            <Input placeholder="https://v.douyin.com/..." value={douyinUrl} disabled={disableForm} onChange={e=>setDouyinUrl(e.target.value)}/>
          <Label>模特视频（必选）</Label>
          <FileUploadBox
            accept="video/*"
            file={modelVideo}
            onChange={(f)=>{ setModelVideo(f); if(f) setModelVideoUrl(''); else setModelVideoUrl(''); }}
            disabled={disableForm}
            placeholder="未选择任何视频文件"
            label="点击或拖拽上传视频"
          />
          {modelVideo && !modelVideoUrl && <StatusText>待上传 (启动时自动上传)</StatusText>}
          {modelVideoUrl && <StatusText>已上传</StatusText>}
          {modelVideo && (
            <div style={{marginBottom:16}}>
              <VideoBox ratio={videoAspect}>
                <video
                  src={URL.createObjectURL(modelVideo)}
                  controls
                  onLoadedMetadata={e=>{
                    try {
                      const videoEl = e.currentTarget as HTMLVideoElement;
                      if(videoEl.videoWidth && videoEl.videoHeight){
                        setVideoAspect(videoEl.videoHeight / videoEl.videoWidth);
                      }
                      const canvas = document.createElement('canvas');
                      canvas.width = videoEl.videoWidth; canvas.height = videoEl.videoHeight;
                      const ctx = canvas.getContext('2d');
                      if(ctx){ ctx.drawImage(videoEl,0,0,canvas.width,canvas.height); const data = canvas.toDataURL('image/jpeg',0.6); setModelVideoThumb(data); }
                    } catch{}
                  }}
                />
              </VideoBox>
              {modelVideoThumb && <div style={{marginTop:4,fontSize:'.6rem',opacity:.6}}>封面已生成</div>}
            </div>
          )}
          <Label>音色</Label>
          <NeonDropdown
            value={selectedVoiceId}
            disabled={disableForm || loadingVoices}
            onChange={handleVoiceChange}
            options={voiceOptions.map(v=>{
              const res = audioResources.find(r=>String(r.id)===v.id);
              // 拼接资源路径为可访问 URL。
              // 静态资源访问：由后端 /api/resources 映射到 /Users/king/resources 目录
              // 统一使用 /api/resources + 原始 path（不再带 /file 前缀），避免走鉴权接口逻辑
              // 若后端改 CDN，可在这里替换为完整域名。
              const staticBase = `/resources`;
              const sampleUrl = (v.id!=='create_new' && res) ? `${staticBase}${res.path}` : (v.id!=='create_new'? getVoiceSampleUrl(v.id): undefined);
              return { id:v.id, label:v.name, disabled:v.disabled, progress:v.progress, sampleUrl };
            })}
            onPreview={handlePreviewVoice}
            playingId={playingVoiceId}
            placeholder={loadingVoices? '加载音色中...' : '选择或创建音色'}
          />
          {voiceLoadError && <StatusText style={{color:theme.colors.error}}>{voiceLoadError}</StatusText>}
          
          {/* 抖音扫码状态指示器 */}
          <Label>抖音账号授权</Label>
          <StatusIndicator $status={douyinScanned ? 'success' : 'pending'}>
            <span>
              {douyinScanned ? '✅' : '⏳'}
            </span>
            <span>
              {douyinScanned && douyinUserInfo 
                ? `已授权: ${douyinUserInfo.nickname}` 
                : '请在右侧完成抖音扫码授权'
              }
            </span>
          </StatusIndicator>
          {showCreateVoice && (
            <div style={{marginBottom:theme.spacing.md}}>
              <FileUploadBox
                accept="audio/*"
                file={voiceFile}
                onChange={(f)=>{ setVoiceFile(f); setVoiceCreateError(''); }}
                disabled={voiceCreating}
                progress={voiceCreating?voiceProgress:undefined}
                placeholder="未选择任何音频文件"
                label="上传语音（仅用于克隆）"
              />
              {voiceFile && !voiceCreating && (
                <div style={{marginTop:theme.spacing.sm, display:'flex', gap:theme.spacing.sm}}>
                  <Button onClick={startCreateVoice} disabled={!voiceFile}>
                    上传音色
                  </Button>
                  <Button secondary onClick={cancelVoiceCreation}>
                    取消
                  </Button>
                </div>
              )}
              {voiceCreateError && <StatusText style={{color:theme.colors.error, marginTop:theme.spacing.xs}}>{voiceCreateError}</StatusText>}
            </div>
          )}
          {voiceCreating && <Button disabled>{`音色上传中... (${voiceProgress}%)`}</Button>}
          {!voiceCreating && (
            <Button 
              disabled={disableForm || !douyinScanned} 
              onClick={start}
              title={!douyinScanned ? '请先完成抖音扫码授权' : ''}
            >
              {overall==='running'?'生成中...':'一键克隆 & 发布'}
            </Button>
          )}
          {overall==='running' && <Button secondary onClick={cancelTask}>取消任务</Button>}
          {overall==='running' && <Button secondary onClick={manualRefresh}>手动刷新</Button>}
          {overall==='failed' && <Button secondary onClick={restart}>重新开始</Button>}
          <ErrorMsg>{error}</ErrorMsg>
          {/* 隐藏的全局 audio 元素用于播放试听 */}
          <audio ref={audioRef} style={{display:'none'}} />
        </Card>
        
        {/* 中间：抖音扫码 */}
        <div>
          <DouyinQRScanner
            onScanSuccess={handleDouyinScanSuccess}
            onScanStatusChange={handleDouyinScanStatusChange}
          />
        </div>
        
        {/* 右侧：进度跟踪 */}
        <Card>
          <h3 style={{marginTop:0,marginBottom:theme.spacing.md,color:theme.colors.secondary}}>进度跟踪</h3>
          {overall==='idle' && <StatusText>等待开始...</StatusText>}
          <StepsWrap>
            {steps.map(s => (
              <StepRow key={s.key} state={s.status}>
                <div style={{minWidth:90}}>{s.name}</div>
                <ProgressBarOuter>
                  <ProgressBarInner w={s.progress} state={s.status} />
                </ProgressBarOuter>
                <StatusText>{s.status}{s.progress?` ${s.progress}%`:''}</StatusText>
              </StepRow>
            ))}
          </StepsWrap>
          {overall==='success' && (
            <ResultBox>
              <div style={{color:theme.colors.success}}>生成完成 ✔</div>
              {downUrl && <div>下载地址：<LinkA href={downUrl} target="_blank" rel="noreferrer">点击下载</LinkA></div>}
              {shareUrl && <div>抖音链接：<LinkA href={shareUrl} target="_blank" rel="noreferrer">查看发布</LinkA></div>}
            </ResultBox>
          )}
          {overall==='failed' && (
            <ResultBox>
              <div style={{color:theme.colors.error}}>任务失败 ✖</div>
              <div>{error}</div>
            </ResultBox>
          )}
        </Card>
      </Flex>
    </Container>
  </Page>;
}
