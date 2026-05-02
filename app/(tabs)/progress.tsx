import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getProgressSummary } from '../../lib/db';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

type Summary = {
  total: number;
  mastered: number;
  in_progress: number;
  unstarted: number;
  due_today: number;
};

export default function ProgressScreen() {
  const theme = useTheme();
  const [summary, setSummary] = useState<Summary>({
    total: 3500, mastered: 0, in_progress: 0, unstarted: 3500, due_today: 0,
  });

  useFocusEffect(
    useCallback(() => { getProgressSummary().then(setSummary); }, [])
  );

  const masteredPct = summary.mastered / summary.total;
  const inProgressPct = summary.in_progress / summary.total;
  const s = styles(theme);

  const rows = [
    { label: '정복 완료', value: summary.mastered, color: theme.primary },
    { label: '학습 중', value: summary.in_progress, color: '#5d9e8f' },
    { label: '미학습', value: summary.unstarted, color: theme.progressTrack },
    { label: '오늘 복습 대기', value: summary.due_today, color: theme.error },
  ];

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.heading}>진행 현황</Text>

      {/* Count + bar */}
      <View style={s.countSection}>
        <Text style={s.masteredNum}>{summary.mastered.toLocaleString()}</Text>
        <Text style={s.masteredDen}> / 3,500</Text>
      </View>
      <View style={s.barContainer}>
        <View style={[s.barSegment, { flex: masteredPct || 0.001, backgroundColor: theme.primary }]} />
        <View style={[s.barSegment, { flex: inProgressPct || 0.001, backgroundColor: '#5d9e8f' }]} />
        <View style={[s.barSegment, { flex: Math.max(0, 1 - masteredPct - inProgressPct), backgroundColor: theme.progressTrack }]} />
      </View>

      {/* Stats list */}
      <View style={s.list}>
        {rows.map((row, i) => (
          <View key={row.label} style={[s.row, i === rows.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={[s.dot, { backgroundColor: row.color }]} />
            <Text style={s.rowLabel}>{row.label}</Text>
            <Text style={s.rowValue}>{row.value.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: Spacing.margin,
    },
    heading: {
      ...Typography.headlineLg,
      color: theme.text,
      marginTop: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    countSection: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: Spacing.sm,
    },
    masteredNum: {
      fontSize: 48,
      fontWeight: '700',
      color: theme.primary,
      letterSpacing: -1,
      lineHeight: 56,
    },
    masteredDen: {
      ...Typography.headlineMd,
      color: theme.textSecondary,
      marginBottom: 6,
    },
    barContainer: {
      flexDirection: 'row',
      height: 8,
      borderRadius: Radius.full,
      overflow: 'hidden',
      backgroundColor: theme.progressTrack,
      marginBottom: Spacing.xl,
    },
    barSegment: { height: '100%' },
    list: {
      backgroundColor: theme.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: Radius.full,
      marginRight: Spacing.sm,
    },
    rowLabel: { ...Typography.bodyMd, color: theme.text, flex: 1 },
    rowValue: { ...Typography.bodyMd, color: theme.primary, fontWeight: '600' },
  });
