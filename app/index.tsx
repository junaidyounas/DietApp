import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MealCard } from '../components/MealCard';
import { NotificationManager } from '../lib/notifications';
import { Storage } from '../lib/storage';
import { DailyCalories, Meal, MealCategory } from '../types';

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
  warning: '#FF9500',
  info: '#5856D6',
};

const DEFAULT_CATEGORIES: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [dailyCalories, setDailyCalories] = useState<DailyCalories | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('breakfast');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profileData, caloriesData, mealsData] = await Promise.all([
        Storage.getUserProfile(),
        Storage.getDailyCalories(),
        Storage.getMeals(),
      ]);

      setProfile(profileData);
      setDailyCalories(caloriesData);
      setMeals(mealsData);

      // Extract custom categories
      const customCats = mealsData
        .filter((meal: Meal) => meal.category === 'custom' && meal.customCategoryName)
        .map((meal: Meal) => meal.customCategoryName!)
        .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);

      setCustomCategories(customCats);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const getMealsByCategory = (category: MealCategory) => {
    return meals.filter(meal => meal.category === category);
  };

  const formatCalories = (calories: number) => {
    return calories.toLocaleString();
  };

  const getProgressColor = (consumed: number, goal: number) => {
    const percentage = (consumed / goal) * 100;
    if (percentage >= 100) return COLORS.error;
    if (percentage >= 80) return COLORS.warning;
    return COLORS.success;
  };

  const handleReminderToggle = async (mealId: string, enabled: boolean) => {
    try {
      const updatedMeals = meals.map(m => {
        if (m.id === mealId) {
          return {
            ...m,
            reminderEnabled: enabled,
            reminderTime: enabled ? m.reminderTime || '12:00' : undefined,
          };
        }
        return m;
      });
      setMeals(updatedMeals);
      await Storage.setMeals(updatedMeals);

      const meal = updatedMeals.find(m => m.id === mealId);
      if (meal) {
        if (enabled) {
          await NotificationManager.scheduleMealReminder(meal, meal.reminderTime || '12:00');
        } else {
          await NotificationManager.cancelMealReminder(meal.id);
        }
      }
    } catch (error) {
      console.error('Error updating meal reminder:', error);
      Alert.alert('Error', 'Failed to update meal reminder');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Summary</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/add-meal')}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </Pressable>
      </View>

      <View style={styles.calorieCard}>
        <View style={styles.calorieHeader}>
          <Text style={styles.calorieTitle}>Calories</Text>
          <Text style={styles.calorieSubtitle}>
            Goal: {formatCalories(dailyCalories?.goal || 0)}
          </Text>
        </View>
        <View style={styles.calorieProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    ((dailyCalories?.consumed || 0) / (dailyCalories?.goal || 1)) * 100,
                    100
                  )}%`,
                  backgroundColor: getProgressColor(
                    dailyCalories?.consumed || 0,
                    dailyCalories?.goal || 1
                  ),
                },
              ]}
            />
          </View>
          <View style={styles.calorieStats}>
            <View style={styles.calorieStat}>
              <Text style={styles.calorieLabel}>Consumed</Text>
              <Text style={styles.calorieValue}>
                {formatCalories(dailyCalories?.consumed || 0)}
              </Text>
            </View>
            <View style={styles.calorieStat}>
              <Text style={styles.calorieLabel}>Remaining</Text>
              <Text style={styles.calorieValue}>
                {formatCalories(dailyCalories?.remaining || 0)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {[...DEFAULT_CATEGORIES, ...customCategories].map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category as MealCategory)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category && styles.categoryTabTextActive,
              ]}
            >
              {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.mealList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {getMealsByCategory(selectedCategory).length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={64} color={COLORS.lightText} />
            <Text style={styles.emptyStateText}>No meals added yet</Text>
            <Pressable
              style={styles.emptyStateButton}
              onPress={() => router.push('/add-meal')}
            >
              <Text style={styles.emptyStateButtonText}>Add Your First Meal</Text>
            </Pressable>
          </View>
        ) : (
          getMealsByCategory(selectedCategory).map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => router.push(`/meal-details?id=${meal.id}`)}
              onFavoritePress={() => {
                const updatedMeals = meals.map((m) =>
                  m.id === meal.id ? { ...m, isFavorite: !m.isFavorite } : m
                );
                setMeals(updatedMeals);
                Storage.setMeals(updatedMeals);
              }}
              onReminderToggle={(enabled) => handleReminderToggle(meal.id, enabled)}
            />
          ))
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calorieCard: {
    margin: 20,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  calorieHeader: {
    marginBottom: 16,
  },
  calorieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  calorieSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginTop: 4,
  },
  calorieProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  calorieStat: {
    alignItems: 'center',
  },
  calorieLabel: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  categoryTabs: {
    maxHeight: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryTabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  mealList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.lightText,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  mealDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  mealDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  mealDetailText: {
    fontSize: 14,
    color: COLORS.lightText,
    marginLeft: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
  },
}); 