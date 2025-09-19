import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from '../components/Icon';
import { Colors, Typography, Spacing, CommonStyles, BorderRadius, Shadows, utils } from '../styles/theme';

interface Task {
  id: string;
  name: string;
  type: 'video_generation' | 'lip_sync' | 'voice_clone';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  createTime: string;
  estimatedTime?: number;
  actualTime?: number;
  resultUrl?: string;
  errorMessage?: string;
  templateName?: string;
}

interface TaskStats {
  total: number;
  completed: number;
  running: number;
  failed: number;
}

const TasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'running' | 'completed' | 'failed'>('all');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: '企业宣传片制作',
      type: 'video_generation',
      status: 'completed',
      progress: 100,
      createTime: '2024-01-15 14:30',
      actualTime: 180,
      resultUrl: 'https://example.com/video1.mp4',
      templateName: '商务模板',
    },
    {
      id: '2',
      name: '产品介绍视频',
      type: 'video_generation',
      status: 'running',
      progress: 75,
      createTime: '2024-01-15 15:45',
      estimatedTime: 240,
      templateName: '营销模板',
    },
    {
      id: '3',
      name: 'AI数字人视频',
      type: 'lip_sync',
      status: 'pending',
      progress: 0,
      createTime: '2024-01-15 16:20',
      estimatedTime: 300,
      templateName: '数字人模板',
    },
    {
      id: '4',
      name: '教学视频制作',
      type: 'video_generation',
      status: 'failed',
      progress: 45,
      createTime: '2024-01-15 13:15',
      errorMessage: '视频处理失败，请检查输入文件格式',
      templateName: '教育模板',
    },
    {
      id: '5',
      name: '声音克隆任务',
      type: 'voice_clone',
      status: 'completed',
      progress: 100,
      createTime: '2024-01-14 10:20',
      actualTime: 120,
      resultUrl: 'https://example.com/voice1.wav',
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const filterOptions = [
    { key: 'all' as const, label: '全部', icon: 'list' },
    { key: 'running' as const, label: '进行中', icon: 'play-circle-outline' },
    { key: 'completed' as const, label: '已完成', icon: 'check-circle' },
    { key: 'failed' as const, label: '失败', icon: 'error-outline' },
  ];

  const taskStats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    running: tasks.filter(t => t.status === 'running' || t.status === 'pending').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'running') return task.status === 'running' || task.status === 'pending';
    return task.status === activeFilter;
  });

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'video_generation':
        return '视频生成';
      case 'lip_sync':
        return '口型同步';
      case 'voice_clone':
        return '声音克隆';
      default:
        return '未知任务';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'video_generation':
        return 'movie';
      case 'lip_sync':
        return 'record-voice-over';
      case 'voice_clone':
        return 'voice-over-off';
      default:
        return 'work';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待中';
      case 'running':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const handleTaskPress = (task: Task) => {
    if (task.status === 'completed' && task.resultUrl) {
      Alert.alert('任务完成', '是否查看结果？', [
        { text: '查看结果', onPress: () => console.log('查看结果:', task.resultUrl) },
        { text: '关闭', style: 'cancel' },
      ]);
    } else if (task.status === 'failed') {
      Alert.alert('任务失败', task.errorMessage || '任务执行失败');
    } else {
      console.log('查看任务详情:', task.name);
    }
  };

  const handleTaskAction = (task: Task) => {
    const actions = [];
    
    if (task.status === 'running' || task.status === 'pending') {
      actions.push({ text: '取消任务', onPress: () => console.log('取消任务:', task.id) });
    }
    
    if (task.status === 'failed') {
      actions.push({ text: '重试', onPress: () => console.log('重试任务:', task.id) });
    }
    
    if (task.status === 'completed' && task.resultUrl) {
      actions.push({ text: '下载结果', onPress: () => console.log('下载:', task.resultUrl) });
    }
    
    actions.push(
      { text: '查看详情', onPress: () => console.log('查看详情:', task.id) },
      { text: '删除', style: 'destructive' as const, onPress: () => console.log('删除任务:', task.id) },
      { text: '取消', style: 'cancel' as const }
    );

    Alert.alert(task.name, '选择操作', actions);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderTaskItem = ({ item }: { item: Task }) => {
    const statusColor = utils.getStatusColor(item.status);
    
    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => handleTaskPress(item)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskIconContainer}>
            <Icon
              name={getTaskTypeIcon(item.type)}
              size={24}
              color={statusColor}
            />
          </View>
          
          <View style={styles.taskInfo}>
            <Text style={styles.taskName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.taskMeta}>
              <Text style={styles.metaText}>
                {getTaskTypeLabel(item.type)}
              </Text>
              {item.templateName && (
                <>
                  <Text style={styles.metaSeparator}>•</Text>
                  <Text style={styles.metaText}>{item.templateName}</Text>
                </>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleTaskAction(item)}
          >
            <Icon name="more-vert" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* 进度条 */}
        {(item.status === 'running' || item.status === 'failed') && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.progress}%`,
                    backgroundColor: statusColor,
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}

        {/* 状态和时间信息 */}
        <View style={styles.taskFooter}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
          
          <View style={styles.timeInfo}>
            <Icon name="access-time" size={14} color={Colors.textTertiary} />
            <Text style={styles.timeText}>
              {item.createTime}
            </Text>
          </View>
        </View>

        {/* 错误信息 */}
        {item.status === 'failed' && item.errorMessage && (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText} numberOfLines={2}>
              {item.errorMessage}
            </Text>
          </View>
        )}

        {/* 完成时间 */}
        {item.status === 'completed' && item.actualTime && (
          <View style={styles.completedInfo}>
            <Icon name="done" size={16} color={Colors.success} />
            <Text style={styles.completedText}>
              耗时 {utils.formatDuration(item.actualTime)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 统计卡片 */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>任务统计</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{taskStats.total}</Text>
            <Text style={styles.statLabel}>总数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.warning }]}>
              {taskStats.running}
            </Text>
            <Text style={styles.statLabel}>进行中</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.success }]}>
              {taskStats.completed}
            </Text>
            <Text style={styles.statLabel}>已完成</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.error }]}>
              {taskStats.failed}
            </Text>
            <Text style={styles.statLabel}>失败</Text>
          </View>
        </View>
      </View>

      {/* 筛选器 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              activeFilter === filter.key && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Icon
              name={filter.icon}
              size={18}
              color={activeFilter === filter.key ? Colors.textLight : Colors.textSecondary}
            />
            <Text style={[
              styles.filterText,
              activeFilter === filter.key && styles.activeFilterText,
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 任务列表 */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={styles.tasksList}
        contentContainerStyle={styles.tasksContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>暂无任务</Text>
            <Text style={styles.emptySubtitle}>去首页创建你的第一个任务吧</Text>
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
  
  statsCard: {
    ...CommonStyles.card,
    marginBottom: Spacing.lg,
  },
  
  statsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: Typography.sizes.xxl,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  
  filtersContainer: {
    marginBottom: Spacing.lg,
  },
  
  filtersContent: {
    paddingRight: Spacing.screenPadding,
    gap: Spacing.sm,
  },
  
  filterButton: {
    ...CommonStyles.rowCenter,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  
  filterText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  
  activeFilterText: {
    color: Colors.textLight,
  },
  
  tasksList: {
    flex: 1,
  },
  
  tasksContent: {
    paddingBottom: Spacing.xl,
  },
  
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  
  taskHeader: {
    ...CommonStyles.row,
    marginBottom: Spacing.md,
  },
  
  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceVariant,
    ...CommonStyles.center,
    marginRight: Spacing.md,
  },
  
  taskInfo: {
    flex: 1,
  },
  
  taskName: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  taskMeta: {
    ...CommonStyles.row,
  },
  
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  
  metaSeparator: {
    fontSize: Typography.sizes.sm,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.xs,
  },
  
  actionButton: {
    padding: Spacing.xs,
  },
  
  progressContainer: {
    ...CommonStyles.rowBetween,
    marginBottom: Spacing.md,
  },
  
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  
  progressText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    minWidth: 35,
    textAlign: 'right',
  },
  
  taskFooter: {
    ...CommonStyles.rowBetween,
  },
  
  statusContainer: {
    ...CommonStyles.row,
    gap: Spacing.xs,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  
  statusText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
  },
  
  timeInfo: {
    ...CommonStyles.row,
    gap: Spacing.xs,
  },
  
  timeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
  
  errorContainer: {
    ...CommonStyles.row,
    backgroundColor: Colors.error + '10',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    flex: 1,
  },
  
  completedInfo: {
    ...CommonStyles.row,
    backgroundColor: Colors.success + '10',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  
  completedText: {
    fontSize: Typography.sizes.sm,
    color: Colors.success,
    fontWeight: '500' as const,
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

export default TasksScreen;