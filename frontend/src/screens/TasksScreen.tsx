import React, { useState, useCallback } from 'react';
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
import { TechTheme } from '../styles/theme';

const C = TechTheme.colors;
const S = TechTheme.spacing;
const R = TechTheme.radius;
const TY = TechTheme.typography;

// Mock Icon component
const Icon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const getIconContent = (iconName: string) => {
    switch (iconName) {
      case 'list': return '≡';
      case 'play-circle-outline': return '▶';
      case 'check-circle': return '✓';
      case 'error-outline': return '❗';
      case 'movie': return '🎬';
      case 'record-voice-over': return '🎙️';
      case 'voice-over-off': return '🔇';
      case 'work': return '💼';
      case 'more-vert': return '⋮';
      case 'access-time': return '🕒';
      case 'done': return '✓';
      case 'assignment': return '📄';
      default: return '●';
    }
  };
  return <Text style={{ fontSize: size * 0.9, color, lineHeight: size }}>{getIconContent(name)}</Text>;
};

// --- Data Interfaces ---
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

// --- Helper Functions ---
const getTaskTypeDetails = (type: Task['type']) => {
  switch (type) {
    case 'video_generation': return { label: '视频生成', icon: 'movie' };
    case 'lip_sync': return { label: '口型同步', icon: 'record-voice-over' };
    case 'voice_clone': return { label: '声音克隆', icon: 'voice-over-off' };
    default: return { label: '未知任务', icon: 'work' };
  }
};

const getStatusDetails = (status: Task['status']) => {
  switch (status) {
    case 'pending': return { label: '等待中', color: C.textTertiary };
    case 'running': return { label: '进行中', color: C.accentTechBlue };
    case 'completed': return { label: '已完成', color: C.accentNeonGreen };
    case 'failed': return { label: '失败', color: C.stateError };
    case 'cancelled': return { label: '已取消', color: C.textSecondary };
    default: return { label: '未知', color: C.textTertiary };
  }
};

const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [
        h > 0 ? `${h}时` : '',
        m > 0 ? `${m}分` : '',
        s > 0 ? `${s}秒` : '',
    ].filter(Boolean).join('') || '0秒';
}

