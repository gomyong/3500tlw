import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initSchema } from '../lib/db';
import { seedDatabase } from '../lib/seed';
import { requestNotificationPermission } from '../lib/notifications';
import { Colors } from '../lib/theme';

const theme = Colors.light;

export default function RootLayout() {
  const [ready, setReady] = useState(false);

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
        <StatusBar style="dark" backgroundColor={theme.background} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={theme.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session/setup" options={{ presentation: 'modal' }} />
        <Stack.Screen name="session/stage0" />
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
