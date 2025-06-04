import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : COLORS.white,
          },
          headerTintColor: isDark ? COLORS.white : COLORS.text,
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: isDark ? '#1a1a1a' : COLORS.white,
            borderTopColor: isDark ? '#333' : '#eee',
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: isDark ? COLORS.lightText : COLORS.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="onboarding"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="add-meal"
          options={{
            href: null,
            presentation: 'modal',
          }}
        />
        <Tabs.Screen
          name="meal-details"
          options={{
            href: null,
            presentation: 'modal',
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
