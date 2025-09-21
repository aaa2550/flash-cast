import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import { Colors, Typography, Spacing, Layout, Shadows, BorderRadius } from '../styles/theme';

export type TabName = 'Home' | 'Resources' | 'Tasks' | 'Profile';

interface Tab {
  name: TabName;
  label: string;
}

interface BottomTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const tabs: Tab[] = [
  { name: 'Home', label: '首页' },
  { name: 'Resources', label: '资源' },
  { name: 'Tasks', label: '任务' },
  { name: 'Profile', label: '我的' },
];

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            {/* 图标已移除，仅保留文字 */}
            <Text style={[
              styles.label,
              { color: isActive ? Colors.primary : Colors.textTertiary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl, // 为安全区域留出空间
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  icon: {
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    color: '#888',
    letterSpacing: 0.5,
  },
  activeLabel: {
    color: '#007AFF',
    fontWeight: '700' as const,
  },
});

export default BottomTabBar;