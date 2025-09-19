import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Typography, Spacing } from '../../styles/theme';

export const DebugAuthScreen: React.FC = () => {
  const { isAuthenticated, user, token, logout } = useAuth();

  const handleClearStorage = async () => {
    try {
      await logout();
      console.log('存储已清除，应该显示登录页面');
    } catch (error) {
      console.error('清除存储失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>认证状态调试</Text>
      
      <View style={styles.info}>
        <Text style={styles.label}>认证状态: {isAuthenticated ? '已登录' : '未登录'}</Text>
        <Text style={styles.label}>用户信息: {user ? user.nickname || user.phone : '无'}</Text>
        <Text style={styles.label}>Token: {token ? '存在' : '无'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleClearStorage}>
        <Text style={styles.buttonText}>清除存储并退出登录</Text>
      </TouchableOpacity>
      
      <Text style={styles.note}>
        如果显示"已登录"，说明应用记住了之前的登录状态。
        点击按钮可以清除存储，重新显示登录页面。
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700' as const,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  info: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 8,
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.error,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
  },
  note: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * 1.4,
  },
});