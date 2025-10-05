import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { getDouyinQRCode, getDouyinScanStatus, DouyinUserInfo } from '../services/api';

// 动画效果
const scanAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px ${theme.colors.primary};
  }
  50% {
    box-shadow: 0 0 40px ${theme.colors.primary}, 0 0 60px ${theme.colors.primary};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.md};
  background: ${theme.colors.bgDeep};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  position: relative;
  overflow: hidden;
`;

const Title = styled.h3`
  color: ${theme.colors.primary};
  font-size: 1.1rem;
  margin-bottom: ${theme.spacing.md};
  text-shadow: ${theme.shadows.glow};
  text-align: center;
`;

const QRContainer = styled.div<{ $isExpired?: boolean }>`
  position: relative;
  width: 220px;
  height: 220px;
  border: 2px solid ${props => props.$isExpired ? theme.colors.error : theme.colors.primary};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.bgDeep};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.lg};
  overflow: hidden;
  animation: ${props => props.$isExpired ? 'none' : glowPulse} 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.secondary};
    animation: ${scanAnimation} 3s linear infinite;
    z-index: 2;
  }
`;

const QRImage = styled.img<{ $isExpired?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${props => props.$isExpired ? 0.3 : 1};
  filter: ${props => props.$isExpired ? 'grayscale(100%)' : 'none'};
  transition: all 0.3s ease;
`;

const ExpiredOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.error};
  font-weight: bold;
  z-index: 3;
`;

const StatusContainer = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StatusText = styled.div<{ $status: 'waiting' | 'success' | 'error' }>`
  font-size: ${theme.typography.body};
  color: ${props => {
    switch (props.$status) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  }};
  margin-bottom: ${theme.spacing.sm};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.bgDeep};
  border: 1px solid ${theme.colors.success};
  border-radius: ${theme.radius.md};
  margin-top: ${theme.spacing.sm};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${theme.colors.success};
`;

const Nickname = styled.span`
  color: ${theme.colors.success};
  font-weight: bold;
  font-size: ${theme.typography.body};
