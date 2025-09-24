import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

/*
  NeonDropdown
  Props:
    options: { id: string; label: string; disabled?: boolean; meta?: string; progress?: number; }[]
    value: string
    onChange: (id: string) => void
    placeholder?: string
    disabled?: boolean
    maxHeight?: number
*/

const openAnim = keyframes`0%{opacity:0;transform:translateY(-4px) scale(.98);}100%{opacity:1;transform:translateY(0) scale(1);}`;

const Wrapper = styled.div`
  position:relative;font-size:.75rem;margin-bottom:${theme.spacing.md};
`;
// 使用 transient props ($disabled) 避免将 disabled 状态样式属性直接传到 DOM 造成警告
const Display = styled.button<{ $disabled?:boolean }>`
  width:100%;text-align:left;border:1px solid ${theme.colors.border};background:${theme.colors.bgDeep};color:${theme.colors.text};
  padding:${theme.spacing.sm} ${theme.spacing.md};border-radius:${theme.radius.sm};cursor:${p=>p.$disabled?'not-allowed':'pointer'};position:relative;font-family:${theme.typography.fontFamily};
  transition:.25s;letter-spacing:.5px;font-size:.75rem;
  &:hover{border-color:${p=>p.$disabled?theme.colors.border:theme.colors.primary};box-shadow:${p=>p.$disabled?'none':theme.shadows.glow};}
  &:after{content:'▾';position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:.6rem;opacity:.6;}
`;
interface MenuProps { $maxH:number; $direction:'down'|'up'; }
const Menu = styled.ul<MenuProps>`
  list-style:none;margin:4px 0 0;padding:4px;position:absolute;left:0;right:0;z-index:30;
  background:${theme.colors.bgSlight};border:1px solid ${theme.colors.border};border-radius:${theme.radius.sm};
  backdrop-filter:blur(12px);max-height:${p=>p.$maxH}px;overflow:auto;animation:${openAnim} .18s ease;
  box-shadow:0 4px 18px -2px rgba(0,0,0,.6), 0 0 0 1px ${theme.colors.border};
  ${p=>p.$direction==='up' ? 'bottom:100%;margin-top:0;margin-bottom:4px;' : 'top:100%;'}
`;
// Item 使用 $active / $disabled，避免 active / disabled 被额外输出（原生 disabled 只在 <button> 等元素上生效）
const Item = styled.li<{ $active?:boolean; $disabled?:boolean }>`
  padding:6px 10px;border-radius:6px;display:flex;align-items:center;gap:8px;
  font-size:.7rem;cursor:${p=>p.$disabled?'not-allowed':'pointer'};position:relative;color:${p=>p.$disabled?theme.colors.textSecondary:theme.colors.text};
  background:${p=>p.$active?theme.colors.bgDeep:'transparent'};transition:.2s;
  &:hover{background:${p=>p.$disabled?'transparent':theme.colors.bgDeep};}
`;
const ProgressMini = styled.div<{w:number}>`
  height:4px;border-radius:2px;background:${theme.colors.bgDeep};flex:1;overflow:hidden;position:relative;
  &:after{content:'';position:absolute;inset:0;width:${p=>p.w}%;background:linear-gradient(90deg,${theme.colors.primary},${theme.colors.secondary});box-shadow:0 0 6px ${theme.colors.primary};transition:width .35s;}
`;

interface Opt { id:string; label:string; disabled?:boolean; meta?:string; progress?:number; sampleUrl?:string; }
interface NeonDropdownProps { options:Opt[]; value:string; onChange:(id:string)=>void; placeholder?:string; disabled?:boolean; maxHeight?:number; onPreview?:(opt:Opt)=>void; playingId?:string; }

const PlayBtn = styled.button<{ $active?:boolean }>`
  border:none;outline:none;background:${theme.colors.bgDeep};color:${p=>p.$active?theme.colors.secondary:theme.colors.primary};
  width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;flex-shrink:0;font-size:.55rem;
  box-shadow:0 0 0 1px ${theme.colors.border};transition:.25s; 
  &:hover{box-shadow:0 0 0 1px ${theme.colors.primary},0 0 8px ${theme.colors.primary};}
`;

