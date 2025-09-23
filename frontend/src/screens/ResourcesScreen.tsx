import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  FlatList, 
  TextInput, 
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TechTheme } from '../styles/theme';

// 本地定义 Resource 类型，如果项目中有全局类型文件，应从中导入
export interface Resource {
  id: number;
  type: string;
  userId: number;
  name: string;
  path: string;
  suffix: string;
  size: number;
  createTime: string;
  updateTime: string;
  deleted: number;
}

const C = TechTheme.colors;
const S = TechTheme.spacing;
const R = TechTheme.radius;
const TY = TechTheme.typography;

const { width: screenWidth } = Dimensions.get('window');

// --- 辅助组件和 API 调用逻辑放在这里，保持不变 ---

// --- Stylesheet ---
// 将 StyleSheet.create 移到所有组件定义之前
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgDeepSpace,
    flexDirection: 'row',
  },
  mobileLayout: { flexDirection: 'column' },
  gridBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.08,
  },
  gridLine: { position: 'absolute', backgroundColor: C.accentTechBlue },
  horizontalLine: { width: '100%', height: 1 },
  verticalLine: { height: '100%', width: 1 },

  // Nav Panel
  navPanel: {
    width: 100,
    backgroundColor: C.bgPanel,
    borderRightWidth: 1,
    borderRightColor: C.lineSubtle,
    paddingTop: S.xl,
    alignItems: 'center',
  },
  mobileNavPanel: {
    width: '100%', height: 80, flexDirection: 'row', justifyContent: 'space-around',
    paddingTop: S.sm, borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: C.lineSubtle,
  },
  navItem: {
    width: 80, height: 70, marginBottom: S.sm, alignItems: 'center', justifyContent: 'center',
    borderRadius: R.sm, borderWidth: 1, borderColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(0,212,255,0.1)',
    borderColor: C.accentTechBlue,
  },
  navIcon: { fontSize: 22, color: C.textTertiary },
  navIconActive: { color: C.accentTechBlue },
  navLabel: { fontSize: TY.sizes.xs, color: C.textTertiary, marginTop: 4 },
  navLabelActive: { color: C.accentTechBlue },

  // Editor Panel
  editorPanel: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: S.lg,
  },
  mobileEditorPanel: { borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: C.lineSubtle },
  editorHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.lg,
  },
  editorTitle: {
    fontSize: TY.sizes.xl, fontWeight: TY.weights.bold, color: C.textTitle,
  },
  editorToolbar: { flexDirection: 'row', gap: S.sm },
  editorContent: {
    flex: 1,
    backgroundColor: C.bgDeepSpace,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.lineSubtle,
    padding: S.md,
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
    fontSize: TY.sizes.sm,
    color: C.textPrimary,
    lineHeight: TY.lineHeights.normal,
    textAlignVertical: 'top',
  },
  editorPlaceholderView: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.bgLayer, borderRadius: R.md, borderWidth: 1, borderColor: C.lineSubtle,
  },
  editorPlaceholderText: {
    fontSize: TY.sizes.lg, color: C.textTertiary, fontWeight: TY.weights.medium,
  },
  editorPlaceholderSubText: {
    fontSize: TY.sizes.base, color: C.textTertiary, marginTop: S.sm,
  },

  // Props Panel
  propsPanel: {
    width: 320,
    backgroundColor: C.bgPanel,
    borderLeftWidth: 1,
    borderLeftColor: C.lineSubtle,
    padding: S.md,
  },
  mobilePropsPanel: { width: '100%', height: '40%', borderLeftWidth: 0, borderTopWidth: 1, borderTopColor: C.lineSubtle },
  propsHeader: {
    paddingBottom: S.md,
    borderBottomWidth: 1,
    borderBottomColor: C.lineSubtle,
    marginBottom: S.md,
  },
  propsTitle: {
    fontSize: TY.sizes.lg, fontWeight: TY.weights.semiBold, color: C.textTitle,
  },
  emptyListText: {
    textAlign: 'center', color: C.textTertiary, marginTop: S.xl,
  },
  propsItem: {
    backgroundColor: C.bgLayer, borderRadius: R.sm, padding: S.md, marginBottom: S.sm,
    borderWidth: 1, borderColor: C.cardBorder,
  },
  propsItemActive: {
    borderColor: C.accentTechBlue,
    backgroundColor: 'rgba(0,212,255,0.05)',
  },
  propsItemHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  propsItemTitle: {
    fontSize: TY.sizes.base, fontWeight: TY.weights.medium, color: C.textPrimary, flex: 1,
  },
  propsItemMeta: {
    fontSize: TY.sizes.xs, color: C.textTertiary, marginTop: 2,
  },
  propsItemActions: {
    flexDirection: 'row', gap: S.xs, marginTop: S.sm, justifyContent: 'flex-end',
  },

  // Components
  techButton: {
    borderWidth: 1, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center',
  },
  techButtonText: {
    fontSize: TY.sizes.sm, fontWeight: TY.weights.medium, color: C.textPrimary,
  },
  techButtonTextPrimary: { color: C.bgDeepSpace },
  techButtonTextDanger: { color: C.stateError },
  techButtonTextSmall: { fontSize: TY.sizes.xs },
  disabled: { opacity: 0.5 },

  statusIndicator: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: TY.sizes.xs, color: C.textSecondary },

  toastContainer: {
    position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center', zIndex: 999,
  },
  toast: {
    backgroundColor: C.bgLayer, color: C.textInverse, paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: R.full, fontSize: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.cardBorder,
    ...TY.shadows.md,
  },
});


