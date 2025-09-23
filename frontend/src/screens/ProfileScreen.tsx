import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { TechTheme } from '../styles/theme';

const C = TechTheme.colors;
const S = TechTheme.spacing;
const R = TechTheme.radius;
const TY = TechTheme.typography;

// Mock Icon component - replace with your actual Icon component if available
const Icon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const getIconContent = (iconName: string) => {
    switch (iconName) {
      case 'person': return '👤';
      case 'edit': return '✏️';
      case 'star': return '⭐';
      case 'arrow-upward': return '⬆️';
      case 'add': return '+';
      case 'add-circle': return '⊕';
      case 'remove-circle': return '⊖';
      case 'notifications': return '🔔';
      case 'autorenew': return '🔄';
      case 'help': return '❓';
      case 'info': return 'ℹ️';
      case 'logout': return '🚪';
      case 'chevron-right': return '>';
      case 'close': return '✕';
      default: return '●';
    }
  };
  return <Text style={{ fontSize: size * 0.8, color }}>{getIconContent(name)}</Text>;
};


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
    nickname: '科技先锋',
    phone: '138****8000',
    isVip: true,
    vipExpireDate: '2024-12-31',
    computeCredits: 1250,
    totalCredits: 2000,
  });

  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([
    { id: '1', type: 'recharge', amount: 59, description: '专业套餐充值', date: '2024-01-15', status: 'success' },
    { id: '2', type: 'consumption', amount: 30, description: '视频生成任务', date: '2024-01-14', status: 'success' },
    { id: '3', type: 'consumption', amount: 15, description: 'AI数字人视频', date: '2024-01-13', status: 'success' },
  ]);

  const [pricingPlans] = useState<PricingPlan[]>([
    { id: '1', name: '基础包', credits: 500, price: 29, description: '适合轻度使用者' },
    { id: '2', name: '专业包', credits: 1200, price: 59, description: '最受欢迎', isPopular: true },
    { id: '3', name: '企业包', credits: 3000, price: 129, description: '专为团队设计' },
  ]);

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(false);

  const handleRecharge = (plan: PricingPlan) => {
    Alert.alert('确认购买', `购买 ${plan.name}，价格: ¥${plan.price}`, [
      { text: '取消', style: 'cancel' },
      { text: '确认', onPress: () => {
        console.log('购买套餐:', plan.name);
        setShowPricingModal(false);
      }},
    ]);
  };

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await authService.logout().catch(() => {});
        await logout();
      } catch (error) {
        Alert.alert('退出失败', '请稍后重试');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('确定要退出当前账号吗？')) {
        performLogout();
      }
    } else {
      Alert.alert('退出登录', '确定要退出当前账号吗？', [
        { text: '取消', style: 'cancel' },
        { text: '确认', style: 'destructive', onPress: performLogout },
      ]);
    }
  };

  const creditUsagePercentage = (userProfile.computeCredits / userProfile.totalCredits) * 100;

  const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <View style={[styles.card, style]}>{children}</View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={32} color={C.accentTechBlue} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{userProfile.nickname}</Text>
            <Text style={styles.phone}>{userProfile.phone}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="edit" size={20} color={C.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.vipContainer}>
          {userProfile.isVip ? (
            <View style={styles.vipBadge}>
              <Icon name="star" size={16} color={C.stateWarning} />
              <Text style={styles.vipText}>VIP会员</Text>
              <Text style={styles.vipExpire}>到期: {userProfile.vipExpireDate}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.upgradeButton}>
              <Icon name="arrow-upward" size={16} color={C.accentTechBlue} />
              <Text style={styles.upgradeText}>升级VIP</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>算力积分</Text>
          <TouchableOpacity style={styles.rechargeButton} onPress={() => setShowPricingModal(true)}>
            <Icon name="add" size={16} color={C.accentTechBlue} />
            <Text style={styles.rechargeText}>充值</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.creditsInfo}>
          <Text style={styles.creditsAmount}>{userProfile.computeCredits.toLocaleString()}</Text>
          <Text style={styles.creditsUnit}>剩余积分</Text>
        </View>
        
        <View style={styles.creditsProgress}>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${creditUsagePercentage}%` }]} /></View>
          <Text style={styles.progressText}>{userProfile.computeCredits} / {userProfile.totalCredits}</Text>
        </View>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>账单记录</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>查看全部</Text></TouchableOpacity>
        </View>
        
        <View style={styles.billingList}>
          {billingRecords.slice(0, 3).map((record) => (
            <View key={record.id} style={styles.billingItem}>
              <Icon name={record.type === 'recharge' ? 'add-circle' : 'remove-circle'} size={22} color={record.type === 'recharge' ? C.accentNeonGreen : C.stateWarning} />
              <View style={styles.billingInfo}>
                <Text style={styles.billingDescription}>{record.description}</Text>
                <Text style={styles.billingDate}>{record.date}</Text>
              </View>
              <Text style={[styles.billingAmount, { color: record.type === 'recharge' ? C.accentNeonGreen : C.textPrimary }]}>
                {record.type === 'recharge' ? '+' : '-'}{record.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>设置</Text>
        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><Icon name="notifications" size={20} color={C.textSecondary} /><Text style={styles.settingText}>推送通知</Text></View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: C.bgLayer, true: C.accentTechBlue }} thumbColor={C.bgDeepSpace} />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><Icon name="autorenew" size={20} color={C.textSecondary} /><Text style={styles.settingText}>自动续费</Text></View>
            <Switch value={autoRenewal} onValueChange={setAutoRenewal} trackColor={{ false: C.bgLayer, true: C.accentTechBlue }} thumbColor={C.bgDeepSpace} />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}><Icon name="help" size={20} color={C.textSecondary} /><Text style={styles.settingText}>帮助与支持</Text></View>
            <Icon name="chevron-right" size={20} color={C.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}><Icon name="info" size={20} color={C.textSecondary} /><Text style={styles.settingText}>关于我们</Text></View>
            <Icon name="chevron-right" size={20} color={C.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}><Icon name="logout" size={20} color={C.stateError} /><Text style={[styles.settingText, { color: C.stateError }]}>退出登录</Text></View>
            <Icon name="chevron-right" size={20} color={C.textTertiary} />
          </TouchableOpacity>
        </View>
      </Card>

      <Modal visible={showPricingModal} transparent={true} animationType="fade" onRequestClose={() => setShowPricingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择充值套餐</Text>
              <TouchableOpacity onPress={() => setShowPricingModal(false)} style={styles.iconButton}><Icon name="close" size={24} color={C.textSecondary} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {pricingPlans.map((plan) => (
                <TouchableOpacity key={plan.id} style={[styles.planCard, plan.isPopular && styles.popularPlan]} onPress={() => handleRecharge(plan)}>
                  {plan.isPopular && <View style={styles.popularBadge}><Text style={styles.popularText}>推荐</Text></View>}
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planCredits}>{plan.credits} 算力积分</Text>
                  <View style={styles.planPricing}>
                    <Text style={styles.planPrice}>¥{plan.price}</Text>
                    {plan.originalPrice && <Text style={styles.originalPrice}>¥{plan.originalPrice}</Text>}
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
  container: { flex: 1, backgroundColor: C.bgDeepSpace, padding: S.md },
  card: { backgroundColor: C.bgPanel, borderRadius: R.md, padding: S.lg, marginBottom: S.md, borderWidth: 1, borderColor: C.lineSubtle },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.lg },
  cardTitle: { fontSize: TY.sizes.lg, fontWeight: TY.weights.semiBold, color: C.textTitle },
  
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: S.lg },
  avatar: { width: 60, height: 60, borderRadius: R.full, backgroundColor: C.bgLayer, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.lineSubtle },
  userDetails: { flex: 1, marginLeft: S.md },
  username: { fontSize: TY.sizes.xl, fontWeight: TY.weights.bold, color: C.textTitle, marginBottom: S.xs },
  phone: { fontSize: TY.sizes.base, color: C.textSecondary },
  iconButton: { padding: S.xs },
  
  vipContainer: { alignItems: 'center', marginTop: S.sm },
  vipBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.stateWarning + '20', paddingHorizontal: S.md, paddingVertical: S.sm, borderRadius: R.full, gap: S.sm },
  vipText: { fontSize: TY.sizes.sm, fontWeight: TY.weights.bold, color: C.stateWarning },
  vipExpire: { fontSize: TY.sizes.xs, color: C.textSecondary, marginLeft: S.sm },
  upgradeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.accentTechBlue + '20', paddingHorizontal: S.md, paddingVertical: S.sm, borderRadius: R.full, gap: S.sm },
  upgradeText: { fontSize: TY.sizes.sm, fontWeight: TY.weights.bold, color: C.accentTechBlue },

  rechargeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.accentTechBlue + '20', paddingHorizontal: S.md, paddingVertical: S.sm, borderRadius: R.md, gap: S.xs },
  rechargeText: { fontSize: TY.sizes.sm, fontWeight: TY.weights.medium, color: C.accentTechBlue },
  
  creditsInfo: { alignItems: 'center', marginVertical: S.md },
  creditsAmount: { fontSize: TY.sizes.xxxl, fontWeight: TY.weights.bold, color: C.accentNeonGreen, fontFamily: 'monospace' },
  creditsUnit: { fontSize: TY.sizes.base, color: C.textSecondary, marginTop: S.xs },
  
  creditsProgress: { alignItems: 'center' },
  progressBar: { width: '100%', height: 8, backgroundColor: C.bgLayer, borderRadius: R.sm, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.accentNeonGreen, borderRadius: R.sm },
  progressText: { fontSize: TY.sizes.xs, color: C.textTertiary, marginTop: S.sm, fontFamily: 'monospace' },

  viewAllText: { fontSize: TY.sizes.sm, color: C.accentTechBlue, fontWeight: TY.weights.medium },
  billingList: { gap: S.md },
  billingItem: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  billingInfo: { flex: 1 },
  billingDescription: { fontSize: TY.sizes.base, color: C.textPrimary, marginBottom: 2 },
  billingDate: { fontSize: TY.sizes.xs, color: C.textTertiary },
  billingAmount: { fontSize: TY.sizes.base, fontWeight: TY.weights.medium, fontFamily: 'monospace' },

  settingsList: { marginTop: S.sm },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: S.md, borderBottomWidth: 1, borderBottomColor: C.lineSubtle },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  settingText: { fontSize: TY.sizes.base, color: C.textPrimary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: S.lg },
  modalContent: { width: '100%', backgroundColor: C.bgPanel, borderRadius: R.lg, padding: S.lg, borderWidth: 1, borderColor: C.lineSubtle, ...TY.shadows.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: S.md, borderBottomWidth: 1, borderBottomColor: C.lineSubtle, marginBottom: S.lg },
  modalTitle: { fontSize: TY.sizes.lg, fontWeight: TY.weights.bold, color: C.textTitle },
  
  planCard: { backgroundColor: C.bgLayer, borderRadius: R.md, padding: S.lg, marginBottom: S.md, borderWidth: 2, borderColor: C.lineSubtle, position: 'relative' },
  popularPlan: { borderColor: C.accentTechBlue, backgroundColor: C.accentTechBlue + '10' },
  popularBadge: { position: 'absolute', top: -1, right: S.lg, backgroundColor: C.accentTechBlue, paddingHorizontal: S.sm, paddingVertical: 2, borderBottomLeftRadius: R.sm, borderBottomRightRadius: R.sm },
  popularText: { fontSize: TY.sizes.xs, fontWeight: TY.weights.bold, color: C.bgDeepSpace },
  planName: { fontSize: TY.sizes.lg, fontWeight: TY.weights.bold, color: C.textTitle, marginBottom: S.xs },
  planCredits: { fontSize: TY.sizes.base, color: C.textSecondary, marginBottom: S.sm },
  planPricing: { flexDirection: 'row', alignItems: 'baseline', gap: S.sm, marginBottom: S.sm },
  planPrice: { fontSize: TY.sizes.xxl, fontWeight: TY.weights.bold, color: C.accentNeonGreen },
  originalPrice: { fontSize: TY.sizes.base, color: C.textTertiary, textDecorationLine: 'line-through' },
  planDescription: { fontSize: TY.sizes.sm, color: C.textSecondary },
});

export default ProfileScreen;