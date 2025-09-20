import React, { useState } from 'react';
import { Checkbox } from '../../components/Checkbox';
import { authService } from '../../services/auth';
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
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 获取验证码按钮点击
  const handleSendCode = async () => {
    if (!phone) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    try {
      setCodeCountdown(60);
      const res = await authService.sendVerifyCode({ phone });
      if (res.code === 200) {
        Alert.alert('验证码已发送', '请查收短信验证码');
      } else {
        Alert.alert('错误', res.message || '验证码发送失败');
      }
    } catch (e: any) {
      Alert.alert('错误', e.message || '验证码发送失败');
      setCodeCountdown(0);
    }
  };

  // 倒计时效果
  React.useEffect(() => {
    if (codeCountdown > 0) {
      const timer = setTimeout(() => setCodeCountdown(codeCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeCountdown]);
  const handleLogin = async () => {
    if (!phone || !verifyCode) {
      Alert.alert('提示', '请输入手机号和验证码');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('提示', '请先阅读并同意用户协议和隐私政策');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login({ phone, verifyCode });
      if (res.code === 200) {
        const { userDO, token } = res.data;
        await login(userDO, token);
        Alert.alert('成功', '登录成功！即将进入首页');
      } else {
        Alert.alert('错误', res.message || '登录失败');
      }
    } catch (e: any) {
      Alert.alert('错误', e.message || '登录失败');
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="请输入验证码"
                value={verifyCode}
                onChangeText={setVerifyCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.codeButton, codeCountdown > 0 && styles.codeButtonDisabled]}
                onPress={handleSendCode}
                disabled={codeCountdown > 0}
              >
                <Text style={styles.codeButtonText}>
                  {codeCountdown > 0 ? `${codeCountdown}s后重试` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.agreementContainer}>
            <Checkbox
              checked={agreeTerms}
              onPress={() => setAgreeTerms(!agreeTerms)}
              size="small"
            />
            <View style={styles.agreementTextContainer}>
              <Text style={styles.agreementText}>我已阅读并同意</Text>
              <TouchableOpacity onPress={() => Alert.alert('用户协议', '用户协议内容...')}>
                <Text style={styles.agreementLink}>《用户协议》</Text>
              </TouchableOpacity>
              <Text style={styles.agreementText}>和</Text>
              <TouchableOpacity onPress={() => Alert.alert('隐私政策', '隐私政策内容...')}>
                <Text style={styles.agreementLink}>《隐私政策》</Text>
              </TouchableOpacity>
            </View>
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
            未注册手机号将自动注册并登录。登录即表示同意《用户协议》和《隐私政策》
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
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  agreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  agreementText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textTertiary,
  },
  agreementLink: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    textDecorationLine: 'underline',
    marginHorizontal: 2,
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
  codeButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginLeft: Spacing.md,
  },
  codeButtonDisabled: {
    backgroundColor: Colors.textDisabled,
  },
  codeButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
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