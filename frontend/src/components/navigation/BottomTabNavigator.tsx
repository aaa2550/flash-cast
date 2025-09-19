import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from '../Icon';

export type MainTabParamList = {
  Home: undefined;
  Resources: undefined;
  Tasks: undefined;
  Profile: undefined;
};

interface BottomTabNavigatorProps {
  navigation: NavigationProp<MainTabParamList>;
  currentRoute: keyof MainTabParamList;
}

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({ 
  navigation, 
  currentRoute 
}) => {
  const tabs = [
    { key: 'Home', label: '首页', icon: 'home' },
    { key: 'Resources', label: '资源', icon: 'folder' },
    { key: 'Tasks', label: '任务', icon: 'assignment' },
    { key: 'Profile', label: '我的', icon: 'person' },
  ] as const;

  const handleTabPress = (tabKey: keyof MainTabParamList) => {
    if (tabKey !== currentRoute) {
      navigation.navigate(tabKey);
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            currentRoute === tab.key && styles.activeTab,
          ]}
          onPress={() => handleTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <Icon 
            name={tab.icon}
            size={24}
            color={currentRoute === tab.key ? '#007AFF' : '#999'}
            style={styles.tabIcon}
          />
          <Text style={[
            styles.tabLabel,
            currentRoute === tab.key && styles.activeTabLabel,
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingBottom: 20, // 安全区域
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // 活跃状态的特殊样式可以在这里添加
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default BottomTabNavigator;