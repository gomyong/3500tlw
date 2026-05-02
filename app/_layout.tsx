import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initSchema } from '../lib/db';
import { seedDatabase } from '../lib/seed';
import { requestNotificationPermission } from '../lib/notifications';
import { useTheme } from '../lib/theme';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      await initSchema();
      await seedDatabase();
      await requestNotificationPermission();
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session/setup" options={{ presentation: 'modal' }} />
        <Stack.Screen name="session/stage1" />
        <Stack.Screen name="session/stage2" />
        <Stack.Screen name="session/stage3" />
        <Stack.Screen name="session/stage4" />
        <Stack.Screen name="session/stage5" />
        <Stack.Screen name="review" />
        <Stack.Screen name="termination" options={{ gestureEnabled: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
