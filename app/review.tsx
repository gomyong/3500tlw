import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getDueWords } from '../lib/db';
import { useSessionStore, SessionWord } from '../store/session';
import { useTheme } from '../lib/theme';

export default function ReviewScreen() {
  const theme = useTheme();
  const initSession = useSessionStore((s) => s.initSession);

  useEffect(() => {
    (async () => {
      const dueWords = await getDueWords();
      if (dueWords.length === 0) {
        router.replace('/(tabs)');
        return;
      }
      const sessionWords: SessionWord[] = dueWords.map((w) => ({
        id: w.id,
        word: w.word,
        meaning: w.meaning,
        example: w.example ?? '',
        currentLevel: (w as any).current_level ?? 0,
        failCount: (w as any).fail_count ?? 0,
        wasCorrectInSession: null,
        failedInStage1: false,
        failedInStage3: false,
      }));
      initSession(sessionWords, true);
      router.replace('/session/stage1');
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}