export const NeonDropdown: React.FC<NeonDropdownProps> = ({ options, value, onChange, placeholder='选择', disabled, maxHeight=220, onPreview, playingId }) => {
  const [open,setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement|null>(null);
  const current = options.find(o=>o.id===value);
  const toggle = () => { if(disabled) return; setOpen(o=>!o); };
  const choose = (id:string) => { if(disabled) return; onChange(id); setOpen(false); };
  const [direction,setDirection] = useState<'down'|'up'>('down');
  const [dynamicMaxH,setDynamicMaxH] = useState<number>(maxHeight);

  // 计算展开方向与可用高度，避免被底部遮挡
  useEffect(()=>{
    if(!open) return;
    if(!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom - 8; // 8px 余量
    const spaceAbove = rect.top - 8;
    if(spaceBelow < 160 && spaceAbove > spaceBelow){ // 经验阈值
      setDirection('up');
      setDynamicMaxH(Math.min(maxHeight, spaceAbove));
    } else {
      setDirection('down');
      setDynamicMaxH(Math.min(maxHeight, spaceBelow>100?spaceBelow:maxHeight));
    }
  },[open,maxHeight]);

  // 点击外部关闭
  useEffect(()=>{
    if(!open) return; const onDoc = (e:MouseEvent)=>{ if(!wrapRef.current) return; if(!wrapRef.current.contains(e.target as any)) setOpen(false); }; document.addEventListener('mousedown', onDoc); return ()=>document.removeEventListener('mousedown', onDoc);
  },[open]);

  // 键盘导航
  const [focusIndex,setFocusIndex] = useState<number>(-1);
  useEffect(()=>{ if(!open) { setFocusIndex(-1); return; }
    const handler = (e:KeyboardEvent) => {
      if(e.key==='Escape'){ setOpen(false); return; }
      if(e.key==='ArrowDown'){ e.preventDefault(); setFocusIndex(i=>{ const list = options.filter(o=>!o.disabled); const cur = list.findIndex(o=>o.id === (options[i]?.id)); const idx = cur<list.length-1?cur+1:0; return options.findIndex(o=>o.id===list[idx].id); }); }
      if(e.key==='ArrowUp'){ e.preventDefault(); setFocusIndex(i=>{ const list = options.filter(o=>!o.disabled); const cur = list.findIndex(o=>o.id === (options[i]?.id)); const idx = cur>0?cur-1:list.length-1; return options.findIndex(o=>o.id===list[idx].id); }); }
      if(e.key==='Enter'){ if(focusIndex>=0 && options[focusIndex] && !options[focusIndex].disabled){ choose(options[focusIndex].id); } }
    };
    window.addEventListener('keydown', handler);
    return ()=>window.removeEventListener('keydown', handler);
  },[open,focusIndex,options]);

  // 自动滚动聚焦项
  const listRef = useRef<HTMLUListElement|null>(null);
  useEffect(()=>{ if(!open || focusIndex<0) return; const li = listRef.current?.children[focusIndex] as HTMLElement; li?.scrollIntoView({block:'nearest'}); },[focusIndex,open]);

  // 让 currently selected 聚焦
  useEffect(()=>{ if(open){ const idx = options.findIndex(o=>o.id===value); setFocusIndex(idx); } },[open,value,options]);

  return (
    <Wrapper ref={wrapRef}>
      <Display type="button" $disabled={!!disabled} disabled={disabled} onClick={toggle} aria-haspopup="listbox" aria-expanded={open}>
        {current? current.label : <span style={{opacity:.5}}>{placeholder}</span>}
      </Display>
      {open && (
        <Menu ref={listRef} $maxH={dynamicMaxH} role="listbox" $direction={direction}>
          {options.map((o,i)=>{
            const active = o.id === value;
            return (
              <Item key={o.id} $active={active} $disabled={o.disabled} role="option" aria-selected={active}>
                {o.sampleUrl && (
                  <PlayBtn
                    type="button"
                    $active={playingId===o.id}
                    onClick={(e)=>{ e.stopPropagation(); if(onPreview) onPreview(o); }}
                    aria-label={playingId===o.id? '暂停':'播放'}
                  >{playingId===o.id? '■':'▶'}</PlayBtn>
                )}
                <span style={{flexShrink:0}} onClick={()=>{ if(!o.disabled) choose(o.id); }}>{o.label}</span>
                {typeof o.progress === 'number' && o.id!=='create_new' && <ProgressMini w={o.progress} />}
                {o.meta && <span style={{fontSize:'.6rem',opacity:.5}}>{o.meta}</span>}
              </Item>
            );
          })}
        </Menu>
      )}
    </Wrapper>
  );
};

export default NeonDropdown;
