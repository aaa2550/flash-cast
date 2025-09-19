import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Typography, Spacing, CommonStyles, BorderRadius, Shadows } from '../../styles/theme';

export const SimpleLoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !verifyCode) {
      Alert.alert('提示', '请输入手机号和验证码');
      return;
    }

    setLoading(true);
    try {
      // 模拟登录成功
      const mockUser = {
        id: 1,
        phone: phone,
        nickname: '用户' + phone.slice(-4),
        avatar: '',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };
      const mockToken = 'mock_token_' + Date.now();
      
      await login(mockUser, mockToken);
      Alert.alert('成功', '登录成功！即将进入首页');
    } catch (error) {
      Alert.alert('错误', '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = async () => {
    try {
      // 清除所有存储
      const { storageService } = await import('../../utils');
      const { STORAGE_KEYS } = await import('../../constants');
      
      await storageService.remove(STORAGE_KEYS.USER_TOKEN);
      await storageService.remove(STORAGE_KEYS.USER_INFO);
      
      Alert.alert('成功', '存储已清除');
    } catch (error) {
      console.error('清除存储失败:', error);
    }
  };
        phone: phone,
        nickname: '用户' + phone.slice(-4),
        avatar: '',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };
      const mockToken = 'mock_token_' + Date.now();
      
      await login(mockUser, mockToken);
      Alert.alert('成功', '登录成功！');
    } catch (error) {
      Alert.alert('错误', '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Flash Cast</Text>
          <Text style={styles.subtitle}>智能生成主播口播视频</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>验证码</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入验证码"
              value={verifyCode}
              onChangeText={setVerifyCode}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? '登录中...' : '登录'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            提示：这是演示版本，输入任意手机号和验证码即可登录
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    color: Colors.textSecondary,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base,
    backgroundColor: Colors.background,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.textDisabled,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
  },
  hint: {
    fontSize: Typography.sizes.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: Typography.sizes.sm * 1.4,
  },
});