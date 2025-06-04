import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1a1a1a' : COLORS.white }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? '#1a1a1a' : COLORS.white,
            },
            headerTintColor: isDark ? COLORS.white : COLORS.text,
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: isDark ? '#1a1a1a' : COLORS.background,
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Home',
              headerRight: () => (
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={isDark ? COLORS.white : COLORS.text}
                  style={{ marginRight: 16 }}
                  onPress={() => router.push('/settings')}
                />
              ),
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="add-meal"
            options={{
              title: 'Add Meal',
              presentation: 'modal',
            }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