// --- 辅助组件 ---

const GridBackground = () => (
  <View style={styles.gridBackground} pointerEvents="none">
    {Array.from({ length: 40 }).map((_, i) => (
      <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: i * 40 }]} />
    ))}
    {Array.from({ length: 60 }).map((_, i) => (
      <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * 40 }]} />
    ))}
  </View>
);

const TechButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  style,
  disabled = false 
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  style?: any;
  disabled?: boolean;
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: 'transparent', borderColor: C.lineSubtle };
      case 'danger': return { backgroundColor: 'rgba(255,71,87,0.1)', borderColor: C.stateError };
      default: return { backgroundColor: C.accentTechBlue, borderColor: C.accentTechBlue };
    }
  };
  const getSizeStyles = () => {
    switch (size) {
      case 'small': return { paddingVertical: S.xs, paddingHorizontal: S.sm };
      case 'large': return { paddingVertical: S.lg, paddingHorizontal: S.xl };
      default: return { paddingVertical: S.sm, paddingHorizontal: S.md };
    }
  };
  return (
    <TouchableOpacity
      style={[styles.techButton, getVariantStyles(), getSizeStyles(), disabled && styles.disabled, style]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.techButtonText,
        variant === 'primary' && styles.techButtonTextPrimary,
        variant === 'danger' && styles.techButtonTextDanger,
        size === 'small' && styles.techButtonTextSmall,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const StatusIndicator = ({ status, label }: { status: 'idle' | 'loading' | 'success' | 'error'; label?: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'loading': return C.accentTechBlue;
      case 'success': return C.accentNeonGreen;
      case 'error': return C.stateError;
      default: return C.textTertiary;
    }
  };
  return (
    <View style={styles.statusIndicator}>
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      {label && <Text style={styles.statusLabel}>{label}</Text>}
    </View>
  );
};

// --- API 请求逻辑 ---

interface StyleItem {
  id: number;
  name: string;
  content: string;
  createTime?: string;
  updateTime?: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = '';
  if (Platform.OS === 'web') {
    token = localStorage.getItem('user_token') || '';
  } else {
    token = await AsyncStorage.getItem('user_token') || '';
  }
  
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, { ...options, headers, credentials: 'include' });
  return res.json();
}

const fetchResourceList = (type: 'VIDEO' | 'AUDIO'): Promise<Resource[]> => 
  fetchWithAuth(`/api/resource/list?type=${type}`).then(data => data.data || []);

const fetchStyleList = (): Promise<StyleItem[]> => 
  fetchWithAuth('/api/style/list').then(data => data.data || []);

