import React, { useCallback, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

/*
  FileUploadBox 组件
  Props:
    accept: input accept 属性
    file: 当前选中文件
    onChange: (file|null) => void  选择/清除文件
    disabled?: 禁用交互
    placeholder?: 占位提示
    compact?: 紧凑模式
    progress?: number | undefined  (可选显示进度条)
    label?: string 外部标签文本（可选）
*/

const glowAnim = keyframes`
  0% { box-shadow: 0 0 4px rgba(0,246,255,0.3), 0 0 12px rgba(255,0,229,0.15); }
  50%{ box-shadow: 0 0 10px rgba(0,246,255,0.55), 0 0 24px rgba(255,0,229,0.25);} 
  100%{ box-shadow: 0 0 4px rgba(0,246,255,0.3), 0 0 12px rgba(255,0,229,0.15); }
`;

const Wrapper = styled.div<{disabled?:boolean;dragging?:boolean;compact?:boolean}>`
  position:relative;cursor:${p=>p.disabled?'not-allowed':'pointer'};user-select:none;
  border:1px dashed ${theme.colors.border};
  border-radius:${theme.radius.sm};
  padding:${p=>p.compact?theme.spacing.sm:theme.spacing.md};
  background:linear-gradient(145deg, rgba(255,255,255,0.02), rgba(0,0,0,0.25));
  transition:.25s;border-color:${p=>p.dragging?theme.colors.primary:theme.colors.border};
  ${p=>p.dragging && `animation:${glowAnim} 2.2s linear infinite;`}
  &:hover{border-color:${p=>p.disabled?theme.colors.border:theme.colors.primary};}
  font-size:.75rem;color:${theme.colors.textSecondary};
`;

const HiddenInput = styled.input`
  position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;
`;

const FileName = styled.div`
  margin-top:6px;font-size:.7rem;color:${theme.colors.text};word-break:break-all;
`;

const Actions = styled.div`
  display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;
`;

const ActBtn = styled.button<{danger?:boolean}>`
  background:${p=>p.danger?theme.colors.error:theme.colors.bgDeep};
  color:${p=>p.danger?theme.colors.white:theme.colors.primary};
  border:1px solid ${p=>p.danger?theme.colors.error:theme.colors.primary};
  font-size:.65rem;padding:4px 10px;border-radius:16px;cursor:pointer;letter-spacing:.5px;
  display:inline-flex;align-items:center;gap:4px;transition:.25s;position:relative;overflow:hidden;
  &:hover{box-shadow:0 0 8px ${theme.colors.primary};}
`;

const ProgressBar = styled.div`
  height:6px;background:${theme.colors.bgSlight};border-radius:4px;overflow:hidden;margin-top:8px;position:relative;
`;
const ProgressInner = styled.div<{w:number}>`
  height:100%;width:${p=>p.w}%;background:linear-gradient(90deg,${theme.colors.primary},${theme.colors.secondary});box-shadow:0 0 8px ${theme.colors.primary};transition:width .35s;
`;

interface FileUploadBoxProps {
  accept: string;
  file: File | null;
  onChange: (f: File | null) => void;
  disabled?: boolean;
  placeholder?: string;
  compact?: boolean;
  progress?: number;
  label?: string;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  accept,
  file,
  onChange,
  disabled,
  placeholder='点击或拖拽文件到此',
  compact,
  progress,
  label
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging,setDragging] = useState(false);

  const pick = () => { if(disabled) return; ref.current?.click(); };
  const onFile = (files: FileList | null) => { if(!files || !files[0]) return; onChange(files[0]); };

  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if(disabled) return; setDragging(false); if(e.dataTransfer.files && e.dataTransfer.files[0]){ onChange(e.dataTransfer.files[0]); } }, [disabled,onChange]);
  const onDrag = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if(disabled) return; if(e.type==='dragenter' || e.type==='dragover') setDragging(true); else setDragging(false); }, [disabled]);

  return (
    <Wrapper disabled={disabled} dragging={dragging} compact={compact}
      onClick={pick}
      onDrop={onDrop}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      role="button" aria-disabled={disabled}
      tabIndex={0}
    >
      {label && <div style={{fontSize:'.65rem',letterSpacing:'.5px',color:theme.colors.textSecondary, marginBottom:4}}>{label}</div>}
      <div style={{display:'flex',alignItems:'center',gap:8,color:disabled?theme.colors.textSecondary:theme.colors.text}}>
        <span style={{fontSize:'.7rem',opacity:.8}}>{file? '已选择文件':'选择文件'}</span>
        <span style={{fontSize:'.65rem',opacity:.45}}>{file? file.name: placeholder}</span>
      </div>
      <HiddenInput ref={ref} type="file" accept={accept} disabled={disabled} onChange={e=>onFile(e.target.files)} />
      {file && <FileName>{file.name}</FileName>}
      {typeof progress === 'number' && progress >=0 && (
        <ProgressBar><ProgressInner w={progress} /></ProgressBar>
      )}
      <Actions>
        {file && <ActBtn onClick={(e)=>{e.stopPropagation(); onChange(null);}}>移除</ActBtn>}
        {!file && !disabled && <ActBtn onClick={(e)=>{e.stopPropagation(); pick();}}>浏览</ActBtn>}
      </Actions>
    </Wrapper>
  );
};

export default FileUploadBox;
