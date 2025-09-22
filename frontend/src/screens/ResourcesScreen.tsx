import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, TextInput, ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { RESOURCE_URL_PREFIX } from '../constants/config';
import ReactModal from 'react-modal';
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
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    overflow: 'hidden', // for web borderRadius
  },
});



const TABS: { key: TabKey; label: string }[] = [
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

// 风格结构
interface StyleItem {
  id: number;
  name: string;
  content: string;
  createTime?: string;
  updateTime?: string;
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

// 获取风格列表
async function fetchStyleList(): Promise<StyleItem[]> {
  let token = '';
  if (Platform.OS === 'web') {
    token = localStorage.getItem('user_token') || '';
  } else {
    token = await AsyncStorage.getItem('user_token') || '';
  }
  const res = await fetch('/api/style/list', {
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  const data = await res.json();
  return data.data || [];
}

async function updateStyle(id: number, content: string): Promise<{ ok: boolean; msg?: string }> {
  let token = '';
  if (Platform.OS === 'web') {
    token = localStorage.getItem('user_token') || '';
  } else {
    token = await AsyncStorage.getItem('user_token') || '';
  }
  const res = await fetch('/api/style/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify({ id, content }),
  });
  const data = await res.json();
  return { ok: data.code === 0, msg: data.msg };
}

async function deleteStyle(id: number): Promise<{ ok: boolean; msg?: string }> {
  let token = '';
  if (Platform.OS === 'web') {
    token = localStorage.getItem('user_token') || '';
  } else {
    token = await AsyncStorage.getItem('user_token') || '';
  }
  const res = await fetch(`/api/style/delete?id=${id}`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  const data = await res.json();
  return { ok: data.code === 0, msg: data.msg };
}

function ResourcesScreen() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('video');
  const [videoList, setVideoList] = React.useState<Resource[]>([]);
  const [audioList, setAudioList] = React.useState<Resource[]>([]);
  const [styleList, setStyleList] = React.useState<StyleItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [editingStyleId, setEditingStyleId] = React.useState<number | null>(null);
  const [editingContent, setEditingContent] = React.useState('');

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 2000);
  };

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
    } else if (activeTab === 'style') {
      fetchStyleList().then(list => {
        setStyleList(list);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const handleDeleteVideo = async (id: number) => {
    let token = '';
    if (Platform.OS === 'web') {
      token = localStorage.getItem('user_token') || '';
    } else {
      token = await AsyncStorage.getItem('user_token') || '';
    }
    const res = await fetch(`/api/resource/delete?id=${id}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      credentials: 'include',
    });
    const data = await res.json();
    if (data.code === 0) {
      showToast('删除成功');
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
    } else {
      showToast('删除失败：' + (data.msg || '未知错误'));
    }
  };

  // 删除音频
  const handleDeleteAudio = async (id: number) => {
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
    fetchResourceList('AUDIO').then(list => {
      setAudioList(list);
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
                <AudioListItem key={item.id} item={item} onDelete={handleDeleteAudio} />
              ))
            )
          ) : (
            <div>
              {styleList.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#bbb', fontSize: 15, padding: 24 }}>暂无风格</div>
              ) : (
                styleList.map(item => {
                  const isEditing = editingStyleId === item.id;
                  return (
                    <div key={item.id} style={{ padding: '12px 4px', borderBottom: '1px solid #f1f1f1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#222' }}>{item.name}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {isEditing ? (
                            <>
                              <button
                                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}
                                onClick={async () => {
                                  const res = await updateStyle(item.id, editingContent);
                                  if (res.ok) {
                                    showToast('保存成功');
                                    setEditingStyleId(null);
                                    setEditingContent('');
                                    const list = await fetchStyleList();
                                    setStyleList(list);
                                  } else {
                                    showToast('保存失败: ' + (res.msg || ''));
                                  }
                                }}
                              >保存</button>
                              <button
                                style={{ background: '#f1f5f9', color: '#334155', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}
                                onClick={() => { setEditingStyleId(null); setEditingContent(''); }}
                              >取消</button>
                            </>
                          ) : (
                            <button
                              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}
                              onClick={() => { setEditingStyleId(item.id); setEditingContent(item.content || ''); }}
                            >编辑</button>
                          )}
                          <button
                            style={{ background: '#fee2e2', color: '#e11d48', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}
                            onClick={async () => {
                              const res = await deleteStyle(item.id);
                              if (res.ok) {
                                showToast('删除成功');
                                const list = await fetchStyleList();
                                setStyleList(list);
                              } else {
                                showToast('删除失败: ' + (res.msg || ''));
                              }
                            }}
                          >删除</button>
                        </div>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        {isEditing ? (
                          <textarea
                            value={editingContent}
                            onChange={e => setEditingContent(e.target.value)}
                            style={{ width: '100%', height: 160, fontSize: 14, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0', resize: 'none', lineHeight: 1.5 }}
                          />
                        ) : (
                          <div style={{
                            fontSize: 14,
                            color: '#334155',
                            background: '#f8fafc',
                            border: '1px solid #f1f5f9',
                            padding: '8px 10px',
                            lineHeight: 1.6,
                            borderRadius: 6,
                            height: 160,
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap'
                          }}>{item.content}</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
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
                  <AudioListItem item={item} onDelete={handleDeleteAudio} />
                )}
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                  // TODO: 分页API
                }}
              />
            )
          ) : (
            <View>
              {styleList.length === 0 ? (
                <Text style={styles.emptyText}>暂无风格</Text>
              ) : (
                styleList.map(item => {
                  const isEditing = editingStyleId === item.id;
                  return (
                    <View key={item.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.itemName, { fontWeight: '600' }]}>{item.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          {isEditing ? (
                            <>
                              <TouchableOpacity
                                style={{ backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginRight: 8 }}
                                onPress={async () => {
                                  const res = await updateStyle(item.id, editingContent);
                                  if (res.ok) {
                                    showToast('保存成功');
                                    setEditingStyleId(null);
                                    setEditingContent('');
                                    const list = await fetchStyleList();
                                    setStyleList(list);
                                  } else {
                                    showToast('保存失败');
                                  }
                                }}
                              >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>保存</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginRight: 8 }}
                                onPress={() => { setEditingStyleId(null); setEditingContent(''); }}
                              >
                                <Text style={{ color: '#334155', fontWeight: '600' }}>取消</Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <TouchableOpacity
                              style={{ backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginRight: 8 }}
                              onPress={() => { setEditingStyleId(item.id); setEditingContent(item.content || ''); }}
                            >
                              <Text style={{ color: '#fff', fontWeight: '600' }}>编辑</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={{ backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 }}
                            onPress={async () => {
                              const res = await deleteStyle(item.id);
                              if (res.ok) {
                                showToast('删除成功');
                                const list = await fetchStyleList();
                                setStyleList(list);
                              } else {
                                showToast('删除失败');
                              }
                            }}
                          >
                            <Text style={{ color: '#e11d48', fontWeight: '600' }}>删除</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ marginTop: 8 }}>
                        {isEditing ? (
                          <TextInput
                            multiline
                            value={editingContent}
                            onChangeText={setEditingContent}
                            style={{ height: 160, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 8, fontSize: 14, textAlignVertical: 'top' }}
                          />
                        ) : (
                          <View style={{ height: 160 }}>
                            <ScrollView>
                              <Text style={{ fontSize: 14, color: '#334155', lineHeight: 20 }}>{item.content}</Text>
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>
      );
    }
  }

  // 主 return
  return (
    <View style={styles.container}>
      {toast.visible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toast}>{toast.message}</Text>
        </View>
      )}
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
        {activeTab !== 'style' && (Platform.OS === 'web' ? (
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
                  showToast('上传成功');
                } else {
                  showToast('上传失败：' + (data.msg || '未知错误'));
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
        ))}
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

// 组件必须在主组件和export default之前定义
interface AudioListItemProps {
  item: any;
  onDelete: (id: number) => void;
}
function AudioListItem({ item, onDelete }: AudioListItemProps) {
  const [duration, setDuration] = React.useState('');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (!isNaN(d)) {
        const min = Math.floor(d / 60);
        const sec = Math.floor(d % 60).toString().padStart(2, '0');
        setDuration(min + ':' + sec);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  let sizeStr = '';
  if (item.size >= 1024 * 1024) {
    sizeStr = (item.size / 1024 / 1024).toFixed(1) + ' MB';
  } else if (item.size >= 1024) {
    sizeStr = (item.size / 1024).toFixed(1) + ' KB';
  } else {
    sizeStr = item.size + ' B';
  }
  const createTime = item.createTime ? new Date(item.createTime).toLocaleString() : '';

  return (
    <View style={styles.audioItem}>
      {Platform.OS === 'web' ? (
        <>
          <audio
            ref={audioRef}
            src={RESOURCE_URL_PREFIX + item.path}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />
          <TouchableOpacity onPress={togglePlay} style={styles.audioPlayBtn}>
            <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>{isPlaying ? '暂停' : '播放'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.audioPlayBtn} onPress={() => { /* TODO: RN Audio Playback */ }}>
          <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>播放</Text>
        </TouchableOpacity>
      )}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          {duration && <Text style={styles.itemSize}>{duration}</Text>}
          <Text style={[styles.itemSize, !!duration && { marginLeft: 8 }]}>{sizeStr}</Text>
        </View>
        <Text style={styles.itemSize}>{createTime}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <Text style={{ color: '#e11d48', fontWeight: 'bold' }}>删除</Text>
      </TouchableOpacity>
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