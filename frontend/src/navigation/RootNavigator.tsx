import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { LoginScreen } from '@screens/auth/LoginScreen';

const RegisterScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>注册页面</Text>
  </View>
);

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  // 这里可以添加用户登录状态检查逻辑
  const isAuthenticated = false; // 临时设置，后续从状态管理中获取

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        // 已登录用户的页面
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          {/* 其他页面可以在这里添加 */}
        </>
      ) : (
        // 未登录用户的页面
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};