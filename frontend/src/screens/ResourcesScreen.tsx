import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from '../components/Icon';
import { Colors, Typography, Spacing, CommonStyles, BorderRadius, Shadows, utils } from '../styles/theme';

interface Resource {
  id: string;
  name: string;
  type: 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  size: number;
  duration?: number;
  thumbnail?: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'error';
}

interface StorageInfo {
  used: number;
  total: number;
  videoCount: number;
  audioCount: number;
  documentCount: number;
}

const ResourcesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio' | 'document'>('all');
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: '产品宣传视频.mp4',
      type: 'VIDEO',
      size: 52428800, // 50MB
      duration: 120,
      thumbnail: 'https://via.placeholder.com/150x100?text=Video',
      uploadDate: '2024-01-15',
      status: 'uploaded',
    },
    {
      id: '2',
      name: '背景音乐.mp3',
      type: 'AUDIO',
      size: 3145728, // 3MB
      duration: 180,
      uploadDate: '2024-01-14',
      status: 'uploaded',
    },
    {
      id: '3',
      name: '企业介绍.mp4',
      type: 'VIDEO',
      size: 73400320, // 70MB
      duration: 90,
      thumbnail: 'https://via.placeholder.com/150x100?text=Video2',
      uploadDate: '2024-01-13',
      status: 'processing',
    },
    {
      id: '4',
      name: '商业计划书.pdf',
      type: 'DOCUMENT',
      size: 1048576, // 1MB
      uploadDate: '2024-01-12',
      status: 'uploaded',
    },
    {
      id: '5',
      name: '配音素材.wav',
      type: 'AUDIO',
      size: 5242880, // 5MB
      duration: 60,
      uploadDate: '2024-01-11',
      status: 'error',
    },
  ]);

  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 134217728, // 128MB
    total: 1073741824, // 1GB
    videoCount: 2,
    audioCount: 2,
    documentCount: 1,
  });

  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { key: 'all' as const, label: '全部', icon: 'folder' },
    { key: 'video' as const, label: '视频', icon: 'videocam' },
    { key: 'audio' as const, label: '音频', icon: 'audiotrack' },
    { key: 'document' as const, label: '文档', icon: 'description' },
  ];

  const filteredResources = resources.filter(resource => {
    if (activeTab === 'all') return true;
    return resource.type.toLowerCase() === activeTab;
  });

  const handleUpload = () => {
    Alert.alert('上传文件', '请选择要上传的文件类型', [
      { text: '视频', onPress: () => console.log('上传视频') },
      { text: '音频', onPress: () => console.log('上传音频') },
      { text: '文档', onPress: () => console.log('上传文档') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleResourcePress = (resource: Resource) => {
    console.log('选择资源:', resource.name);
  };

  const handleResourceOptions = (resource: Resource) => {
    Alert.alert(resource.name, '选择操作', [
      { text: '预览', onPress: () => console.log('预览', resource.name) },
      { text: '下载', onPress: () => console.log('下载', resource.name) },
      { text: '删除', style: 'destructive', onPress: () => console.log('删除', resource.name) },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getFileIcon = (type: string, status: string) => {
    if (status === 'processing') return 'sync';
    if (status === 'error') return 'error';
    
    switch (type) {
      case 'VIDEO':
        return 'movie';
      case 'AUDIO':
        return 'music-note';
      case 'DOCUMENT':
        return 'description';
      default:
        return 'insert-drive-file';
    }
  };

  const getStatusColor = (status: string) => {
    return utils.getStatusColor(status);
  };

  const renderResourceItem = ({ item }: { item: Resource }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() => handleResourcePress(item)}
    >
      <View style={styles.resourceContent}>
        {item.type === 'VIDEO' && item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Icon
              name={getFileIcon(item.type, item.status)}
              size={24}
              color={getStatusColor(item.status)}
            />
          </View>
        )}
        
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.resourceMeta}>
            <Text style={styles.metaText}>
              {utils.formatFileSize(item.size)}
            </Text>
            {item.duration && (
              <>
                <Text style={styles.metaSeparator}>•</Text>
                <Text style={styles.metaText}>
                  {utils.formatDuration(item.duration)}
                </Text>
              </>
            )}
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.metaText}>{item.uploadDate}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {item.status === 'uploaded' ? '已上传' : 
               item.status === 'processing' ? '处理中' : '错误'}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => handleResourceOptions(item)}
      >
        <Icon name="more-vert" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 存储信息卡片 */}
      <View style={styles.storageCard}>
        <View style={styles.storageHeader}>
          <Text style={styles.storageTitle}>存储空间</Text>
          <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
            <Icon name="cloud-upload" size={20} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>上传</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.storageProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(storageInfo.used / storageInfo.total) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.storageText}>
            {utils.formatFileSize(storageInfo.used)} / {utils.formatFileSize(storageInfo.total)}
          </Text>
        </View>
        
        <View style={styles.storageStats}>
          <View style={styles.statItem}>
            <Icon name="movie" size={16} color={Colors.primary} />
            <Text style={styles.statText}>{storageInfo.videoCount} 视频</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="music-note" size={16} color={Colors.success} />
            <Text style={styles.statText}>{storageInfo.audioCount} 音频</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="description" size={16} color={Colors.warning} />
            <Text style={styles.statText}>{storageInfo.documentCount} 文档</Text>
          </View>
        </View>
      </View>

      {/* 筛选标签 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Icon
              name={tab.icon}
              size={18}
              color={activeTab === tab.key ? Colors.textLight : Colors.textSecondary}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 资源列表 */}
      <FlatList
        data={filteredResources}
        renderItem={renderResourceItem}
        keyExtractor={(item) => item.id}
        style={styles.resourcesList}
        contentContainerStyle={styles.resourcesContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="folder-open" size={64} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>暂无{activeTab === 'all' ? '' : tabs.find(t => t.key === activeTab)?.label}文件</Text>
            <Text style={styles.emptySubtitle}>点击上传按钮添加文件</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  
  storageCard: {
    ...CommonStyles.card,
    marginBottom: Spacing.lg,
  },
  
  storageHeader: {
    ...CommonStyles.rowBetween,
    marginBottom: Spacing.lg,
  },
  
  storageTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  
  uploadButton: {
    ...CommonStyles.rowCenter,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  
  uploadButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  
  storageProgress: {
    marginBottom: Spacing.lg,
  },
  
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  
  storageText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  storageStats: {
    ...CommonStyles.rowCenter,
    gap: Spacing.xl,
  },
  
  statItem: {
    ...CommonStyles.rowCenter,
    gap: Spacing.xs,
  },
  
  statText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  
  tabsContainer: {
    marginBottom: Spacing.lg,
  },
  
  tabsContent: {
    paddingRight: Spacing.screenPadding,
    gap: Spacing.sm,
  },
  
  tabButton: {
    ...CommonStyles.rowCenter,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  
  activeTabButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  
  activeTabText: {
    color: Colors.textLight,
  },
  
  resourcesList: {
    flex: 1,
  },
  
  resourcesContent: {
    paddingBottom: Spacing.xl,
  },
  
  resourceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...CommonStyles.rowBetween,
    ...Shadows.small,
  },
  
  resourceContent: {
    ...CommonStyles.row,
    flex: 1,
  },
  
  thumbnail: {
    width: 60,
    height: 45,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    resizeMode: 'cover' as const,
  },
  
  iconContainer: {
    width: 60,
    height: 45,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    ...CommonStyles.center,
  },
  
  resourceInfo: {
    flex: 1,
  },
  
  resourceName: {
    fontSize: Typography.sizes.base,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  resourceMeta: {
    ...CommonStyles.row,
    marginBottom: Spacing.xs,
  },
  
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
  
  metaSeparator: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.xs,
  },
  
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '500' as const,
    color: Colors.textLight,
  },
  
  moreButton: {
    padding: Spacing.xs,
  },
  
  emptyContainer: {
    ...CommonStyles.center,
    paddingVertical: Spacing.huge,
  },
  
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textTertiary,
  },
});

export default ResourcesScreen;