import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { TechTheme } from '../../styles/theme';

const C = TechTheme.colors;
const S = TechTheme.spacing;
const R = TechTheme.radius;
const TY = TechTheme.typography;

const { width: screenWidth } = Dimensions.get('window');

// 几何网格背景组件
const GridBackground = () => (
  <View style={styles.gridBackground}>
    {Array.from({ length: 20 }).map((_, i) => (
      <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: i * 50 }]} />
    ))}
    {Array.from({ length: 30 }).map((_, i) => (
      <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * 50 }]} />
    ))}
  </View>
);

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

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

// 自动提取视频首帧为封面组件（TSX标准写法，适配web）
interface VideoCoverWithAutoThumbProps {
  video: TemplateVideo;
  playing: boolean;
}

const VideoCoverWithAutoThumb: React.FC<VideoCoverWithAutoThumbProps> = ({ video, playing }) => {
  const [thumb, setThumb] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure this runs only on the client-side for web
    if (typeof window !== 'undefined' && !thumb && !video.thumbnailUrl && video.videoUrl && !playing) {
      const v = document.createElement('video');
      v.src = video.videoUrl;
      v.crossOrigin = 'anonymous';
      v.currentTime = 0.1;
      v.muted = true;
      v.playsInline = true;
      v.addEventListener('loadeddata', function extract() {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = v.videoWidth;
          canvas.height = v.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
            setThumb(canvas.toDataURL('image/jpeg', 0.7));
          }
        } catch (e) {
          console.error("Failed to generate video thumbnail", e);
        }
      }, { once: true });
      v.load();
    }
  }, [thumb, video.thumbnailUrl, video.videoUrl, playing]);

  let coverUri = video.thumbnailUrl;
  if (!coverUri && thumb) {
    coverUri = thumb;
  }

  if (!coverUri) {
    return (
      <View style={[styles.thumbnailImage, { backgroundColor: C.bgPanel, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: C.textTertiary, fontSize: TY.sizes.xs }}>封面生成中</Text>
      </View>
    );
  }

  return (
    <View style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!playing && <Image source={{ uri: coverUri }} style={styles.thumbnailImage} />}
      {playing && (
        <video
          ref={videoRef}
          src={video.videoUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: R.md, background: '#000' }}
          controls
          autoPlay
        />
      )}
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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
    navigation.navigate('CreateTask');
  };

  const handleTemplateVideoPress = (templateVideo: TemplateVideo) => {
    // 预览模版视频或使用模版创建任务
    navigation.navigate('CreateTask', { templateId: templateVideo.id });
  };

  return (
    <View style={styles.container}>
      <GridBackground />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 头部欢迎区域 */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>欢迎使用 Flash Cast</Text>
          <Text style={styles.welcomeSubtitle}>AI 智能生成主播口播视频</Text>
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
                <Text style={styles.createButtonSubtitle}>从灵感开始，一键生成 AI 主播视频</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.createButtonArrow}>›</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 模版视频列表 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>探索视频模版</Text>
          <View style={styles.templateVideosList}>
            {templateVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.videoCard}
                onPress={() => handleTemplateVideoPress(video)}
                activeOpacity={0.8}
              >
                <View style={styles.videoThumbnail}>
                  <VideoCoverWithAutoThumb video={video} playing={false} />
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                  <View style={styles.videoDuration}>
                    <Text style={styles.durationText}>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</Text>
                  </View>
                  {video.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>热门</Text>
                    </View>
                  )}
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle} numberOfLines={1}>
                    {video.title}
                  </Text>
                  <Text style={styles.videoDescription} numberOfLines={2}>
                    {video.description}
                  </Text>
                  <View style={styles.categoryPill}>
                    <Text style={styles.videoCategory}>
                      {video.category}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgDeepSpace,
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: C.accentTechBlue,
  },
  horizontalLine: {
    height: 1,
    width: '100%',
  },
  verticalLine: {
    width: 1,
    height: '100%',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: S.xl,
    paddingTop: 60,
    paddingBottom: S.xl,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: TY.sizes.xxxl,
    fontWeight: TY.weights.bold,
    color: C.textTitle,
    marginBottom: S.sm,
    textShadowColor: C.accentTechBlue,
    textShadowRadius: 8,
  },
  welcomeSubtitle: {
    fontSize: TY.sizes.lg,
    color: C.textSecondary,
  },
  section: {
    marginTop: S.xxl,
    paddingHorizontal: S.lg,
  },
  sectionTitle: {
    fontSize: TY.sizes.xl,
    fontWeight: TY.weights.semiBold,
    color: C.textPrimary,
    marginBottom: S.lg,
    paddingLeft: S.xs,
  },
  createButton: {
    backgroundColor: C.bgPanel,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: S.lg,
    shadowColor: C.accentTechBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonIcon: {
    fontSize: 28,
    marginRight: S.md,
  },
  createButtonTextContainer: {
    flex: 1,
  },
  createButtonTitle: {
    fontSize: TY.sizes.lg,
    fontWeight: TY.weights.semiBold,
    color: C.textTitle,
    marginBottom: S.xs,
  },
  createButtonSubtitle: {
    fontSize: TY.sizes.sm,
    color: C.textSecondary,
    lineHeight: TY.lineHeights.normal,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: R.full,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonArrow: {
    fontSize: 24,
    color: C.accentTechBlue,
    fontWeight: TY.weights.light,
  },
  templateVideosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoCard: {
    width: (screenWidth - S.lg * 2 - S.md) / 2,
    backgroundColor: C.bgLayer,
    borderRadius: R.md,
    marginBottom: S.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  videoThumbnail: {
    height: 100,
    position: 'relative',
    backgroundColor: C.bgPanel,
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
    width: 36,
    height: 36,
    borderRadius: R.full,
    backgroundColor: 'rgba(15, 20, 25, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  playIcon: {
    color: C.accentTechBlue,
    fontSize: 14,
    marginLeft: 2,
  },
  videoDuration: {
    position: 'absolute',
    bottom: S.sm,
    right: S.sm,
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    borderRadius: R.sm,
  },
  durationText: {
    color: C.textPrimary,
    fontSize: TY.sizes.xs,
    fontWeight: TY.weights.medium,
  },
  popularBadge: {
    position: 'absolute',
    top: S.sm,
    left: S.sm,
    backgroundColor: C.accentTechBlue,
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    borderRadius: R.full,
  },
  popularBadgeText: {
    fontSize: 10,
    color: C.bgDeepSpace,
    fontWeight: TY.weights.bold,
  },
  videoInfo: {
    padding: S.md,
  },
  videoTitle: {
    fontSize: TY.sizes.sm,
    fontWeight: TY.weights.medium,
    color: C.textPrimary,
    marginBottom: S.xs,
  },
  videoDescription: {
    fontSize: TY.sizes.xs,
    color: C.textSecondary,
    lineHeight: TY.lineHeights.normal,
    height: 28,
    marginBottom: S.sm,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: R.full,
    paddingHorizontal: S.sm,
    paddingVertical: S.xs - 2,
  },
  videoCategory: {
    fontSize: TY.sizes.xs,
    color: C.accentTechBlue,
    fontWeight: TY.weights.medium,
  },
  bottomSpacing: {
    height: S.xxxl,
  },
});

export default HomeScreen;