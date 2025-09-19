// Web兼容的图标组件
import React from 'react';
import { Text, TextStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

// Material Icons 的 Unicode 映射
const iconMap: { [key: string]: string } = {
  // 导航图标
  'home': '🏠',
  'folder': '📁',
  'assignment': '📋',
  'person': '👤',
  
  // 功能图标
  'add': '➕',
  'add-circle': '⊕',
  'cloud-upload': '☁️',
  'notifications': '🔔',
  'edit': '✏️',
  'more-vert': '⋮',
  'chevron-right': '▶',
  'close': '✕',
  'star': '⭐',
  'check-circle': '✅',
  'error-outline': '⚠️',
  'play-circle-outline': '▶️',
  'list': '📝',
  'done': '✓',
  'access-time': '🕐',
  'movie': '🎬',
  'music-note': '🎵',
  'description': '📄',
  'video-library': '🎥',
  'videocam': '📹',
  'audiotrack': '🎵',
  'record-voice-over': '🎙️',
  'voice-over-off': '🔇',
  'work': '💼',
  'sync': '🔄',
  'error': '❌',
  'info': 'ℹ️',
  'help': '❓',
  'logout': '🚪',
  'autorenew': '🔄',
  'folder-open': '📂',
  'folder-special': '📁',
  'library-books': '📚',
  'insert-drive-file': '📄',
  'remove-circle': '➖',
  'arrow-upward': '⬆️',
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  const iconChar = iconMap[name] || '❓';
  
  return (
    <Text
      style={[
        {
          fontSize: size,
          color: color,
          lineHeight: size,
          textAlign: 'center',
          width: size,
          height: size,
        },
        style,
      ]}
    >
      {iconChar}
    </Text>
  );
};

export default Icon;