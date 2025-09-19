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

const { width: screenWidth } = Dimensions.get('window');

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

const HomeScreen: React.FC = () => {
  // 模拟模版视频数据
  const templateVideos: TemplateVideo[] = [
    {
      id: '1',
      title: '商业产品介绍视频模版',
      description: '适合产品宣传和商业推广的专业视频模版',
      thumbnailUrl: 'https://via.placeholder.com/300x180?text=商业产品介绍',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: 120,
      category: '商业推广',
      isPopular: true,
    },
    {
      id: '2',
      title: '教育课程讲解视频模版',
      description: '清晰易懂的教育内容展示视频模版',
      thumbnailUrl: 'https://via.placeholder.com/300x180?text=教育课程讲解',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      duration: 180,
      category: '教育培训',
      isPopular: true,
    },
    {
      id: '3',
      title: '新闻资讯播报视频模版',
      description: '专业的新闻播报风格视频模版',
      thumbnailUrl: 'https://via.placeholder.com/300x180?text=新闻资讯播报',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
      duration: 150,
      category: '新闻播报',
    },
    {
      id: '4',
      title: '生活方式分享视频模版',
      description: '轻松自然的生活内容分享视频模版',
      thumbnailUrl: 'https://via.placeholder.com/300x180?text=生活方式分享',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: 90,
      category: '生活分享',
    },
    {
      id: '5',
      title: '科技产品评测视频模版',
      description: '专业的产品评测和介绍视频模版',
      thumbnailUrl: 'https://via.placeholder.com/300x180?text=科技产品评测',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      duration: 200,
      category: '产品介绍',
    },
    {
      id: '6',
      title: '健康养生指导视频模版',
      description: '健康生活方式的指导视频模版',
      thumbnailUrl: 'https://via.placeholder.com/300x180?text=健康养生指导',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: 160,
      category: '生活分享',
    },
  ];

  const handleCreateTask = () => {
    console.log('创建新任务');
  };

  const handleTemplateVideoPress = (templateVideo: TemplateVideo) => {
    console.log('选择模版视频:', templateVideo.title);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 头部欢迎区域 */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>欢迎使用 Flash Cast</Text>
          <Text style={styles.welcomeSubtitle}>AI智能生成主播口播视频</Text>
        </View>
      </View>

      {/* 快速创建区域 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速创建</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateTask}
          activeOpacity={0.8}
        >
          <View style={styles.createButtonContent}>
            <Text style={styles.createButtonIcon}>✨</Text>
            <View style={styles.createButtonTextContainer}>
              <Text style={styles.createButtonTitle}>创建新任务</Text>
              <Text style={styles.createButtonSubtitle}>快速生成AI主播视频</Text>
            </View>
            <Text style={styles.createButtonArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 模版视频列表 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>视频模版</Text>
        <View style={styles.templateVideosList}>
          {templateVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => handleTemplateVideoPress(video)}
              activeOpacity={0.8}
            >
              <View style={styles.videoThumbnail}>
                <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnailImage} />
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
                <View style={styles.videoDuration}>
                  <Text style={styles.durationText}>
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
                {video.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>热门</Text>
                  </View>
                )}
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.title}
                </Text>
                <Text style={styles.videoDescription} numberOfLines={2}>
                  {video.description}
                </Text>
                <Text style={styles.videoCategory}>
                  {video.category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 底部间距 */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 44,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  createButtonTextContainer: {
    flex: 1,
  },
  createButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  createButtonSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  createButtonArrow: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '300',
  },
  templateVideosList: {
    marginTop: 8,
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  videoThumbnail: {
    height: 180,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  playIcon: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 3,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 22,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  videoCategory: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;