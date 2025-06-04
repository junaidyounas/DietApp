import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SettingsToggle } from '../components/SettingsToggle';
import { Storage } from '../lib/storage';
import { Settings } from '../types';

const SettingsScreen = () => {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      mealReminders: true,
      waterReminders: true,
      dailyCheckIn: true,
    },
    theme: 'system',
    waterGoal: 2000,
    mealReminderTimes: ['08:00', '12:00', '18:00'],
  });

  useEffect(() => {
    const savedSettings = Storage.getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    Storage.setSettings(updatedSettings);
  };

  const handleResetProfile = () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset your profile? This will delete all your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Storage.clear();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingsToggle
          label="Meal Reminders"
          value={settings.notifications.mealReminders}
          onValueChange={value =>
            updateSettings({
              notifications: { ...settings.notifications, mealReminders: value },
            })
          }
          icon="notifications-outline"
          description="Get reminded about your meal times"
        />
        <SettingsToggle
          label="Water Reminders"
          value={settings.notifications.waterReminders}
          onValueChange={value =>
            updateSettings({
              notifications: { ...settings.notifications, waterReminders: value },
            })
          }
          icon="water-outline"
          description="Get reminded to drink water"
        />
        <SettingsToggle
          label="Daily Check-in"
          value={settings.notifications.dailyCheckIn}
          onValueChange={value =>
            updateSettings({
              notifications: { ...settings.notifications, dailyCheckIn: value },
            })
          }
          icon="calendar-outline"
          description="Get reminded to log your daily progress"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.themeContainer}>
          {(['light', 'dark', 'system'] as const).map(theme => (
            <Pressable
              key={theme}
              style={[
                styles.themeButton,
                settings.theme === theme && styles.themeButtonActive,
              ]}
              onPress={() => updateSettings({ theme })}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  settings.theme === theme && styles.themeButtonTextActive,
                ]}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <Pressable
          style={styles.dangerButton}
          onPress={handleResetProfile}
        >
          <Text style={styles.dangerButtonText}>Reset Profile</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>
            © 2024 DietApp. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  themeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  themeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  themeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  dangerButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 14,
    color: '#999',
  },
}); 