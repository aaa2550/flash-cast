import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts';
import { RootStackParamList } from '../../navigation';
import { authService } from '../../services';
import { validatePhone, validateVerifyCode } from '../../utils';
import { TechTheme } from '../../styles/theme';

const C = TechTheme.colors;
const S = TechTheme.spacing;
const R = TechTheme.radius;
const TY = TechTheme.typography;

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// --- Styled Components ---

const TechInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  maxLength,
  secureTextEntry = false,
  style,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
  maxLength?: number;
  secureTextEntry?: boolean;
  style?: any;
  error?: string | null;
}) => (
  <View style={[styles.inputContainer, style]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, error ? styles.inputError : null]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.textTertiary}
      keyboardType={keyboardType}
      maxLength={maxLength}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
    {error && <Text style={styles.inputErrorMessage}>{error}</Text>}
  </View>
);

const TechButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}) => {
  const variantStyles = variant === 'outline' 
    ? { backgroundColor: 'transparent', borderColor: C.lineSubtle }
    : { backgroundColor: C.accentTechBlue, borderColor: C.accentTechBlue };

  return (
    <TouchableOpacity
      style={[
        styles.techButton,
        variantStyles,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? C.bgDeepSpace : C.accentTechBlue} />
      ) : (
        <Text style={[
          styles.techButtonText,
          variant === 'primary' && styles.techButtonTextPrimary,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const Checkbox = ({ checked, onPress }: { checked: boolean; onPress: () => void }) => (
  <TouchableOpacity style={styles.checkboxBase} onPress={onPress}>
    {checked && <View style={styles.checkboxCheck} />}
  </TouchableOpacity>
);

// --- Login Screen ---

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setSendCodeLoading(true);
    try {
      await authService.sendVerifyCode({ phone });
      setCountdown(60);
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
        await login(userDO, token);
        // Navigation will be handled by AuthContext
      } else {
        Alert.alert('登录失败', loginResponse.message || '未知错误');
      }
    } catch (error: any) {
      Alert.alert('登录出错', error.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const canLogin = validatePhone(phone) && validateVerifyCode(verifyCode) && agreeTerms;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Flash Cast</Text>
          <Text style={styles.subtitle}>智能生成主播口播视频</Text>
        </View>

        <View style={styles.form}>
          <TechInput
            label="手机号"
            placeholder="请输入您的手机号"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
          />

          <View style={styles.codeContainer}>
            <TechInput
              label="验证码"
              placeholder="6位验证码"
              value={verifyCode}
              onChangeText={setVerifyCode}
              keyboardType="numeric"
              maxLength={6}
              style={{ flex: 1 }}
            />
            <TechButton
              title={countdown > 0 ? `${countdown}s` : '获取验证码'}
              onPress={handleSendCode}
              variant="outline"
              disabled={countdown > 0 || !validatePhone(phone) || sendCodeLoading}
              loading={sendCodeLoading}
              style={styles.codeButton}
            />
          </View>

          <View style={styles.agreementContainer}>
            <Checkbox
              checked={agreeTerms}
              onPress={() => setAgreeTerms(!agreeTerms)}
            />
            <View style={styles.agreementTextContainer}>
              <Text style={styles.agreementText}>我已阅读并同意</Text>
              <TouchableOpacity onPress={() => Alert.alert('用户协议', '此处为用户协议内容。')}>
                <Text style={styles.agreementLink}>《用户协议》</Text>
              </TouchableOpacity>
              <Text style={styles.agreementText}>和</Text>
              <TouchableOpacity onPress={() => Alert.alert('隐私政策', '此处为隐私政策内容。')}>
                <Text style={styles.agreementLink}>《隐私政策》</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TechButton
            title="登录 / 注册"
            onPress={handleLogin}
            fullWidth
            loading={loading}
            disabled={!canLogin || loading}
            style={styles.loginButton}
          />

          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              未注册的手机号验证后将自动创建账号
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgDeepSpace,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: S.lg,
    paddingVertical: S.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: S.xxxl,
  },
  title: {
    fontSize: TY.sizes.xxxl,
    fontWeight: TY.weights.bold,
    color: C.textTitle,
    marginBottom: S.sm,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: TY.sizes.base,
    color: C.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: S.lg,
    width: '100%',
  },
  inputLabel: {
    color: C.textSecondary,
    fontSize: TY.sizes.sm,
    marginBottom: S.xs,
    fontWeight: TY.weights.medium,
  },
  input: {
    backgroundColor: C.bgLayer,
    borderWidth: 1,
    borderColor: C.lineSubtle,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    height: 48,
    color: C.textPrimary,
    fontSize: TY.sizes.base,
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
  },
  inputError: {
    borderColor: C.stateError,
  },
  inputErrorMessage: {
    color: C.stateError,
    fontSize: TY.sizes.xs,
    marginTop: S.xs,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: S.sm,
  },
  codeButton: {
    height: 48,
    minWidth: 110,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: S.lg,
    marginBottom: S.xl,
    paddingHorizontal: S.xs,
  },
  agreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: S.sm,
  },
  agreementText: {
    fontSize: TY.sizes.sm,
    color: C.textSecondary,
    lineHeight: 20,
  },
  agreementLink: {
    fontSize: TY.sizes.sm,
    color: C.accentTechBlue,
    textDecorationLine: 'underline',
  },
  loginButton: {
    height: 52,
    ...TY.shadows.md,
  },
  hintContainer: {
    alignItems: 'center',
    marginTop: S.lg,
  },
  hintText: {
    fontSize: TY.sizes.sm,
    color: C.textTertiary,
  },
  techButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.lg,
  },
  techButtonText: {
    fontSize: TY.sizes.base,
    fontWeight: TY.weights.semiBold,
    color: C.textPrimary,
  },
  techButtonTextPrimary: {
    color: C.bgDeepSpace,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  checkboxBase: {
    width: 20,
    height: 20,
    borderRadius: R.sm,
    borderWidth: 2,
    borderColor: C.accentTechBlue,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.bgLayer,
  },
  checkboxCheck: {
    width: 10,
    height: 10,
    backgroundColor: C.accentNeonGreen,
    borderRadius: 2,
  },
});