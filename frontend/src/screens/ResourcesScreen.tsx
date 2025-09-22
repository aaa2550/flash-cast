

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import { Platform } from 'react-native';
import { RESOURCE_URL_PREFIX } from '../constants/config';
import ReactModal from 'react-modal';
// ...existing code...
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 18,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#222',
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    alignSelf: 'center',
    letterSpacing: 0.5,
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  resourceCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 28,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    // 扁平化：无阴影
    borderWidth: 1,
    borderColor: '#ececec',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    letterSpacing: 0.2,
  },
  uploadBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  listWrap: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    minHeight: 120,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  itemName: {
    fontSize: 15,
    color: '#222',
  },
  itemSize: {
    fontSize: 13,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 15,
    padding: 24,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  audioPlayBtn: {
    width: 48,
    height: 32,
    backgroundColor: '#f1f5ff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    alignSelf: 'center',
    marginLeft: 8,
  },
});



const TABS = [
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' },
  { key: 'style', label: '风格' },
];

type TabKey = 'video' | 'audio' | 'style';

// 后端资源结构
export interface Resource {
  id: number;
  type: string;
  userId: number;
  name: string;
  path: string;
  suffix: string;
  size: number;
  createTime: string;
  updateTime: string;
  deleted: number;
}

// 通用fetch方法，自动读取本地token加到header
async function fetchResourceList(type: 'VIDEO' | 'AUDIO'): Promise<Resource[]> {
  let token = '';
  if (Platform.OS === 'web') {
    token = localStorage.getItem('user_token') || '';
  } else {
    token = await AsyncStorage.getItem('user_token') || '';
  }
  const res = await fetch(`/api/resource/list?type=${type}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  const data = await res.json();
  return data.data || [];
}

function ResourcesScreen() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('video');
  const [videoList, setVideoList] = React.useState<Resource[]>([]);
  const [audioList, setAudioList] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    if (activeTab === 'video') {
      fetchResourceList('VIDEO').then(list => {
        setVideoList(list);
        setLoading(false);
      });
    } else if (activeTab === 'audio') {
      fetchResourceList('AUDIO').then(list => {
        setAudioList(list);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  // 删除视频
  const handleDeleteVideo = async (id: number) => {
    let token = '';
    if (Platform.OS === 'web') {
      token = localStorage.getItem('user_token') || '';
    } else {
      token = await AsyncStorage.getItem('user_token') || '';
    }
    await fetch(`/api/resource/delete?id=${id}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      credentials: 'include',
    });
    setLoading(true);
    fetchResourceList('VIDEO').then(list => {
      setVideoList(list);
      setLoading(false);
    });
  };

  // 资源列表渲染函数
  function renderResourceList() {
    if (Platform.OS === 'web') {
      return (
        <div style={{ ...styles.listWrap, maxHeight: '60vh', overflowY: 'auto', minHeight: 300 }}>
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <span style={{ color: '#2563eb' }}>加载中...</span>
            </div>
          ) : activeTab === 'video' ? (
            videoList.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#bbb', fontSize: 15, padding: 24 }}>暂无视频</div>
            ) : (
              videoList.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f1f1' }}>
                  <VideoListItem item={item} onDelete={handleDeleteVideo} />
                </div>
              ))
            )
          ) : activeTab === 'audio' ? (
            audioList.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#bbb', fontSize: 15, padding: 24 }}>暂无音频</div>
            ) : (
              audioList.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f1f1' }}>
                  <audio src={RESOURCE_URL_PREFIX + item.path} controls style={{ width: 120 }} />
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <span style={{ fontSize: 15, color: '#222' }}>{item.name}</span>
                    <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>{(item.size / 1024 / 1024).toFixed(1)}MB</span>
                  </div>
                </div>
              ))
            )
          ) : (
            <div>
              <span style={{ fontSize: 15, color: '#222' }}>科技风格</span>
              <span style={{ fontSize: 15, color: '#222', marginLeft: 16 }}>商务风格</span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <View style={styles.listWrap}>
          {loading ? (
            <ActivityIndicator size="small" color="#2563eb" style={{ marginTop: 32 }} />
          ) : activeTab === 'video' ? (
            videoList.length === 0 ? (
              <Text style={styles.emptyText}>暂无视频</Text>
            ) : (
              <FlatList
                data={videoList}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                  <VideoListItem item={item} onDelete={handleDeleteVideo} />
                )}
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                  // TODO: 分页API
                }}
              />
            )
          ) : activeTab === 'audio' ? (
            audioList.length === 0 ? (
              <Text style={styles.emptyText}>暂无音频</Text>
            ) : (
              <FlatList
                data={audioList}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                  <View style={styles.audioItem}>
                    <TouchableOpacity style={styles.audioPlayBtn}>
                      <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>播放</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.itemSize}>{(item.size / 1024 / 1024).toFixed(1)}MB</Text>
                    </View>
                  </View>
                )}
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                  // TODO: 分页API
                }}
              />
            )
          ) : (
            <View>
              <Text style={styles.itemName}>科技风格</Text>
              <Text style={styles.itemName}>商务风格</Text>
            </View>
          )}
        </View>
      );
    }
  }

  // 主 return
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>资源管理</Text>
      {/* Tab 切换栏 */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {/* 上传按钮 */}
        {Platform.OS === 'web' ? (
          <>
            <input
              type="file"
              accept={activeTab === 'video' ? 'video/*' : activeTab === 'audio' ? 'audio/*' : '*'}
              id="resource-upload-input"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                const token = localStorage.getItem('user_token') || '';
                const res = await fetch('/api/resource/upload', {
                  method: 'POST',
                  body: formData,
                  headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
                  credentials: 'include',
                });
                const data = await res.json();
                if (data.code === 0) {
                  setLoading(true);
                  if (activeTab === 'video') {
                    fetchResourceList('VIDEO').then(list => {
                      setVideoList(list);
                      setLoading(false);
                    });
                  } else if (activeTab === 'audio') {
                    fetchResourceList('AUDIO').then(list => {
                      setAudioList(list);
                      setLoading(false);
                    });
                  }
                  alert('上传成功');
                } else {
                  alert('上传失败：' + (data.msg || '未知错误'));
                }
                e.target.value = '';
              }}
            />
            <label htmlFor="resource-upload-input" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <div
                style={{
                  background: '#2563eb',
                  borderRadius: 6,
                  padding: '10px 0',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  userSelect: 'none',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
                onMouseDown={e => ((e as any).currentTarget.style.background = '#1d4ed8')}
                onMouseUp={e => ((e as any).currentTarget.style.background = '#2563eb')}
                onMouseLeave={e => ((e as any).currentTarget.style.background = '#2563eb')}
              >
                上传{TABS.find(t=>t.key===activeTab)?.label}
              </div>
            </label>
          </>
        ) : (
          <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.8} onPress={() => { /* TODO: RN端上传 */ }}>
            <Text style={styles.uploadBtnText}>上传{TABS.find(t=>t.key===activeTab)?.label}</Text>
          </TouchableOpacity>
        )}
        {/* 资源列表 */}
        {renderResourceList()}
      </View>
    </View>
  );
}


