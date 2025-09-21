import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { templateService, TemplateItem } from '../services/template';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/theme';

export const VideoTemplateListScreen: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    templateService.getVideoTemplates().then(list => {
      setTemplates(list);
      setLoading(false);
    });
  }, []);

  const renderItem = ({ item }: { item: TemplateItem }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.coverUrl }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, marginTop: 100 }} size="large" color={Colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: Spacing.lg }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.lg }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
    padding: Spacing.md,
    alignItems: 'center',
  },
  cover: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
    backgroundColor: Colors.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  desc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});
