import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface ResourcesScreenProps {
  navigation: NavigationProp<any>;
}

interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'script';
  size: string;
  duration?: string;
  uploadTime: string;
  thumbnail?: string;
}

const ResourcesScreen: React.FC<ResourcesScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<'video' | 'audio' | 'script'>('video');

  const mockData: Record<string, MediaFile[]> = {
    video: [
      {
        id: '1',
        name: '产品介绍视频.mp4',
        type: 'video',
        size: '15.2 MB',
        duration: '2:30',
        uploadTime: '2025-09-19 10:30',
        thumbnail: '🎬',
      },
      {
        id: '2',
        name: '公司宣传片.mp4',
        type: 'video',
        size: '28.5 MB',
        duration: '5:15',
        uploadTime: '2025-09-18 16:20',
        thumbnail: '🎬',
      },
      {
        id: '3',
        name: '培训课程录像.mp4',
        type: 'video',
        size: '45.8 MB',
        duration: '8:45',
        uploadTime: '2025-09-17 14:10',
        thumbnail: '🎬',
      },
    ],
    audio: [
      {
        id: '4',
        name: '背景音乐1.mp3',
        type: 'audio',
        size: '3.2 MB',
        duration: '2:15',
        uploadTime: '2025-09-19 09:15',
        thumbnail: '🎵',
      },
      {
        id: '5',
        name: '旁白录音.wav',
        type: 'audio',
        size: '8.7 MB',
        duration: '3:40',
        uploadTime: '2025-09-18 11:30',
        thumbnail: '🎵',
      },
      {
        id: '6',
        name: '开场音效.mp3',
        type: 'audio',
        size: '1.5 MB',
        duration: '0:30',
        uploadTime: '2025-09-17 15:45',
        thumbnail: '🎵',
      },
    ],
    script: [
      {
        id: '7',
        name: '商业推广文案',
        type: 'script',
        size: '2.1 KB',
        uploadTime: '2025-09-19 12:00',
        thumbnail: '📝',
      },
      {
        id: '8',
        name: '教育培训脚本',
        type: 'script',
        size: '4.5 KB',
        uploadTime: '2025-09-18 10:20',
        thumbnail: '📝',
      },
      {
        id: '9',
        name: '新闻播报稿件',
        type: 'script',
        size: '3.2 KB',
        uploadTime: '2025-09-17 13:30',
        thumbnail: '📝',
      },
    ],
  };

  // 只保留视频、音频、风格三类入口，且不显示icon
  const tabs = [
    { key: 'video', label: '视频资源', count: mockData.video.length },
    { key: 'audio', label: '音频资源', count: mockData.audio.length },
    { key: 'script', label: '风格资源', count: mockData.script.length },
  ] as const;

  const handleUpload = () => {
    const uploadOptions = {
      video: '上传视频',
      audio: '上传音频',
      script: '创建文案',
    };

    Alert.alert(
      '选择上传类型',
      '',
      [
        {
          text: uploadOptions.video,
          onPress: () => navigation.navigate('UploadVideo'),
        },
        {
          text: uploadOptions.audio,
          onPress: () => navigation.navigate('UploadAudio'),
        },
        {
          text: uploadOptions.script,
          onPress: () => navigation.navigate('CreateScript'),
        },
        {
          text: '取消',
          style: 'cancel',
        },
      ]
    );
  };

  const handleFilePress = (file: MediaFile) => {
    if (file.type === 'script') {
      navigation.navigate('EditScript', { scriptId: file.id });
    } else {
      navigation.navigate('MediaPreview', { fileId: file.id, type: file.type });
    }
  };

  const handleFileOptions = (file: MediaFile) => {
    Alert.alert(
      file.name,
      '选择操作',
      [
        {
          text: file.type === 'script' ? '编辑' : '预览',
          onPress: () => handleFilePress(file),
        },
        {
          text: '重命名',
          onPress: () => {},
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {},
        },
        {
          text: '取消',
          style: 'cancel',
        },
      ]
    );
  };

  const renderFileItem = ({ item }: { item: MediaFile }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => handleFilePress(item)}
      onLongPress={() => handleFileOptions(item)}
      activeOpacity={0.8}
    >
      <View style={styles.fileIcon}>
        <Text style={styles.fileIconText}>{item.thumbnail}</Text>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.fileDetails}>
          <Text style={styles.fileSize}>{item.size}</Text>
          {item.duration && (
            <>
              <Text style={styles.fileSeparator}> • </Text>
              <Text style={styles.fileDuration}>{item.duration}</Text>
            </>
          )}
        </View>
        <Text style={styles.fileUploadTime}>{item.uploadTime}</Text>
      </View>
      <TouchableOpacity
        style={styles.fileOptionsButton}
        onPress={() => handleFileOptions(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.fileOptionsIcon}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getStorageInfo = () => {
    const usedStorage = 156; // MB
    const totalStorage = 1024; // MB (1GB)
    const percentage = (usedStorage / totalStorage) * 100;
    
    return { used: usedStorage, total: totalStorage, percentage };
  };

  const storageInfo = getStorageInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>资源管理</Text>
      <View style={styles.cardGrid}>
        <TouchableOpacity style={styles.resourceCard} activeOpacity={0.85}>
          <Text style={styles.cardTitle}>视频资源</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resourceCard} activeOpacity={0.85}>
          <Text style={styles.cardTitle}>音频资源</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resourceCard} activeOpacity={0.85}>
          <Text style={styles.cardTitle}>风格资源</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  storageInfo: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  storageUsage: {
    fontSize: 12,
    color: '#666666',
  },
  storageBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  storageProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  resourceCard: {
    flex: 1,
    minWidth: 100,
    maxWidth: 180,
    height: 120,
    marginHorizontal: 8,
    backgroundColor: '#f7f8fa',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#eee',
    transition: 'background 0.2s',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 1,
  },
  tabBadgeText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '600',
  },
  activeTabBadgeText: {
    color: '#007AFF',
  },
  fileList: {
    flex: 1,
    marginTop: 16,
  },
  fileListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fileItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fileIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileIconText: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666666',
  },
  fileSeparator: {
    fontSize: 12,
    color: '#666666',
  },
  fileDuration: {
    fontSize: 12,
    color: '#666666',
  },
  fileUploadTime: {
    fontSize: 11,
    color: '#999999',
  },
  fileOptionsButton: {
    padding: 8,
  },
  fileOptionsIcon: {
    fontSize: 16,
    color: '#666666',
    transform: [{ rotate: '90deg' }],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ResourcesScreen;