`;

const RefreshButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${props => props.$variant === 'secondary' 
    ? 'transparent' 
    : `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`
  };
  border: ${props => props.$variant === 'secondary' 
    ? `1px solid ${theme.colors.primary}` 
    : 'none'
  };
  border-radius: ${theme.radius.sm};
  color: ${props => props.$variant === 'secondary' 
    ? theme.colors.primary 
    : theme.colors.white
  };
  font-family: ${theme.typography.fontFamily};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    box-shadow: ${theme.shadows.glow};
    transform: translateY(-2px);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const CountdownText = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-top: ${theme.spacing.sm};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export interface DouyinQRScannerProps {
  onScanSuccess: (userInfo: DouyinUserInfo) => void;
  onScanStatusChange: (isScanned: boolean) => void;
}

export const DouyinQRScanner: React.FC<DouyinQRScannerProps> = ({ 
  onScanSuccess, 
  onScanStatusChange 
}) => {
  const [qrCodeBase64, setQrCodeBase64] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<'waiting' | 'success' | 'error'>('waiting');
  const [userInfo, setUserInfo] = useState<DouyinUserInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const expireTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取二维码
  const fetchQRCode = async () => {
    setIsLoading(true);
    setError('');
    setIsExpired(false);
    setCountdown(30);
    
    try {
      const response = await getDouyinQRCode();
      if (response.data.code === 0) {
        // code为0表示成功状态
        if (response.data.data) {
          // 后端返回的数据已经是完整的 data URI 格式，直接使用
          setQrCodeBase64(response.data.data);
          startExpireTimer();
          startPolling();
        } else {
          // 成功但没有数据，可能是二维码还未生成，显示提示信息
          setError('二维码生成中，请稍后...');
        }
      } else {
        // code不为0才是真正的错误
        throw new Error(response.data.message || '获取二维码失败');
      }
    } catch (err: any) {
      setError(err.message || '获取二维码失败');
      setScanStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // 开始30秒倒计时
  const startExpireTimer = () => {
    if (expireTimerRef.current) {
      clearTimeout(expireTimerRef.current);
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    setCountdown(30);
    
    // 倒计时显示
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 30秒后过期
    expireTimerRef.current = setTimeout(() => {
      setIsExpired(true);
      setScanStatus('waiting');
      setCountdown(0);
      stopPolling();
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    }, 30000);
  };

  // 开始轮询扫码状态
  const startPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await getDouyinScanStatus();
        if (response.data.code === 0) {
          // code为0表示成功状态
          if (response.data.data) {
            const userData = response.data.data as DouyinUserInfo;
            if (userData.nickname) {
              // 扫码成功，用户已授权
              setUserInfo(userData);
              setScanStatus('success');
              onScanSuccess(userData);
              onScanStatusChange(true);
              stopPolling();
              if (expireTimerRef.current) {
                clearTimeout(expireTimerRef.current);
              }
              if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
              }
            }
            // 如果有data但没有nickname，说明还在等待用户扫码，继续轮询
          }
          // 如果没有data，说明还在等待用户扫码，继续轮询
        }
        // code不为0的情况也继续轮询，可能是临时状态
      } catch (err: any) {
        console.warn('轮询扫码状态失败:', err);
        // 轮询失败不显示错误，继续轮询
      }
    }, 2000); // 每2秒轮询一次
  };

  // 停止轮询
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // 手动刷新二维码
  const handleRefresh = () => {
    if (scanStatus === 'success') return;
    
    stopPolling();
    if (expireTimerRef.current) {
      clearTimeout(expireTimerRef.current);
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    setScanStatus('waiting');
    setUserInfo(null);
    onScanStatusChange(false);
    fetchQRCode();
  };

  // 重置状态
  const resetScanner = () => {
    stopPolling();
    if (expireTimerRef.current) {
      clearTimeout(expireTimerRef.current);
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    setQrCodeBase64('');
    setIsExpired(false);
    setScanStatus('waiting');
    setUserInfo(null);
    setError('');
    setCountdown(30);
    onScanStatusChange(false);
  };

  // 组件挂载时获取二维码
  useEffect(() => {
    fetchQRCode();
    
    return () => {
      stopPolling();
      if (expireTimerRef.current) {
        clearTimeout(expireTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const renderStatus = () => {
    if (scanStatus === 'success' && userInfo) {
      return (
        <>
          <StatusText $status="success">✅ 扫码成功！</StatusText>
          <UserInfo>
            {userInfo.avatar && <Avatar src={userInfo.avatar} alt="头像" />}
            <Nickname>{userInfo.nickname}</Nickname>
          </UserInfo>
        </>
      );
    }
    
    if (scanStatus === 'error') {
      return <StatusText $status="error">❌ {error}</StatusText>;
    }
    
    if (isExpired) {
      return <StatusText $status="error">⏰ 二维码已过期，请刷新</StatusText>;
    }
    
    return (
      <>
        <StatusText $status="waiting">📱 请使用抖音扫码登录</StatusText>
        {countdown > 0 && !isExpired && (
          <CountdownText>二维码将在 {countdown} 秒后过期</CountdownText>
        )}
        {countdown === 0 && !isExpired && (
          <CountdownText style={{ color: theme.colors.error }}>
            二维码即将过期...
          </CountdownText>
        )}
      </>
    );
  };

  return (
    <Container>
      <Title>抖音账号授权</Title>
      
      <QRContainer $isExpired={isExpired}>
        {isLoading ? (
          <LoadingSpinner />
        ) : qrCodeBase64 ? (
          <>
            <QRImage 
              src={qrCodeBase64} 
              alt="抖音扫码登录"
              $isExpired={isExpired}
            />
            {isExpired && (
              <ExpiredOverlay>
                <div>二维码已过期</div>
                <div style={{ fontSize: '0.8rem', marginTop: theme.spacing.sm }}>
                  请点击刷新按钮获取新的二维码
                </div>
              </ExpiredOverlay>
            )}
          </>
        ) : (
          <div style={{ color: theme.colors.textSecondary }}>
            加载二维码中...
          </div>
        )}
      </QRContainer>
      
      <StatusContainer>
        {renderStatus()}
      </StatusContainer>
      
      {scanStatus !== 'success' && (
        <RefreshButton 
          onClick={handleRefresh}
          disabled={isLoading}
          $variant={isExpired ? 'primary' : 'secondary'}
        >
          {isLoading ? '加载中...' : isExpired ? '刷新二维码' : '手动刷新'}
        </RefreshButton>
      )}
      
      {scanStatus === 'success' && (
        <RefreshButton 
          onClick={resetScanner}
          $variant="secondary"
        >
          重新扫码
        </RefreshButton>
      )}
    </Container>
  );
};
