import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import { Colors, Typography, Spacing, Layout, Shadows, BorderRadius } from '../styles/theme';

export type TabName = 'Home' | 'Resources' | 'Tasks' | 'Profile';

interface Tab {
  name: TabName;
  label: string;
  icon: string;
}

interface BottomTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const tabs: Tab[] = [
  { name: 'Home', label: '首页', icon: 'home' },
  { name: 'Resources', label: '资源管理', icon: 'folder' },
  { name: 'Tasks', label: '任务列表', icon: 'assignment' },
  { name: 'Profile', label: '我的', icon: 'person' },
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
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? Colors.primary : Colors.textTertiary}
              style={styles.icon}
            />
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
    fontSize: Typography.sizes.xs,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
});

export default BottomTabBar;