// 组件必须在主组件和export default之前定义
interface VideoListItemProps {
  item: any;
  onDelete: (id: number) => void;
}
function VideoListItem({ item, onDelete }: VideoListItemProps) {
  let sizeStr = '';
  if (item.size >= 1024 * 1024) {
    sizeStr = (item.size / 1024 / 1024).toFixed(1) + ' MB';
  } else if (item.size >= 1024) {
    sizeStr = (item.size / 1024).toFixed(1) + ' KB';
  } else {
    sizeStr = item.size + ' B';
  }
  const createTime = item.createTime ? new Date(item.createTime).toLocaleString() : '';
  const [duration, setDuration] = React.useState('');
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const d = videoRef.current.duration;
      if (!isNaN(d)) {
        const min = Math.floor(d / 60);
        const sec = Math.floor(d % 60).toString().padStart(2, '0');
        setDuration(min + ':' + sec);
      }
    }
  };
  const [showModal, setShowModal] = React.useState(false);
  return (
    <View style={styles.videoItem}>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        {Platform.OS === 'web' ? (
          <VideoCoverWeb videoUrl={RESOURCE_URL_PREFIX + item.path} width={120} height={68} />
        ) : (
          <Image source={{ uri: RESOURCE_URL_PREFIX + item.path }} style={{ width: 120, height: 68, borderRadius: 6, backgroundColor: '#eee' }} />
        )}
        {duration ? (
          <View style={{ position: 'absolute', right: 8, bottom: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 4 }}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{duration}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
      {Platform.OS === 'web' && (
        <video
          ref={videoRef}
          src={RESOURCE_URL_PREFIX + item.path}
          style={{ display: 'none' }}
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemSize}>{sizeStr}</Text>
        <Text style={styles.itemSize}>{createTime}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <Text style={{ color: '#e11d48', fontWeight: 'bold' }}>删除</Text>
      </TouchableOpacity>
      {Platform.OS === 'web' && (
        <ReactModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          style={{ overlay: { background: 'rgba(0,0,0,0.5)' }, content: { maxWidth: 600, margin: 'auto', borderRadius: 8 } }}
          ariaHideApp={false}
        >
          <video
            src={RESOURCE_URL_PREFIX + item.path}
            style={{ width: '100%', borderRadius: 8, background: '#000' }}
            controls
            autoPlay
          />
          <button style={{ marginTop: 16 }} onClick={() => setShowModal(false)}>关闭</button>
        </ReactModal>
      )}
    </View>
  );
}

export default ResourcesScreen;

// 前端自动生成视频首帧封面（web专用）
function VideoCoverWeb(props: { videoUrl: string; width: number; height: number }) {
  const { videoUrl, width, height } = props;
  const [cover, setCover] = React.useState<string | null>(null);
  React.useEffect(() => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 0.1;
    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
      }
      try {
        const url = canvas.toDataURL('image/jpeg');

        setCover(url);
      } catch (e) {
        setCover(null);
      }
    });
    video.addEventListener('error', () => setCover(null));
    video.load();
    return () => {
      video.src = '';
    };
  }, [videoUrl, width, height]);
  return cover ? (
    <img
      src={cover}
      style={{ width, height, borderRadius: 6, background: '#eee', objectFit: 'cover' }}
      alt="视频封面"
    />
  ) : (
    <div style={{ width, height, borderRadius: 6, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 12 }}>
      无封面
    </div>
  );
}