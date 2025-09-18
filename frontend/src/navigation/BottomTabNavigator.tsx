import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { COLORS, FONT_SIZES } from '@constants';
import { BottomTabParamList } from './types';

// 临时组件，后续会替换为实际页面
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>首页</Text>
  </View>
);

const MediaManageScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>媒体管理</Text>
  </View>
);

const VideoGenerateScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>视频生成</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>个人中心</Text>
  </View>
);

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY_500,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopWidth: 1,
          borderTopColor: COLORS.BORDER_LIGHT,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.SM,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? COLORS.PRIMARY : COLORS.GRAY_500 }}>
              🏠
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="MediaManage"
        component={MediaManageScreen}
        options={{
          tabBarLabel: '媒体管理',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? COLORS.PRIMARY : COLORS.GRAY_500 }}>
              📁
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="VideoGenerate"
        component={VideoGenerateScreen}
        options={{
          tabBarLabel: '视频生成',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? COLORS.PRIMARY : COLORS.GRAY_500 }}>
              🎬
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? COLORS.PRIMARY : COLORS.GRAY_500 }}>
              👤
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};