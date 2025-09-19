import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import Icon from '../components/Icon';
import { Colors, Typography, Spacing, CommonStyles, BorderRadius, Shadows, utils } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  nickname: string;
  avatar?: string;
  phone: string;
  isVip: boolean;
  vipExpireDate?: string;
  computeCredits: number;
  totalCredits: number;
}

interface BillingRecord {
  id: string;
  type: 'recharge' | 'consumption';
  amount: number;
  description: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  description: string;
  isPopular?: boolean;
}

const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: '用户12345',
    phone: '138****8000',
    isVip: true,
    vipExpireDate: '2024-12-31',
    computeCredits: 1250,
    totalCredits: 2000,
  });

  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([
    {
      id: '1',
      type: 'recharge',
      amount: 99,
      description: '购买专业套餐',
      date: '2024-01-15',
      status: 'success',
    },
    {
      id: '2',
      type: 'consumption',
      amount: 30,
      description: '视频生成任务',
      date: '2024-01-14',
      status: 'success',
    },
    {
      id: '3',
      type: 'consumption',
      amount: 15,
      description: 'AI数字人视频',
      date: '2024-01-13',
      status: 'success',
    },
  ]);

  const [pricingPlans] = useState<PricingPlan[]>([
    {
      id: '1',
      name: '基础套餐',
      credits: 500,
      price: 29,
      originalPrice: 39,
      description: '适合轻度使用用户',
    },
    {
      id: '2',
      name: '专业套餐',
      credits: 1200,
      price: 59,
      originalPrice: 89,
      description: '最受欢迎的选择',
      isPopular: true,
    },
    {
      id: '3',
      name: '企业套餐',
      credits: 3000,
      price: 129,
      originalPrice: 199,
      description: '企业级用户首选',
    },
  ]);

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(false);

  const handleRecharge = (plan: PricingPlan) => {
    Alert.alert(
      '确认购买',
      `购买${plan.name} - ${plan.credits}算力积分\n价格: ¥${plan.price}`,
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => {
          console.log('购买套餐:', plan.name);
          setShowPricingModal(false);
          // 这里可以集成支付功能
        }},
      ]
    );
  };

  const handleLogout = () => {
    console.log('退出登录按钮被点击了！'); // 添加调试日志
    Alert.alert(
      '退出登录',
      '确定要退出当前账号吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          style: 'destructive', 
          onPress: async () => {
            try {
              console.log('开始执行退出登录...'); // 添加调试日志
              await logout();
              console.log('退出登录成功！'); // 添加调试日志
              // 退出登录成功后，用户会被自动导航到登录页面
            } catch (error) {
              console.error('退出登录失败:', error); // 添加调试日志
              Alert.alert('退出失败', '网络错误，请重试');
            }
          }
        },
      ]
    );
  };

  const creditUsagePercentage = (userProfile.computeCredits / userProfile.totalCredits) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 用户信息卡片 */}
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={32} color={Colors.textSecondary} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{userProfile.nickname}</Text>
            <Text style={styles.phone}>{userProfile.phone}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* VIP状态 */}
        <View style={styles.vipContainer}>
          {userProfile.isVip ? (
            <View style={styles.vipBadge}>
              <Icon name="star" size={16} color={Colors.vip} />
              <Text style={styles.vipText}>VIP会员</Text>
              <Text style={styles.vipExpire}>
                到期: {userProfile.vipExpireDate}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.upgradeButton}>
              <Icon name="arrow-upward" size={16} color={Colors.primary} />
              <Text style={styles.upgradeText}>升级VIP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 算力积分卡片 */}
      <View style={styles.creditsCard}>
        <View style={styles.creditsHeader}>
          <Text style={styles.creditsTitle}>算力积分</Text>
          <TouchableOpacity 
            style={styles.rechargeButton}
            onPress={() => setShowPricingModal(true)}
          >
            <Icon name="add" size={16} color={Colors.primary} />
            <Text style={styles.rechargeText}>充值</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.creditsInfo}>
          <Text style={styles.creditsAmount}>
            {userProfile.computeCredits.toLocaleString()}
          </Text>
          <Text style={styles.creditsUnit}>剩余积分</Text>
        </View>
        
        <View style={styles.creditsProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${creditUsagePercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {userProfile.computeCredits} / {userProfile.totalCredits}
          </Text>
        </View>
      </View>

      {/* 充值记录 */}
      <View style={styles.billingCard}>
        <View style={styles.billingHeader}>
          <Text style={styles.billingTitle}>充值记录</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.billingList}>
          {billingRecords.slice(0, 3).map((record) => (
            <View key={record.id} style={styles.billingItem}>
              <View style={styles.billingIcon}>
                <Icon
                  name={record.type === 'recharge' ? 'add-circle' : 'remove-circle'}
                  size={20}
                  color={record.type === 'recharge' ? Colors.success : Colors.warning}
                />
              </View>
              <View style={styles.billingInfo}>
                <Text style={styles.billingDescription}>
                  {record.description}
                </Text>
                <Text style={styles.billingDate}>{record.date}</Text>
              </View>
              <Text style={[
                styles.billingAmount,
                { color: record.type === 'recharge' ? Colors.success : Colors.warning }
              ]}>
                {record.type === 'recharge' ? '+' : '-'}¥{record.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 设置选项 */}
      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>设置</Text>
        
        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="notifications" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>推送通知</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
              thumbColor={notifications ? Colors.primary : Colors.textTertiary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="autorenew" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>自动续费</Text>
            </View>
            <Switch
              value={autoRenewal}
              onValueChange={setAutoRenewal}
              trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
              thumbColor={autoRenewal ? Colors.primary : Colors.textTertiary}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="help" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>帮助与支持</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="info" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingText}>关于我们</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutItem} 
            onPress={handleLogout}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            disabled={false}
          >
            <View style={styles.settingLeft}>
              <Icon name="logout" size={20} color={Colors.error} />
              <Text 
                style={[styles.settingText, { color: Colors.error }]}
                onPress={handleLogout}
              >
                退出登录
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 充值套餐模态框 */}
      <Modal
        visible={showPricingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPricingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择充值套餐</Text>
              <TouchableOpacity
                onPress={() => setShowPricingModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.plansList} showsVerticalScrollIndicator={false}>
              {pricingPlans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.planCard, plan.isPopular && styles.popularPlan]}
                  onPress={() => handleRecharge(plan)}
                >
                  {plan.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>推荐</Text>
                    </View>
                  )}
                  
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planCredits}>{plan.credits}算力积分</Text>
                  
                  <View style={styles.planPricing}>
                    <Text style={styles.planPrice}>¥{plan.price}</Text>
                    {plan.originalPrice && (
                      <Text style={styles.originalPrice}>¥{plan.originalPrice}</Text>
                    )}
                  </View>
                  
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  
  userCard: {
    ...CommonStyles.card,
    marginBottom: Spacing.lg,
  },
  
  userInfo: {
    ...CommonStyles.rowBetween,
    marginBottom: Spacing.lg,
  },
  
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    ...CommonStyles.center,
  },
  
  userDetails: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  
  username: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  phone: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  
  editButton: {
    padding: Spacing.sm,
  },
  
  vipContainer: {
    alignItems: 'center',
  },
  
  vipBadge: {
    ...CommonStyles.rowCenter,
    backgroundColor: Colors.vip + '20',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  
  vipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600' as const,
    color: Colors.vip,
  },
  
  vipExpire: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  
  upgradeButton: {
    ...CommonStyles.rowCenter,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  
  upgradeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  
  creditsCard: {
    ...CommonStyles.card,
    marginBottom: Spacing.lg,
  },
  
  creditsHeader: {
    ...CommonStyles.rowBetween,
    marginBottom: Spacing.lg,
  },
  
  creditsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  
  rechargeButton: {
    ...CommonStyles.rowCenter,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  
  rechargeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  
  creditsInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  
  creditsAmount: {
    fontSize: Typography.sizes.hero,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  
  creditsUnit: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  
  creditsProgress: {
    alignItems: 'center',
  },
  
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  
  progressText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  
  billingCard: {
    ...CommonStyles.card,
    marginBottom: Spacing.lg,
  },
  
  billingHeader: {
    ...CommonStyles.rowBetween,
    marginBottom: Spacing.lg,
  },
  
  billingTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  
  viewAllText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  
  billingList: {
    gap: Spacing.md,
  },
  
  billingItem: {
    ...CommonStyles.row,
    paddingVertical: Spacing.sm,
  },
  
  billingIcon: {
    marginRight: Spacing.md,
  },
  
  billingInfo: {
    flex: 1,
  },
  
  billingDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  billingDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  
  billingAmount: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
  },
  
  settingsCard: {
    ...CommonStyles.card,
    marginBottom: Spacing.xl,
  },
  
  settingsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  
  settingsList: {
    gap: Spacing.md,
  },
  
  settingItem: {
    ...CommonStyles.rowBetween,
    paddingVertical: Spacing.sm,
    minHeight: 44, // 确保有足够的点击区域
  },
  
  logoutItem: {
    ...CommonStyles.rowBetween,
    paddingVertical: Spacing.md,
    minHeight: 50, // 更大的点击区域
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.sm,
  },
  
  settingLeft: {
    ...CommonStyles.row,
    gap: Spacing.md,
  },
  
  settingText: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
    maxHeight: '80%',
  },
  
  modalHeader: {
    ...CommonStyles.rowBetween,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  
  closeButton: {
    padding: Spacing.xs,
  },
  
  plansList: {
    marginVertical: Spacing.lg,
  },
  
  planCard: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  
  popularPlan: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: Spacing.lg,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  
  popularText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  
  planName: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  planCredits: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  
  planPricing: {
    ...CommonStyles.row,
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  
  planPrice: {
    fontSize: Typography.sizes.xxl,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  
  originalPrice: {
    fontSize: Typography.sizes.base,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  
  planDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});

export default ProfileScreen;