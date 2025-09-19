import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface TasksScreenProps {
  navigation: NavigationProp<any>;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdTime: string;
  completedTime?: string;
  template: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  errorMessage?: string;
}

const TasksScreen: React.FC<TasksScreenProps> = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState<'all' | Task['status']>('all');
  const [refreshing, setRefreshing] = useState(false);

  const mockTasks: Task[] = [
    {
      id: '1',
      title: '商业产品推广视频',
      description: '使用商业推广模板制作的产品介绍视频',
      status: 'completed',
      progress: 100,
      createdTime: '2025-09-19 10:30',
      completedTime: '2025-09-19 10:45',
      template: '商业推广',
      videoUrl: 'https://example.com/video1.mp4',
    },
    {
      id: '2',
      title: '教育培训课程讲解',
      description: '教育培训模板制作的课程内容视频',
      status: 'processing',
      progress: 65,
      createdTime: '2025-09-19 11:20',
      template: '教育培训',
    },
    {
      id: '3',
      title: '新闻资讯播报',
      description: '新闻播报模板制作的资讯内容',
      status: 'pending',
      progress: 0,
      createdTime: '2025-09-19 12:00',
      template: '新闻播报',
    },
    {
      id: '4',
      title: '产品功能介绍',
      description: '详细介绍产品功能特点的视频',
      status: 'failed',
      progress: 30,
      createdTime: '2025-09-18 16:30',
      template: '产品介绍',
      errorMessage: '音频文件格式不支持，请重新上传',
    },
    {
      id: '5',
      title: '健康生活分享',
      description: '分享健康生活方式的内容视频',
      status: 'completed',
      progress: 100,
      createdTime: '2025-09-18 09:15',
      completedTime: '2025-09-18 09:42',
      template: '生活分享',
      videoUrl: 'https://example.com/video2.mp4',
    },
  ];

  const statusFilters = [
    { key: 'all', label: '全部', count: mockTasks.length },
    { key: 'pending', label: '等待中', count: mockTasks.filter(t => t.status === 'pending').length },
    { key: 'processing', label: '处理中', count: mockTasks.filter(t => t.status === 'processing').length },
    { key: 'completed', label: '已完成', count: mockTasks.filter(t => t.status === 'completed').length },
    { key: 'failed', label: '失败', count: mockTasks.filter(t => t.status === 'failed').length },
  ] as const;

  const getStatusConfig = (status: Task['status']) => {
    const configs = {
      pending: { color: '#FF9500', backgroundColor: '#FFF3E0', label: '等待处理' },
      processing: { color: '#007AFF', backgroundColor: '#E3F2FD', label: '处理中' },
      completed: { color: '#34C759', backgroundColor: '#E8F5E8', label: '已完成' },
      failed: { color: '#FF3B30', backgroundColor: '#FFEBEE', label: '处理失败' },
    };
    return configs[status];
  };

  const filteredTasks = selectedStatus === 'all' 
    ? mockTasks 
    : mockTasks.filter(task => task.status === selectedStatus);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleTaskPress = (task: Task) => {
    if (task.status === 'completed' && task.videoUrl) {
      navigation.navigate('VideoPreview', { taskId: task.id });
    } else if (task.status === 'failed') {
      Alert.alert(
        '任务失败',
        task.errorMessage || '任务处理失败，请重试',
        [
          { text: '重新创建', onPress: () => navigation.navigate('CreateTask', { retryTaskId: task.id }) },
          { text: '取消', style: 'cancel' },
        ]
      );
    } else {
      navigation.navigate('TaskDetail', { taskId: task.id });
    }
  };

  const handleTaskOptions = (task: Task) => {
    const options: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }> = [];
    
    if (task.status === 'completed') {
      options.push({ text: '预览视频', onPress: () => navigation.navigate('VideoPreview', { taskId: task.id }) });
      options.push({ text: '分享', onPress: () => {} });
      options.push({ text: '下载', onPress: () => {} });
    }
    
    if (task.status === 'failed') {
      options.push({ text: '重新创建', onPress: () => navigation.navigate('CreateTask', { retryTaskId: task.id }) });
    }
    
    if (task.status === 'processing') {
      options.push({ text: '取消任务', style: 'destructive', onPress: () => {} });
    }
    
    options.push({ text: '删除', style: 'destructive', onPress: () => {} });
    options.push({ text: '取消', style: 'cancel' });

    Alert.alert(task.title, '选择操作', options);
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => handleTaskPress(item)}
        onLongPress={() => handleTaskOptions(item)}
        activeOpacity={0.8}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <Text style={styles.taskTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.taskOptionsButton}
            onPress={() => handleTaskOptions(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.taskOptionsIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.taskMeta}>
          <Text style={styles.taskTemplate}>模板: {item.template}</Text>
          <Text style={styles.taskTime}>
            {item.status === 'completed' && item.completedTime 
              ? `完成于 ${item.completedTime}`
              : `创建于 ${item.createdTime}`
            }
          </Text>
        </View>

        {/* 进度条 */}
        {(item.status === 'processing' || (item.status === 'failed' && item.progress > 0)) && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.progress}%`,
                    backgroundColor: item.status === 'failed' ? '#FF3B30' : '#007AFF',
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}

        {/* 错误信息 */}
        {item.status === 'failed' && item.errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{item.errorMessage}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>任务列表</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateTask')}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>+ 新建</Text>
        </TouchableOpacity>
      </View>

      {/* 状态筛选 */}
      <View style={styles.filterContainer}>
        <FlatList
          data={statusFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === item.key && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedStatus(item.key)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterButtonText,
                selectedStatus === item.key && styles.activeFilterButtonText,
              ]}>
                {item.label}
              </Text>
              {item.count > 0 && (
                <View style={[
                  styles.filterBadge,
                  selectedStatus === item.key && styles.activeFilterBadge,
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    selectedStatus === item.key && styles.activeFilterBadgeText,
                  ]}>
                    {item.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      </View>

      {/* 任务列表 */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>
              {selectedStatus === 'all' ? '暂无任务' : `暂无${statusFilters.find(f => f.key === selectedStatus)?.label}任务`}
            </Text>
            <Text style={styles.emptyStateDescription}>
              点击右上角"新建"按钮创建新任务
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterList: {
    paddingHorizontal: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
    minWidth: 18,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: '#ffffff',
  },
  filterBadgeText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '600',
  },
  activeFilterBadgeText: {
    color: '#007AFF',
  },
  taskList: {
    flex: 1,
    marginTop: 16,
  },
  taskListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  taskOptionsButton: {
    padding: 4,
  },
  taskOptionsIcon: {
    fontSize: 16,
    color: '#666666',
    transform: [{ rotate: '90deg' }],
  },
  taskDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTemplate: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  taskTime: {
    fontSize: 11,
    color: '#999999',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
    minWidth: 35,
    textAlign: 'right',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    lineHeight: 16,
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

export default TasksScreen;