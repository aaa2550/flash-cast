

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import { Platform } from 'react-native';
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
});



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
    token = (await AsyncStorage.getItem('user_token')) || '';
  }
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`/api/resource/list?type=${type}`, {
    credentials: 'include',
    headers,
  });
  const data = await res.json();
  return data.data || [];
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' },
  { key: 'style', label: '风格' },
];

const ResourcesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('video');
  const [videoList, setVideoList] = useState<Resource[]>([]);
  const [audioList, setAudioList] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'video' && videoList.length === 0) {
      setLoading(true);
      fetchResourceList('VIDEO').then(list => {
        setVideoList(list);
        setLoading(false);
      });
    }
    if (activeTab === 'audio' && audioList.length === 0) {
      setLoading(true);
      fetchResourceList('AUDIO').then(list => {
        setAudioList(list);
        setLoading(false);
      });
    }
  }, [activeTab]);

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
      {/* 当前Tab内容区域 */}
      <View style={{ flex: 1 }}>
        {/* 上传按钮 */}
        <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.8} onPress={() => {}}>
          <Text style={styles.uploadBtnText}>上传{TABS.find(t=>t.key===activeTab)?.label}</Text>
        </TouchableOpacity>
        {/* 资源列表 */}
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
                  <View style={styles.videoItem}>
                    {/* 视频第一帧封面 */}
                    {Platform.OS === 'web' ? (
                      <video
                        src={item.path}
                        poster={item.path + '?frame=1'}
                        style={{ width: 120, height: 68, borderRadius: 6, background: '#eee' }}
                        controls={false}
                        preload="metadata"
                      />
                    ) : (
                      <Image source={{ uri: item.path }} style={{ width: 120, height: 68, borderRadius: 6, backgroundColor: '#eee' }} />
                    )}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.itemSize}>{(item.size / 1024 / 1024).toFixed(1)}MB</Text>
                    </View>
                  </View>
                )}
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
                    {/* 播放按钮（web用audio，原生用占位） */}
                    {Platform.OS === 'web' ? (
                      <audio src={item.path} controls style={{ width: 120 }} />
                    ) : (
                      <TouchableOpacity style={styles.audioPlayBtn}>
                        <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>播放</Text>
                      </TouchableOpacity>
                    )}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.itemSize}>{(item.size / 1024 / 1024).toFixed(1)}MB</Text>
                    </View>
                  </View>
                )}
              />
            )
          ) : (
            // 风格Tab只展示文案
            <View>
              <Text style={styles.itemName}>科技风格</Text>
              <Text style={styles.itemName}>商务风格</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default ResourcesScreen;