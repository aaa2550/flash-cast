import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import BottomTabBar, { TabName } from './components/BottomTabBar';
import HomeScreen from './screens/HomeScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import TasksScreen from './screens/TasksScreen';
import ProfileScreen from './screens/ProfileScreen';
import { SimpleLoginScreen } from './screens/auth/SimpleLoginScreen';
import { DebugAuthScreen } from './screens/auth/DebugAuthScreen';
import { Colors } from './styles/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// 主应用内容组件
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabName>('Home');

  // 登录后强制跳转首页
  React.useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined' && window.localStorage) {
      if (window.localStorage.getItem('loginToHome') === '1') {
        setActiveTab('Home');
        window.localStorage.removeItem('loginToHome');
      }
    }
  }, [isAuthenticated]);

  // 如果未登录，显示登录页面
  if (!isAuthenticated) {
    return <SimpleLoginScreen />;
  }

  // 已登录，显示主应用
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Resources':
        return <ResourcesScreen />;
      case 'Tasks':
        return <TasksScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.surface} barStyle="dark-content" />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
  },
});

export default App;