const updateStyle = (id: number, content: string): Promise<{ ok: boolean; msg?: string }> =>
  fetchWithAuth('/api/style/update', {
    method: 'POST',
    body: JSON.stringify({ id, content }),
  }).then(data => ({ ok: data.code === 0, msg: data.msg }));

const deleteStyle = (id: number): Promise<{ ok: boolean; msg?: string }> =>
  fetchWithAuth(`/api/style/delete?id=${id}`, { method: 'POST' })
  .then(data => ({ ok: data.code === 0, msg: data.msg }));

const deleteResource = (id: number): Promise<{ ok: boolean; msg?: string }> =>
  fetchWithAuth(`/api/resource/delete?id=${id}`, { method: 'POST' })
  .then(data => ({ ok: data.code === 0, msg: data.msg }));


// --- 主屏幕组件 ---

type TabKey = 'video' | 'audio' | 'style';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'video', label: '视频', icon: '▶' },
  { key: 'audio', label: '音频', icon: '♫' },
  { key: 'style', label: '风格', icon: '✎' },
];

function ResourcesScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('video');
  const [resources, setResources] = useState<Resource[]>([]);
  const [styleList, setStyleList] = useState<StyleItem[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<StyleItem | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState<'list' | 'editor' | false>(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  
  const isMobile = screenWidth < 768;

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  const loadData = useCallback(async () => {
    setLoading('list');
    try {
      if (activeTab === 'video' || activeTab === 'audio') {
        const resourceList = await fetchResourceList(activeTab.toUpperCase() as 'VIDEO' | 'AUDIO');
        setResources(resourceList);
        setStyleList([]);
        setSelectedStyle(null);
      } else if (activeTab === 'style') {
        const fetchedStyleList = await fetchStyleList();
        setStyleList(fetchedStyleList);
        setResources([]);
        if (fetchedStyleList.length > 0) {
            // 如果有选中的，保持选中，否则选第一个
            const currentSelection = fetchedStyleList.find(s => s.id === selectedStyle?.id)
            setSelectedStyle(currentSelection || fetchedStyleList[0]);
        } else {
          setSelectedStyle(null);
        }
      }
    } catch (error) {
      showToast('数据加载失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedStyle?.id]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (selectedStyle) {
      setEditingContent(selectedStyle.content || '');
    } else {
      setEditingContent('');
    }
  }, [selectedStyle]);

  const handleSaveStyle = async () => {
    if (!selectedStyle) return;
    setLoading('editor');
    const res = await updateStyle(selectedStyle.id, editingContent);
    if (res.ok) {
      showToast('风格保存成功');
      await loadData();
    } else {
      showToast(`保存失败: ${res.msg || '未知错误'}`);
    }
    setLoading(false);
  };

  const handleDeleteItem = async (id: number, type: 'resource' | 'style') => {
    const action = async () => {
        setLoading('list');
        const res = type === 'resource' ? await deleteResource(id) : await deleteStyle(id);
        if (res.ok) {
            showToast('删除成功');
            if(type === 'style' && selectedStyle?.id === id) {
                setSelectedStyle(null);
            }
            await loadData();
        } else {
            showToast(`删除失败: ${res.msg || '未知错误'}`);
        }
        setLoading(false);
    };

    if (Platform.OS === 'web') {
        if (window.confirm('确定要删除吗？')) {
            action();
        }
    } else {
        Alert.alert('确认删除', '确定要删除这个项目吗？', [
            { text: '取消', style: 'cancel' },
            { text: '删除', style: 'destructive', onPress: action },
        ]);
    }
  };

  const renderNavItem = (tab: typeof TABS[0]) => (
    <TouchableOpacity
      key={tab.key}
      style={[styles.navItem, activeTab === tab.key && styles.navItemActive]}
      onPress={() => {
        setActiveTab(tab.key);
        setSelectedStyle(null);
      }}
    >
      <Text style={[styles.navIcon, activeTab === tab.key && styles.navIconActive]}>{tab.icon}</Text>
      <Text style={[styles.navLabel, activeTab === tab.key && styles.navLabelActive]}>{tab.label}</Text>
    </TouchableOpacity>
  );

  const renderResourceItem = ({ item }: { item: Resource }) => (
    <View style={styles.propsItem}>
      <View style={styles.propsItemHeader}>
        <Text style={styles.propsItemTitle} numberOfLines={1}>{item.name}</Text>
        <StatusIndicator status="idle" />
      </View>
      <Text style={styles.propsItemMeta}>{(item.size / 1024 / 1024).toFixed(2)} MB</Text>
      <View style={styles.propsItemActions}>
        <TechButton title="删除" variant="danger" size="small" onPress={() => handleDeleteItem(item.id, 'resource')} />
      </View>
    </View>
  );

  const renderStyleItem = ({ item }: { item: StyleItem }) => (
    <TouchableOpacity onPress={() => setSelectedStyle(item)}>
      <View style={[styles.propsItem, selectedStyle?.id === item.id && styles.propsItemActive]}>
        <View style={styles.propsItemHeader}>
          <Text style={styles.propsItemTitle}>{item.name}</Text>
          <StatusIndicator status={selectedStyle?.id === item.id ? 'success' : 'idle'} />
        </View>
        <Text style={styles.propsItemMeta}>
          Updated: {item.updateTime ? new Date(item.updateTime).toLocaleDateString() : 'N/A'}
        </Text>
         <View style={styles.propsItemActions}>
            <TechButton title="删除" variant="danger" size="small" onPress={() => handleDeleteItem(item.id, 'style')} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isMobile && styles.mobileLayout]}>
      <GridBackground />
      
      {toast.visible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toast}>{toast.message}</Text>
        </View>
      )}

      {/* Left Navigation Panel */}
      <View style={[styles.navPanel, isMobile && styles.mobileNavPanel]}>
        {TABS.map(renderNavItem)}
      </View>

      {/* Middle/Main Panel */}
      <View style={[styles.editorPanel, isMobile && styles.mobileEditorPanel]}>
        <View style={styles.editorHeader}>
          <Text style={styles.editorTitle}>
            {activeTab === 'style' ? (selectedStyle?.name || '选择风格') : '资源预览'}
          </Text>
          {activeTab === 'style' && selectedStyle && (
            <View style={styles.editorToolbar}>
              <TechButton 
                title={loading === 'editor' ? '保存中...' : '保存风格'} 
                onPress={handleSaveStyle} 
                disabled={loading === 'editor'}
              />
            </View>
          )}
        </View>
        {activeTab === 'style' ? (
          selectedStyle ? (
            <TextInput
              style={styles.editorContent}
              multiline
              value={editingContent}
              onChangeText={setEditingContent}
              placeholder="输入风格描述..."
              placeholderTextColor={C.textTertiary}
            />
          ) : (
            <View style={styles.editorPlaceholderView}>
              <Text style={styles.editorPlaceholderText}>请从右侧面板选择一个风格</Text>
            </View>
          )
        ) : (
          <View style={styles.editorPlaceholderView}>
            <Text style={styles.editorPlaceholderText}>资源预览区</Text>
            <Text style={styles.editorPlaceholderSubText}>未来将支持视频/音频播放</Text>
          </View>
        )}
      </View>

      {/* Right Properties Panel */}
      {!isMobile || (isMobile && activeTab !== 'style') ? (
        <View style={[styles.propsPanel, isMobile && styles.mobilePropsPanel]}>
          <View style={styles.propsHeader}>
            <Text style={styles.propsTitle}>{TABS.find(t => t.key === activeTab)?.label}列表</Text>
            {/* TODO: Add resource/style button */}
          </View>
          {loading === 'list' ? (
            <ActivityIndicator color={C.accentTechBlue} style={{ marginTop: S.xl }}/>
          ) : activeTab === 'style' ? (
            <FlatList
              data={styleList}
              renderItem={renderStyleItem}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={<Text style={styles.emptyListText}>没有找到任何内容</Text>}
            />
          ) : (
            <FlatList
              data={resources}
              renderItem={renderResourceItem}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={<Text style={styles.emptyListText}>没有找到任何内容</Text>}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

export default ResourcesScreen;