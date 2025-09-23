import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { TechTheme } from '../styles/theme';

const { colors, spacing, radius, typography } = TechTheme;

// --- Mock Icon Component ---
// In a real app, you would use a proper icon library like @expo/vector-icons
const Icon = ({ name, color, size, style }: { name: string; color: string; size: number; style?: any }) => (
  <View style={[{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }, style]}>
    <Text style={{ color: colors.bgDeepSpace, textAlign: 'center', fontWeight: 'bold' }}>{name.charAt(0)}</Text>
  </View>
);
// --- End Mock Icon Component ---

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
  { name: 'Home', label: '主页', icon: 'home-outline' },
  { name: 'Resources', label: '资源', icon: 'cube-outline' },
  { name: 'Tasks', label: '任务', icon: 'checkmark-done-outline' },
  { name: 'Profile', label: '我的', icon: 'person-outline' },
];

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  const TabBarComponent = Platform.OS === 'ios' ? BlurView : View;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.accentTechBlue, colors.accentNeonGreen, colors.accentVibrant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBorder}
      />
      <TabBarComponent
        style={styles.tabBar}
        // @ts-ignore - tint and intensity are for BlurView
        tint="dark"
        intensity={80}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const iconColor = isActive ? colors.accentTechBlue : colors.textSecondary;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                {isActive && <View style={styles.activeIconGlow} />}
                <Icon
                  name={tab.icon}
                  size={26}
                  color={iconColor}
                />
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </TabBarComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  topBorder: {
    height: 2,
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    height: spacing.xxl + (Platform.OS === 'ios' ? spacing.lg : spacing.md), // Taller bar
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: Platform.OS === 'android' ? colors.bgTranslucent : 'transparent',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  activeIconGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accentTechBlue,
    borderRadius: radius.full,
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
  },
  label: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeLabel: {
    ...typography.bodySm,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});

export default BottomTabBar;