import { View, Text, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Typography, Spacing, Radius } from '../lib/theme';

export default function TerminationScreen() {
  const theme = useTheme();
  const s = styles(theme);

  function handleDelete() {
    Alert.alert(
      '앱 삭제하기',
      'iOS 설정 > 일반 > iPhone 저장 공간에서 앱을 삭제할 수 있습니다.\n또는 홈 화면에서 앱 아이콘을 길게 눌러 삭제하세요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => Linking.openURL('app-settings:'),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.missionLabel}>MISSION COMPLETE</Text>
        <Text style={s.count}>3,500 / 3,500</Text>

        <View style={s.messageBlock}>
          <Text style={s.message}>
            마지막 단어의 장기 기억 전이가 완료되었습니다.
          </Text>
          <Text style={s.message}>
            이제 이 앱에 저장된 모든 단어는 당신의 뇌로 완전히 이동했습니다.
          </Text>
          <Text style={s.message}>
            더 이상 이 앱을 유지할 이유가 없습니다.
          </Text>
          <Text style={[s.message, s.messageFinal]}>
            지금 앱을 삭제하고, 자유롭게 영어를 사용하세요.
          </Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [s.deleteButton, pressed && { opacity: 0.8 }]}
        onPress={handleDelete}
      >
        <Text style={s.deleteButtonText}>앱 삭제하기</Text>
      </Pressable>
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
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    missionLabel: {
      ...Typography.labelSm,
      color: theme.primary,
      letterSpacing: 4,
      marginBottom: Spacing.sm,
    },
    count: {
      ...Typography.displayWord,
      color: theme.text,
      marginBottom: Spacing.xl,
    },
    messageBlock: {
      gap: Spacing.md,
    },
    message: {
      ...Typography.bodyLg,
      color: theme.textSecondary,
      lineHeight: 30,
    },
    messageFinal: {
      color: theme.text,
      fontWeight: '600',
      marginTop: Spacing.sm,
    },
    deleteButton: {
      borderWidth: 1.5,
      borderColor: theme.error,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    deleteButtonText: {
      ...Typography.bodyLg,
      color: theme.error,
      fontWeight: '600',
    },
  });
