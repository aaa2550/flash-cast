import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { sendCode, loginWithCode, LoginResponse } from '../services/api';

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: ${theme.colors.bgDeep};
  overflow: hidden;
  position: relative;
`;

const GridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(${theme.colors.border} 1px, transparent 1px),
    linear-gradient(to right, ${theme.colors.border} 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.2;
`;

const LoginBox = styled.div`
  background: ${theme.colors.bgSlight};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.border};
  width: 100%;
  max-width: 400px;
  z-index: 1;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      transparent,
      ${theme.colors.primary},
      transparent 30%
    );
    animation: ${keyframes`
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    `} 4s linear infinite;
  }
`;

const InnerContent = styled.div`
  background: ${theme.colors.bgSlight};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.h1};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  text-shadow: ${theme.shadows.glow};
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: ${theme.spacing.lg};
`;

const Input = styled.input`
  width: 100%;
  background: ${theme.colors.bgDeep};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.text};
  font-size: ${theme.typography.body};
  font-family: ${theme.typography.fontFamily};
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.glow};
  }
`;

const CodeButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 1px solid ${props => (props.disabled ? theme.colors.textSecondary : theme.colors.primary)};
  color: ${props => (props.disabled ? theme.colors.textSecondary : theme.colors.primary)};
  border-radius: ${theme.radius.sm};
  padding: ${theme.spacing.sm};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  font-family: ${theme.typography.fontFamily};
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primary};
    color: ${theme.colors.bgDeep};
  }
`;

const Agreement = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  font-size: 0.8rem;
`;

const Checkbox = styled.input`
  margin-right: ${theme.spacing.sm};
  accent-color: ${theme.colors.primary};
`;

const AgreementLink = styled.a`
  color: ${theme.colors.primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
  border: none;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.white};
  font-size: ${theme.typography.body};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    box-shadow: ${theme.shadows.glow};
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error};
  text-align: center;
  margin-top: ${theme.spacing.md};
  min-height: 1.2rem;
`;

// --- Component ---

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isPhoneValid = /^\d{11}$/.test(phone);
  const isCodeValid = /^\d{6}$/.test(code);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const extractMessage = (err: any): string => {
    if (!err) return '未知错误';
    const data = err.response?.data;
    if (!data) return err.message || '网络错误';
    // 常见字段 message / msg / error / detail / description
    return (
      data.message || data.msg || data.error || data.detail || data.description || err.message || '请求失败'
    );
  };

  const handleSendCode = async () => {
    if (!isPhoneValid) {
      setError('请输入有效的11位手机号码');
      return;
    }
    setError('');
    try {
      await sendCode(phone);
      setCountdown(60);
    } catch (err) {
      setError(extractMessage(err));
    }
  };

  const handleLogin = async () => {
    if (!isPhoneValid) {
      setError('请输入有效的11位手机号码');
      return;
    }
    if (!isCodeValid) {
      setError('请输入6位数字验证码');
      return;
    }
    if (!agreed) {
      setError('请先阅读并同意用户协议');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await loginWithCode(phone, code);
      const data: LoginResponse = response.data.data;
      localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.userDO));
  router.push('/generate');
    } catch (err: any) {
      setError(extractMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <GridBackground />
      <LoginBox>
        <InnerContent>
          <Title>光速投</Title>
          <InputGroup>
            <Input
              type="tel"
              placeholder="手机号码"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
          </InputGroup>
          <InputGroup>
            <Input
              type="text"
              placeholder="6位验证码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
            />
            <CodeButton onClick={handleSendCode} disabled={!isPhoneValid || countdown > 0}>
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </CodeButton>
          </InputGroup>
          <Agreement>
            <Checkbox
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            我已阅读并同意
            <AgreementLink href="/user-agreement" target="_blank">用户协议</AgreementLink>
          </Agreement>
          <LoginButton onClick={handleLogin} disabled={!isPhoneValid || !isCodeValid || !agreed || isLoading}>
            {isLoading ? '登录中...' : '登录 / 注册'}
          </LoginButton>
          <ErrorMessage>{error}</ErrorMessage>
        </InnerContent>
      </LoginBox>
    </PageContainer>
  );
};

export default LoginScreen;
