import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Colors } from '../styles/theme';

// 模版视频数据接口
interface TemplateVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // 秒
  category: string;
  isPopular?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - Spacing.screenPadding * 2 - Spacing.md) / 2;

const HomeScreen: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: '商务汇报',
      description: '专业的商务演示模板',
      thumbnail: 'https://via.placeholder.com/300x200?text=商务汇报',
      category: '商务',
      duration: 60,
      isPremium: false,
    },
    {
      id: '2',
      name: '产品介绍',
      description: '突出产品特色的介绍模板',
      thumbnail: 'https://via.placeholder.com/300x200?text=产品介绍',
      category: '营销',
      duration: 90,
      isPremium: true,
    },
    {
      id: '3',
      name: '教育培训',
      description: '清晰易懂的教学模板',
      thumbnail: 'https://via.placeholder.com/300x200?text=教育培训',
      category: '教育',
      duration: 120,
      isPremium: false,
    },
    {
      id: '4',
      name: '营销推广',
      description: '吸引眼球的营销内容模板',
      thumbnail: 'https://via.placeholder.com/300x200?text=营销推广',
      category: '营销',
      duration: 45,
      isPremium: true,
    },
  ]);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: '创建视频',
      icon: 'videocam',
      color: Colors.primary,
      onPress: () => console.log('创建视频'),
    },
    {
      id: '2',
      title: '上传资源',
      icon: 'cloud-upload',
      color: Colors.success,
      onPress: () => console.log('上传资源'),
    },
    {
      id: '3',
      title: '模板库',
      icon: 'library-books',
      color: Colors.accent,
      onPress: () => console.log('模板库'),
    },
    {
      id: '4',
      title: '我的作品',
      icon: 'folder-special',
      color: Colors.premium,
      onPress: () => console.log('我的作品'),
    },
  ];

  const handleTemplatePress = (template: Template) => {
    console.log('选择模板:', template.name);
  };

  const handleCreateTask = () => {
    console.log('开始创建任务');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 头部欢迎区域 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>你好! 👋</Text>
          <Text style={styles.subtitle}>开始创建你的AI视频作品</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 创建任务按钮 */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
        <View style={styles.createButtonContent}>
          <Icon name="add-circle" size={32} color={Colors.textLight} />
          <Text style={styles.createButtonText}>创建新任务</Text>
          <Text style={styles.createButtonSubtext}>选择模板开始制作视频</Text>
        </View>
      </TouchableOpacity>

      {/* 快速操作 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速操作</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionCard, { backgroundColor: action.color + '15' }]}
              onPress={action.onPress}
            >
              <Icon name={action.icon} size={28} color={action.color} />
              <Text style={[styles.quickActionText, { color: action.color }]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 热门模板 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>热门模板</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templatesContainer}
        >
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleTemplatePress(template)}
            >
              <View style={styles.templateImageContainer}>
                <Image source={{ uri: template.thumbnail }} style={styles.templateImage} />
                {template.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Icon name="star" size={12} color={Colors.textLight} />
                    <Text style={styles.premiumText}>PRO</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.templateInfo}>
                <Text style={styles.templateName} numberOfLines={1}>
                  {template.name}
                </Text>
                <Text style={styles.templateDescription} numberOfLines={2}>
                  {template.description}
                </Text>
                <View style={styles.templateMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="access-time" size={14} color={Colors.textTertiary} />
                    <Text style={styles.metaText}>{template.duration}s</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{template.category}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 最近任务 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近任务</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentTasksContainer}>
          <View style={styles.recentTaskCard}>
            <View style={styles.taskIconContainer}>
              <Icon name="video-library" size={24} color={Colors.primary} />
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>产品宣传片</Text>
              <Text style={styles.taskSubtitle}>商务模板 • 2分钟前</Text>
            </View>
            <View style={styles.taskStatus}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.statusText}>已完成</Text>
            </View>
          </View>
          
          <View style={styles.recentTaskCard}>
            <View style={styles.taskIconContainer}>
              <Icon name="video-library" size={24} color={Colors.warning} />
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>教学视频</Text>
              <Text style={styles.taskSubtitle}>教育模板 • 进行中</Text>
            </View>
            <View style={styles.taskStatus}>
              <View style={[styles.statusDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.statusText}>75%</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    paddingHorizontal: Spacing.screenPadding,
  },
  
  header: {
    ...CommonStyles.rowBetween,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  
  greeting: {
    fontSize: Typography.sizes.xxl,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    ...CommonStyles.center,
    ...Shadows.small,
  },
  
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  
  createButtonContent: {
    ...CommonStyles.center,
  },
  
  createButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  
  createButtonSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  
  section: {
    marginBottom: Spacing.xxl,
  },
  
  sectionHeader: {
    ...CommonStyles.rowBetween,
    marginBottom: Spacing.lg,
  },
  
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  
  viewAllText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  
  quickActionCard: {
    width: cardWidth,
    aspectRatio: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...CommonStyles.center,
  },
  
  quickActionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    marginTop: Spacing.sm,
  },
  
  templatesContainer: {
    paddingRight: Spacing.screenPadding,
  },
  
  templateCard: {
    width: 200,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    ...Shadows.small,
  },
  
  templateImageContainer: {
    position: 'relative',
  },
  
  templateImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    resizeMode: 'cover' as const,
  },
  
  premiumBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.premium,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    ...CommonStyles.rowCenter,
    gap: 2,
  },
  
  premiumText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  
  templateInfo: {
    padding: Spacing.md,
  },
  
  templateName: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  templateDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeights.normal,
  },
  
  templateMeta: {
    ...CommonStyles.rowBetween,
  },
  
  metaItem: {
    ...CommonStyles.row,
    gap: Spacing.xs,
  },
  
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
  
  categoryBadge: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  
  categoryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  
  recentTasksContainer: {
    gap: Spacing.sm,
  },
  
  recentTaskCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...CommonStyles.row,
    ...Shadows.small,
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
  
  taskTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  taskSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  
  taskStatus: {
    alignItems: 'flex-end',
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xs,
  },
  
  statusText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
});

export default HomeScreen;