import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input } from '@components';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '@constants';
import { validatePhone, validateVerifyCode } from '@utils';
import { authService } from '@services';
import { RootStackParamList } from '@navigation';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);

  // 发送验证码
  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setSendCodeLoading(true);
    try {
      await authService.sendVerifyCode({ phone });
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      Alert.alert('提示', '验证码已发送');
    } catch (error: any) {
      Alert.alert('错误', error.message || '发送验证码失败');
    } finally {
      setSendCodeLoading(false);
    }
  };

  // 注册
  const handleRegister = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    if (!validateVerifyCode(verifyCode)) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }

    if (nickname.trim().length < 2) {
      Alert.alert('提示', '昵称至少2个字符');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({ 
        phone, 
        verifyCode, 
        nickname: nickname.trim() 
      });
      
      if (response.code === 0) {
        Alert.alert('提示', '注册成功', [
          { text: '确定', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('错误', response.message);
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  // 跳转到登录页面
  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>注册账号</Text>
        <Text style={styles.subtitle}>加入 Flash Cast</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="手机号"
          placeholder="请输入手机号"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={11}
        />

        <View style={styles.codeContainer}>
          <View style={styles.codeInputContainer}>
            <Input
              label="验证码"
              placeholder="请输入验证码"
              value={verifyCode}
              onChangeText={setVerifyCode}
              keyboardType="numeric"
              maxLength={6}
              style={styles.codeInput}
            />
          </View>
          <Button
            title={countdown > 0 ? `${countdown}s` : '获取验证码'}
            onPress={handleSendCode}
            variant="outline"
            size="medium"
            disabled={countdown > 0 || !validatePhone(phone)}
            loading={sendCodeLoading}
            style={styles.codeButton}
          />
        </View>

        <Input
          label="昵称"
          placeholder="请输入昵称"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
        />

        <Button
          title="注册"
          onPress={handleRegister}
          fullWidth
          loading={loading}
          disabled={
            !validatePhone(phone) || 
            !validateVerifyCode(verifyCode) || 
            nickname.trim().length < 2
          }
          style={styles.registerButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>已有账号？</Text>
          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.loginLink}>立即登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3XL'],
  },
  title: {
    fontSize: FONT_SIZES['3XL'],
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHTS.MEDIUM,
  },
  form: {
    width: '100%',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.BASE,
  },
  codeInputContainer: {
    flex: 1,
    marginRight: SPACING.SM,
  },
  codeInput: {
    marginBottom: 0,
  },
  codeButton: {
    minWidth: 100,
    marginBottom: SPACING.BASE,
  },
  registerButton: {
    marginTop: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.BASE,
    color: COLORS.TEXT_SECONDARY,
  },
  loginLink: {
    fontSize: FONT_SIZES.BASE,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    marginLeft: SPACING.XS,
  },
});