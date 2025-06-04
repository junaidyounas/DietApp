import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationManager } from '../lib/notifications';
import { Storage } from '../lib/storage';
import { Settings } from '../types';

const COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FF9800',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
};

const DEFAULT_MEAL_TIMES = ['08:00', '12:00', '18:00'];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newReminderTime, setNewReminderTime] = useState('');
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  useEffect(() => {
    loadSettings();
    checkNotificationPermission();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await Storage.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    }
  };

  const checkNotificationPermission = async () => {
    const status = await NotificationManager.getNotificationPermissionStatus();
    setHasNotificationPermission(status === 'granted');
  };

  const handleRequestNotificationPermission = async () => {
    const success = await NotificationManager.requestPermissions();
    if (success) {
      setHasNotificationPermission(true);
      Alert.alert('Success', 'Notification permissions granted');
    } else {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive meal reminders.'
      );
    }
  };

  const handleRestartOnboarding = async () => {
    Alert.alert(
      'Restart Onboarding',
      'This will clear all your data and restart the app from the beginning. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restart',
          style: 'destructive',
          onPress: async () => {
            try {
              await Storage.clear();
              await Storage.setOnboardingComplete(false);
              router.replace('/onboarding');
            } catch (error) {
              console.error('Error restarting onboarding:', error);
              Alert.alert('Error', 'Failed to restart onboarding');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      await Storage.setSettings(settings);
      if (settings.notifications) {
        const success = await NotificationManager.updateMealReminders(settings);
        if (!success) {
          Alert.alert(
            'Notification Permission Required',
            'Please enable notifications in your device settings to receive meal reminders.'
          );
        }
      } else {
        await NotificationManager.cancelAllScheduledNotificationsAsync();
      }
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleAddReminder = () => {
    if (!settings || !newReminderTime) return;

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newReminderTime)) {
      Alert.alert('Invalid Time', 'Please enter time in HH:mm format (e.g., 08:00)');
      return;
    }

    setSettings(prev => ({
      ...prev!,
      mealReminderTimes: [...prev!.mealReminderTimes, newReminderTime],
    }));
    setNewReminderTime('');
  };

  const handleRemoveReminder = (time: string) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      mealReminderTimes: prev!.mealReminderTimes.filter(t => t !== time),
    }));
  };

  if (!settings) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Weight Unit</Text>
            <View style={styles.unitSelector}>
              <Pressable
                style={[
                  styles.unitButton,
                  settings.weightUnit === 'kg' && styles.unitButtonActive,
                ]}
                onPress={() => setSettings(prev => ({ ...prev!, weightUnit: 'kg' }))}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    settings.weightUnit === 'kg' && styles.unitButtonTextActive,
                  ]}
                >
                  kg
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.unitButton,
                  settings.weightUnit === 'lbs' && styles.unitButtonActive,
                ]}
                onPress={() => setSettings(prev => ({ ...prev!, weightUnit: 'lbs' }))}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    settings.weightUnit === 'lbs' && styles.unitButtonTextActive,
                  ]}
                >
                  lbs
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Height Unit</Text>
            <View style={styles.unitSelector}>
              <Pressable
                style={[
                  styles.unitButton,
                  settings.heightUnit === 'cm' && styles.unitButtonActive,
                ]}
                onPress={() => setSettings(prev => ({ ...prev!, heightUnit: 'cm' }))}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    settings.heightUnit === 'cm' && styles.unitButtonTextActive,
                  ]}
                >
                  cm
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.unitButton,
                  settings.heightUnit === 'ft' && styles.unitButtonActive,
                ]}
                onPress={() => setSettings(prev => ({ ...prev!, heightUnit: 'ft' }))}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    settings.heightUnit === 'ft' && styles.unitButtonTextActive,
                  ]}
                >
                  ft
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              value={settings.notifications}
              onValueChange={value =>
                setSettings(prev => ({ ...prev!, notifications: value }))
              }
              trackColor={{ false: '#767577', true: COLORS.primary }}
              thumbColor={settings.notifications ? COLORS.white : '#f4f3f4'}
            />
          </View>

          {settings.notifications && (
            <View style={styles.reminderSection}>
              <Text style={styles.reminderTitle}>Meal Reminders</Text>
              <View style={styles.reminderInput}>
                <TextInput
                  style={styles.timeInput}
                  value={newReminderTime}
                  onChangeText={setNewReminderTime}
                  placeholder="HH:mm"
                  placeholderTextColor={COLORS.lightText}
                  keyboardType="numeric"
                />
                <Pressable
                  style={styles.addButton}
                  onPress={handleAddReminder}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>

              {settings.mealReminderTimes.map(time => (
                <View key={time} style={styles.reminderItem}>
                  <Text style={styles.reminderTime}>{time}</Text>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemoveReminder(time)}
                  >
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                  </Pressable>
                </View>
              ))}

              {settings.mealReminderTimes.length === 0 && (
                <Text style={styles.emptyReminders}>
                  No meal reminders set. Add your first reminder above.
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Goal</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Daily Water Intake (ml)</Text>
            <TextInput
              style={styles.waterInput}
              value={settings.waterGoal.toString()}
              onChangeText={value => {
                const numValue = parseInt(value) || 0;
                setSettings(prev => ({ ...prev!, waterGoal: numValue }));
              }}
              keyboardType="numeric"
              placeholder="Enter water goal"
              placeholderTextColor={COLORS.lightText}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Management</Text>
          
          <Pressable
            style={styles.managementButton}
            onPress={handleRequestNotificationPermission}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
              <Text style={styles.buttonText}>
                {hasNotificationPermission ? 'Notifications Enabled' : 'Allow Notifications'}
              </Text>
            </View>
            {!hasNotificationPermission && (
              <Ionicons name="chevron-forward" size={24} color={COLORS.lightText} />
            )}
          </Pressable>

          <Pressable
            style={[styles.managementButton, styles.dangerButton]}
            onPress={handleRestartOnboarding}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="refresh-outline" size={24} color={COLORS.error} />
              <Text style={[styles.buttonText, styles.dangerText]}>Restart Onboarding</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.lightText} />
          </Pressable>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  unitButtonActive: {
    backgroundColor: COLORS.primary,
  },
  unitButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  unitButtonTextActive: {
    color: COLORS.white,
  },
  reminderSection: {
    marginTop: 16,
  },
  reminderTitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  reminderInput: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reminderTime: {
    fontSize: 16,
    color: COLORS.text,
  },
  removeButton: {
    padding: 4,
  },
  emptyReminders: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    marginTop: 16,
  },
  waterInput: {
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 8,
    padding: 12,
    width: 120,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: COLORS.error,
  },
}); 