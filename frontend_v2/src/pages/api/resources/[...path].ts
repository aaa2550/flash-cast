import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 绝对根目录（宿主机路径）—— 根据部署环境调整或用环境变量注入
const RESOURCE_ROOT = process.env.STATIC_RESOURCES_DIR || '/Users/king/resources';

// 简单的 MIME 类型映射（可按需扩展）
const MIME_MAP: Record<string,string> = {
  '.mp3':'audio/mpeg',
  '.wav':'audio/wav',
  '.m4a':'audio/mp4',
  '.aac':'audio/aac',
  '.flac':'audio/flac',
  '.ogg':'audio/ogg',
  '.txt':'text/plain; charset=utf-8',
  '.json':'application/json; charset=utf-8'
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const segs = req.query.path;
  const rel = Array.isArray(segs)? segs.join('/') : (segs||'');

  // 防止路径穿越
  if(rel.includes('..')){
    res.status(400).json({error:'Invalid path'});return;
  }
  const abs = path.join(RESOURCE_ROOT, rel);

  if(!abs.startsWith(path.resolve(RESOURCE_ROOT))){
    res.status(400).json({error:'Out of base'});return;
  }
  if(!fs.existsSync(abs)){
    res.status(404).json({error:'Not found'});return;
  }
  const stat = fs.statSync(abs);
  if(stat.isDirectory()){
    res.status(403).json({error:'Is directory'});return;
  }
  const ext = path.extname(abs).toLowerCase();
  const mime = MIME_MAP[ext] || 'application/octet-stream';
  // Cache headers: 若文件名含 hash 可更长缓存
  res.setHeader('Content-Type', mime);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  // 流式读取
  const stream = fs.createReadStream(abs);
  stream.on('error', (e)=>{ res.status(500).end('Read error'); });
  stream.pipe(res);
}
