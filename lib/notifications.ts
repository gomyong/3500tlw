import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: '복습 알림',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 120, 200],
      sound: 'default',
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReviewReminder(dueCount: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (dueCount === 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '3500 — The Last Word',
      body: `복습할 단어 ${dueCount}개가 준비됐습니다.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}

export async function scheduleInactivityReminder(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '3500 — The Last Word',
      body: '단어들이 기다리고 있습니다.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24 * 3,
      repeats: false,
    },
  });
}

export async function sendMasteredMilestoneNotification(masteredCount: number): Promise<void> {
  const remaining = 3500 - masteredCount;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '3500 — The Last Word',
      body: `${masteredCount}개 정복. ${remaining}개 남았습니다.`,
    },
    trigger: null,
  });
}

export async function sendMissionCompleteNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '3500 — The Last Word',
      body: '미션 완료. 3,500개 전부 정복했습니다.',
    },
    trigger: null,
  });
}
