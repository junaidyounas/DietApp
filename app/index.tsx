import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MealCard } from '../components/MealCard';
import { Storage } from '../lib/storage';
import { DailyCalories, Meal, MealCategory, UserProfile } from '../types';

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

const DEFAULT_CATEGORIES: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyCalories, setDailyCalories] = useState<DailyCalories | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('breakfast');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, dailyCaloriesData, mealsData] = await Promise.all([
        Storage.getProfile(),
        Storage.getDailyCalories(),
        Storage.getMeals(),
      ]);

      setProfile(profileData);
      setDailyCalories(dailyCaloriesData);
      setMeals(mealsData);

      // Extract custom categories
      const customCats = mealsData
        .filter((meal: Meal) => meal.category === 'custom' && meal.customCategoryName)
        .map((meal: Meal) => meal.customCategoryName!)
        .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);
      setCustomCategories(customCats);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFavoritePress = async (mealId: string) => {
    try {
      const updatedMeals = meals.map(meal =>
        meal.id === mealId ? { ...meal, isFavorite: !meal.isFavorite } : meal
      );
      await Storage.setMeals(updatedMeals);
      setMeals(updatedMeals);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const formatNumber = (value: number) => {
    return Math.round(value).toString();
  };

  const getMealsByCategory = (category: MealCategory) => {
    return meals.filter(meal => 
      category === 'custom' 
        ? meal.category === 'custom' && meal.customCategoryName
        : meal.category === category
    );
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Please complete onboarding first</Text>
          <Pressable
            style={styles.button}
            onPress={() => router.push('/onboarding')}
          >
            <Text style={styles.buttonText}>Start Onboarding</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Summary</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Calorie Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Goal</Text>
              <Text style={styles.summaryValue}>
                {formatNumber(dailyCalories?.goal || 0)} cal
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Consumed</Text>
              <Text style={styles.summaryValue}>
                {formatNumber(dailyCalories?.consumed || 0)} cal
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Remaining</Text>
              <Text style={[
                styles.summaryValue,
                { color: (dailyCalories?.remaining || 0) < 0 ? COLORS.error : COLORS.success }
              ]}>
                {formatNumber(dailyCalories?.remaining || 0)} cal
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <Pressable
              style={styles.addButton}
              onPress={() => router.push('/add-meal')}
            >
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabs}
          >
            {DEFAULT_CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    selectedCategory === category && styles.categoryTabTextActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Pressable>
            ))}
            {customCategories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === 'custom' && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedCategory('custom')}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    selectedCategory === 'custom' && styles.categoryTabTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {getMealsByCategory(selectedCategory).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No meals added yet</Text>
              <Pressable
                style={styles.addMealButton}
                onPress={() => router.push('/add-meal')}
              >
                <Text style={styles.addMealButtonText}>Add Your First Meal</Text>
              </Pressable>
            </View>
          ) : (
            getMealsByCategory(selectedCategory).map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                onFavoritePress={() => handleFavoritePress(meal.id)}
                onPress={() => router.push({ pathname: '/meal-details', params: { id: meal.id } })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
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
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  mealsSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  addButton: {
    padding: 8,
  },
  categoryTabs: {
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightText,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryTabTextActive: {
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.lightText,
    marginBottom: 16,
  },
  addMealButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addMealButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 