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
import { Button, Input, Checkbox } from '../../components';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, SHADOWS } from '../../constants';
import { validatePhone, validateVerifyCode } from '../../utils';
import { authService } from '../../services';
import { RootStackParamList } from '../../navigation';
import { useAuth } from '../../contexts';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setSendCodeLoading(true);
    try {
      await authService.sendVerifyCode({ phone });
      
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
      
      Alert.alert('提示', '验证码已发送至您的手机');
    } catch (error: any) {
      Alert.alert('错误', error.message || '发送验证码失败');
    } finally {
      setSendCodeLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    if (!validateVerifyCode(verifyCode)) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('提示', '请先阅读并同意用户协议和隐私政策');
      return;
    }

    setLoading(true);
    try {
      const loginResponse = await authService.login({ phone, verifyCode });
      
      if (loginResponse.code === 0) {
        const { userDO, token } = loginResponse.data;
        
        // 使用AuthContext进行登录
        await login(userDO, token);
        
        const userNickname = userDO.nickname || `用户${userDO.phone?.slice(-4) || ''}`;
        
        Alert.alert('提示', `欢迎回来，${userNickname}！`, [
          { text: '确定', onPress: () => {
            // 不需要手动导航，AuthContext会自动处理
            console.log('登录成功，自动跳转到主页');
          }}
        ]);
      } else {
        Alert.alert('错误', loginResponse.message || '登录失败');
      }
    } catch (error: any) {
      // 处理验证码错误或其他错误
      let errorMessage = '登录失败，请稍后重试';
      
      if (error?.response?.data) {
        const responseData = error.response.data;
        errorMessage = responseData.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('错误', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const canLogin = () => {
    return validatePhone(phone) && 
           validateVerifyCode(verifyCode) && 
           agreeTerms;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Flash Cast</Text>
        <Text style={styles.subtitle}>智能生成主播口播视频</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="手机号"
          placeholder="请输入手机号"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={11}
          style={styles.input}
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
          <View style={styles.codeButtonContainer}>
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

        <Button
          title="登录"
          onPress={handleLogin}
          fullWidth
          loading={loading}
          disabled={!canLogin()}
          style={styles.loginButton}
        />

        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            未注册的手机号验证后将自动创建账号
          </Text>
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
    paddingVertical: SPACING.XL,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3XL'],
  },
  title: {
    fontSize: FONT_SIZES['4XL'],
    fontWeight: '700' as const,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZES.BASE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: SPACING.BASE,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.LG,
    gap: SPACING.SM,
  },
  codeInputContainer: {
    flex: 1,
  },
  codeInput: {
    marginBottom: 0,
  },
  codeButtonContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 2, // 微调使按钮与输入框完美对齐
  },
  codeButton: {
    minWidth: 100,
    height: 44, // 确保按钮高度与输入框一致
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.LG,
    paddingHorizontal: SPACING.XS,
  },
  agreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: SPACING.XS,
  },
  agreementText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  agreementLink: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
    marginHorizontal: 2,
  },
  loginButton: {
    marginBottom: SPACING.LG,
    ...SHADOWS.SM,
  },
  hintContainer: {
    alignItems: 'center',
  },
  hintText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});