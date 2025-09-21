import React, { useEffect, useState, useRef } from 'react';
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


import { templateService, TemplateItem } from '../services/template';
import { API_CONFIG, RESOURCE_URL_PREFIX } from '../constants/config';
// Modal已移除，全部用useState

const HomeScreen: React.FC = () => {

  const [templateVideos, setTemplateVideos] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);

  useEffect(() => {
    templateService.getVideoTemplates().then(list => {
      setTemplateVideos(list);
      setLoading(false);
    });
  }, []);

  const handleCreateTask = () => {
    console.log('创建新任务');
  };

  const handleTemplateVideoPress = (templateVideo: TemplateItem) => {
    if (templateVideo.id === playingVideoId) {
      setPlayingVideoId(null); // 再次点击则关闭播放
    } else {
      setPlayingVideoId(templateVideo.id);
    }
  };

  if (loading) {
    return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><Text>加载中...</Text></View>;
  }

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
                <VideoCoverWithAutoThumb
                  video={video}
                  playing={playingVideoId === video.id}
                />

                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
                {/* 若有视频url可播放，可在此处增加视频播放按钮或预览 */}
                {video.isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>热门</Text>
                  </View>
                )}
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.name}
                </Text>
                <Text style={styles.videoDescription} numberOfLines={2}>
                  {video.description}
                </Text>
                {video.category && (
                  <Text style={styles.videoCategory}>
                    {video.category}
                  </Text>
                )}
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

// 自动提取视频首帧为封面组件（适配web，兜底默认图片）
import defaultCover from '../../assets/default_cover.png';

interface VideoCoverWithAutoThumbProps {
  video: TemplateItem;
  playing: boolean;
}

const VideoCoverWithAutoThumb: React.FC<VideoCoverWithAutoThumbProps> = ({ video, playing }) => {
  const [thumb, setThumb] = useState<string | null>(null);
  const [showPlayIcon, setShowPlayIcon] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 拼接资源前缀
  const videoUrl = video.videoUrl ? RESOURCE_URL_PREFIX + video.videoUrl : (video.url ? RESOURCE_URL_PREFIX + video.url : '');

  useEffect(() => {
    if (!thumb && videoUrl && !playing) {
      const v = document.createElement('video');
      v.src = videoUrl;
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
          ctx && ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          setThumb(canvas.toDataURL('image/jpeg', 0.7));
        } catch (e) {
          setThumb(null);
        }
      }, { once: true });
      v.load();
    }
  }, [thumb, videoUrl, playing]);

  // 控制播放按钮显示
  useEffect(() => {
    if (playing && videoRef.current) {
      const v = videoRef.current;
      const updateIcon = () => setShowPlayIcon(v.paused);
      v.addEventListener('play', updateIcon);
      v.addEventListener('pause', updateIcon);
      v.addEventListener('ended', updateIcon);
      // 立即同步一次状态，确保自动播放时图标消失
      setTimeout(() => updateIcon(), 0);
      return () => {
        v.removeEventListener('play', updateIcon);
        v.removeEventListener('pause', updateIcon);
        v.removeEventListener('ended', updateIcon);
      };
    } else {
      setShowPlayIcon(true);
    }
  }, [playing]);

  const coverUri = thumb;

  return (
    <View style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!playing && coverUri && (
        <Image source={{ uri: coverUri }} style={styles.thumbnailImage} />
      )}
      {playing && videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12, background: '#000' }}
          controls
          autoPlay
        />
      )}
      {showPlayIcon && (
        <View style={styles.playButton} pointerEvents="none">
          <Text style={styles.playIcon}>▶</Text>
        </View>
      )}
    </View>
  );
};