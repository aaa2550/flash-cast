import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ResourcesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>资源管理</Text>
      <View style={styles.cardGrid}>
        <TouchableOpacity style={styles.resourceCard} activeOpacity={0.85}>
          <Text style={styles.cardTitle}>视频资源</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resourceCard} activeOpacity={0.85}>
          <Text style={styles.cardTitle}>音频资源</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resourceCard} activeOpacity={0.85}>
          <Text style={styles.cardTitle}>风格资源</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  storageInfo: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  storageUsage: {
    fontSize: 12,
    color: '#666666',
  },
  storageBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  storageProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  resourceCard: {
    flex: 1,
    minWidth: 100,
    maxWidth: 180,
    height: 120,
    marginHorizontal: 8,
    backgroundColor: '#f7f8fa',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#eee',
    transition: 'background 0.2s',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 1,
  },
  tabBadgeText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '600',
  },
  activeTabBadgeText: {
    color: '#007AFF',
  },
  fileList: {
    flex: 1,
    marginTop: 16,
  },
  fileListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fileItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fileIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileIconText: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666666',
  },
  fileSeparator: {
    fontSize: 12,
    color: '#666666',
  },
  fileDuration: {
    fontSize: 12,
    color: '#666666',
  },
  fileUploadTime: {
    fontSize: 11,
    color: '#999999',
  },
  fileOptionsButton: {
    padding: 8,
  },
  fileOptionsIcon: {
    fontSize: 16,
    color: '#666666',
    transform: [{ rotate: '90deg' }],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ResourcesScreen;