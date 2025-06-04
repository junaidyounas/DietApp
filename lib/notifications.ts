import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Meal, Settings } from '../types';
import { Storage } from './storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationManager {
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  }

  static async scheduleMealReminder(meal: Meal, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Meal Reminder',
        body: `Time for your ${meal.name}! Don't forget to log your meal.`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { mealId: meal.id },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    return identifier;
  }

  static async cancelMealReminder(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  static async updateMealReminders(settings: Settings) {
    // Cancel all existing reminders
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new reminders
    const reminderIdentifiers: string[] = [];
    for (const time of settings.mealReminderTimes) {
      const identifier = await this.scheduleMealReminder({
        id: 'default',
        name: 'Meal',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        timestamp: new Date().toISOString(),
        isFavorite: false,
        category: 'breakfast',
      }, time);
      reminderIdentifiers.push(identifier);
    }

    return reminderIdentifiers;
  }

  static async initializeReminders() {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return false;
    }

    const settings = await Storage.getSettings();
    if (settings?.mealReminderTimes?.length) {
      await this.updateMealReminders(settings);
    }

    return true;
  }

  static async cancelAllScheduledNotificationsAsync() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getNotificationPermissionStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }
} 