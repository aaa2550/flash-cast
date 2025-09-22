import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Checkbox } from '@components';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '@constants';
import { validatePhone, validateVerifyCode, storageService } from '@utils';
import { authService } from '@services';
import { RootStackParamList } from '@navigation';
import { STORAGE_KEYS } from '@constants';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNicknameInput, setShowNicknameInput] = useState(false);

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

  // 登录/注册
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
      Alert.alert('提示', '请先同意用户协议和隐私政策');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.loginOrRegister({ 
        phone, 
        verifyCode, 
        agreeTerms,
        nickname: nickname.trim() || undefined
      });
      
      if (response.code === 0) {
        const { user, token, isNewUser } = response.data;
        
        // 保存用户信息和token
        await storageService.setString(STORAGE_KEYS.USER_TOKEN, token);
        await storageService.setObject(STORAGE_KEYS.USER_INFO, user);
        
        if (isNewUser) {
          Alert.alert('欢迎', `欢迎加入 Flash Cast，${user.nickname || '新用户'}！`, [
            { text: '开始体验', onPress: () => {/* 跳转到主页 */} }
          ]);
        } else {
          Alert.alert('提示', `欢迎回来，${user.nickname || '用户'}！`, [
            { text: '确定', onPress: () => {/* 跳转到主页 */} }
          ]);
        }
      } else {
        Alert.alert('错误', response.message);
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 检查是否可以登录
  const canLogin = () => {
    return validatePhone(phone) && 
           validateVerifyCode(verifyCode) && 
           agreeTerms &&
           (!showNicknameInput || nickname.trim().length >= 2);
  };

  // 用户协议内容
  const UserAgreement = () => (
    <Modal
      visible={showTermsModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>用户服务协议</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowTermsModal(false)}
          >
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.agreementText}>
            {`欢迎使用 Flash Cast！

1. 服务说明
Flash Cast 是一款智能生成主播口播视频的AI应用，为用户提供视频制作和编辑服务。

2. 账户管理
- 用户需提供真实有效的手机号码进行注册
- 用户需妥善保管账户信息，不得转让或授权他人使用
- 发现账户被盗用应立即联系客服

3. 使用规范
- 不得上传违法违规内容
- 不得侵犯他人知识产权
- 不得恶意攻击系统或其他用户

4. 隐私保护
- 我们重视用户隐私，严格按照隐私政策处理用户信息
- 不会未经授权向第三方披露用户个人信息

5. 服务变更
- 我们保留随时修改或终止服务的权利
- 重要变更将通过适当方式通知用户

6. 免责声明
- 因不可抗力导致的服务中断，我们不承担责任
- 用户因违规使用造成的损失由用户自行承担

7. 法律适用
本协议适用中华人民共和国法律，如有争议提交北京仲裁委员会仲裁。

最后更新：2025年9月17日`}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );

  // 隐私政策内容
  const PrivacyPolicy = () => (
    <Modal
      visible={showPrivacyModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>隐私政策</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPrivacyModal(false)}
          >
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.agreementText}>
            {`Flash Cast 隐私政策

我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。

1. 信息收集
我们会收集以下信息：
- 账户信息：手机号码、昵称
- 使用信息：操作日志、设备信息
- 上传内容：视频、音频文件

2. 信息使用
我们使用收集的信息用于：
- 提供和改进服务
- 用户身份验证
- 安全防护和风险控制
- 法律法规要求

3. 信息共享
我们不会向第三方出售、转让您的个人信息，除非：
- 获得您的明确同意
- 法律法规要求
- 维护公共安全

4. 信息安全
我们采用行业标准的安全措施：
- 数据加密传输和存储
- 访问权限控制
- 定期安全评估

5. 用户权利
您有权：
- 查询和更正个人信息
- 删除账户和相关数据
- 撤回授权同意

6. 联系我们
如有疑问，请联系：
邮箱：privacy@flashcast.com
电话：400-123-4567

最后更新：2025年9月17日`}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>手机号登录</Text>
        <Text style={styles.subtitle}>未注册手机号验证后将自动注册</Text>
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

        {showNicknameInput && (
          <Input
            label="昵称"
            placeholder="请输入昵称（可选）"
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
          />
        )}

        <View style={styles.agreementContainer}>
          <Checkbox
            checked={agreeTerms}
            onPress={() => setAgreeTerms(!agreeTerms)}
            size="small"
          />
          <View style={styles.agreementTextContainer}>
            <Text style={styles.agreementPrefix}>我已阅读并同意</Text>
            <TouchableOpacity onPress={() => setShowTermsModal(true)}>
              <Text style={styles.agreementLink}>《用户服务协议》</Text>
            </TouchableOpacity>
            <Text style={styles.agreementPrefix}>和</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(true)}>
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>登录即表示同意相关协议条款</Text>
        </View>
      </View>

      <UserAgreement />
      <PrivacyPolicy />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SPACING.lg,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-end',
  },
  codeInputContainer: {
    flex: 1,
  },
  codeInput: {
    flex: 1,
  },
  codeButton: {
    minWidth: 100,
    height: 50,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.md,
  },
  agreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  agreementPrefix: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  agreementLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: SPACING.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  closeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  agreementText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 22,
    color: COLORS.text,
  },
});