// --- Main Component ---
const TasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'running' | 'completed' | 'failed'>('all');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: '企业宣传片制作', type: 'video_generation', status: 'completed', progress: 100, createTime: '2024-01-15 14:30', actualTime: 180, resultUrl: '#', templateName: '商务模板' },
    { id: '2', name: '产品介绍视频', type: 'video_generation', status: 'running', progress: 75, createTime: '2024-01-15 15:45', estimatedTime: 240, templateName: '营销模板' },
    { id: '3', name: 'AI数字人视频', type: 'lip_sync', status: 'pending', progress: 0, createTime: '2024-01-15 16:20', estimatedTime: 300, templateName: '数字人模板' },
    { id: '4', name: '教学视频制作', type: 'video_generation', status: 'failed', progress: 45, createTime: '2024-01-15 13:15', errorMessage: '视频处理失败，请检查输入文件格式', templateName: '教育模板' },
    { id: '5', name: '声音克隆任务', type: 'voice_clone', status: 'completed', progress: 100, createTime: '2024-01-14 10:20', actualTime: 120, resultUrl: '#' },
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
    if (activeFilter === 'running') return ['running', 'pending'].includes(task.status);
    return task.status === activeFilter;
  });

  const handleTaskAction = (task: Task) => {
    const actions = [];
    if (['running', 'pending'].includes(task.status)) actions.push({ text: '取消任务', onPress: () => console.log('取消任务:', task.id) });
    if (task.status === 'failed') actions.push({ text: '重试', onPress: () => console.log('重试任务:', task.id) });
    if (task.status === 'completed' && task.resultUrl) actions.push({ text: '下载结果', onPress: () => console.log('下载:', task.resultUrl) });
    actions.push({ text: '删除', style: 'destructive' as const, onPress: () => console.log('删除任务:', task.id) }, { text: '关闭', style: 'cancel' as const });
    Alert.alert(task.name, '选择操作', actions);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderTaskItem = ({ item }: { item: Task }) => {
    const statusDetails = getStatusDetails(item.status);
    const typeDetails = getTaskTypeDetails(item.type);

    return (
      <TouchableOpacity style={styles.taskCard} onPress={() => handleTaskAction(item)}>
        <View style={styles.taskHeader}>
          <View style={[styles.taskIconContainer, { backgroundColor: statusDetails.color + '20' }]}>
            <Icon name={typeDetails.icon} size={24} color={statusDetails.color} />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.taskMeta}>
              <Text style={styles.metaText}>{typeDetails.label}</Text>
              {item.templateName && <Text style={styles.metaText}> • {item.templateName}</Text>}
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleTaskAction(item)}>
            <Icon name="more-vert" size={20} color={C.textSecondary} />
          </TouchableOpacity>
        </View>

        {(item.status === 'running' || item.status === 'failed') && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: statusDetails.color }]} /></View>
            <Text style={[styles.progressText, { color: statusDetails.color }]}>{item.progress}%</Text>
          </View>
        )}

        <View style={styles.taskFooter}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusDetails.color }]} />
            <Text style={[styles.statusText, { color: statusDetails.color }]}>{statusDetails.label}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Icon name="access-time" size={14} color={C.textTertiary} />
            <Text style={styles.timeText}>{item.createTime}</Text>
          </View>
        </View>

        {item.status === 'failed' && item.errorMessage && (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={16} color={C.stateError} />
            <Text style={styles.errorText} numberOfLines={2}>{item.errorMessage}</Text>
          </View>
        )}

        {item.status === 'completed' && item.actualTime && (
          <View style={styles.completedInfo}>
            <Icon name="done" size={16} color={C.accentNeonGreen} />
            <Text style={styles.completedText}>耗时 {formatDuration(item.actualTime)}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>任务统计</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}><Text style={styles.statNumber}>{taskStats.total}</Text><Text style={styles.statLabel}>总数</Text></View>
          <View style={styles.statItem}><Text style={[styles.statNumber, { color: C.accentTechBlue }]}>{taskStats.running}</Text><Text style={styles.statLabel}>进行中</Text></View>
          <View style={styles.statItem}><Text style={[styles.statNumber, { color: C.accentNeonGreen }]}>{taskStats.completed}</Text><Text style={styles.statLabel}>已完成</Text></View>
          <View style={styles.statItem}><Text style={[styles.statNumber, { color: C.stateError }]}>{taskStats.failed}</Text><Text style={styles.statLabel}>失败</Text></View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
        {filterOptions.map((filter) => (
          <TouchableOpacity key={filter.key} style={[styles.filterButton, activeFilter === filter.key && styles.activeFilterButton]} onPress={() => setActiveFilter(filter.key)}>
            <Icon name={filter.icon} size={18} color={activeFilter === filter.key ? C.bgDeepSpace : C.textSecondary} />
            <Text style={[styles.filterText, activeFilter === filter.key && styles.activeFilterText]}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={styles.tasksList}
        contentContainerStyle={styles.tasksContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accentTechBlue} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color={C.textTertiary} />
            <Text style={styles.emptyTitle}>暂无任务</Text>
            <Text style={styles.emptySubtitle}>去首页创建你的第一个任务吧</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bgDeepSpace, padding: S.md },
  statsCard: { backgroundColor: C.bgPanel, borderRadius: R.md, padding: S.lg, marginBottom: S.md, borderWidth: 1, borderColor: C.lineSubtle },
  statsTitle: { fontSize: TY.sizes.lg, fontWeight: TY.weights.semiBold, color: C.textTitle, marginBottom: S.lg },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: TY.sizes.xl, fontWeight: TY.weights.bold, color: C.textPrimary, marginBottom: S.xs, fontFamily: 'monospace' },
  statLabel: { fontSize: TY.sizes.sm, color: C.textSecondary },
  
  filtersContainer: { flexGrow: 0, marginBottom: S.md },
  filtersContent: { paddingRight: S.md, gap: S.sm },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bgPanel, paddingHorizontal: S.md, paddingVertical: S.sm, borderRadius: R.full, borderWidth: 1, borderColor: C.lineSubtle, gap: S.sm },
  activeFilterButton: { backgroundColor: C.accentTechBlue, borderColor: C.accentTechBlue },
  filterText: { fontSize: TY.sizes.sm, fontWeight: TY.weights.medium, color: C.textSecondary },
  activeFilterText: { color: C.bgDeepSpace },
  
  tasksList: { flex: 1 },
  tasksContent: { paddingBottom: S.xl },
  taskCard: { backgroundColor: C.bgPanel, borderRadius: R.md, padding: S.md, marginBottom: S.md, borderWidth: 1, borderColor: C.lineSubtle },
  taskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: S.md },
  taskIconContainer: { width: 48, height: 48, borderRadius: R.md, justifyContent: 'center', alignItems: 'center', marginRight: S.md },
  taskInfo: { flex: 1 },
  taskName: { fontSize: TY.sizes.base, fontWeight: TY.weights.semiBold, color: C.textPrimary, marginBottom: S.xs },
  taskMeta: { flexDirection: 'row' },
  metaText: { fontSize: TY.sizes.sm, color: C.textSecondary },
  actionButton: { padding: S.xs },
  
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: S.md, marginBottom: S.md },
  progressBar: { flex: 1, height: 6, backgroundColor: C.bgLayer, borderRadius: R.sm, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: R.sm },
  progressText: { fontSize: TY.sizes.sm, fontWeight: TY.weights.medium, fontFamily: 'monospace' },
  
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  statusDot: { width: 8, height: 8, borderRadius: R.full },
  statusText: { fontSize: TY.sizes.sm, fontWeight: TY.weights.medium },
  timeInfo: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  timeText: { fontSize: TY.sizes.xs, color: C.textTertiary, fontFamily: 'monospace' },
  
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.stateError + '1A', borderRadius: R.sm, padding: S.sm, marginTop: S.sm, gap: S.sm },
  errorText: { fontSize: TY.sizes.sm, color: C.stateError, flex: 1 },
  
  completedInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.accentNeonGreen + '1A', borderRadius: R.sm, padding: S.sm, marginTop: S.sm, gap: S.sm },
  completedText: { fontSize: TY.sizes.sm, color: C.accentNeonGreen, fontWeight: TY.weights.medium },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: S.xxxl },
  emptyTitle: { fontSize: TY.sizes.lg, fontWeight: TY.weights.medium, color: C.textSecondary, marginTop: S.lg, marginBottom: S.xs },
  emptySubtitle: { fontSize: TY.sizes.base, color: C.textTertiary },
});

export default TasksScreen;