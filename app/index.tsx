import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalorieProgressBar } from '../components/CalorieProgressBar';
import { MealCard } from '../components/MealCard';
import { Storage } from '../lib/storage';
import { DailyCalories, Meal, UserProfile } from '../types';

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyCalories, setDailyCalories] = useState<DailyCalories | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userProfile, calories, userMeals] = await Promise.all([
        Storage.getUserProfile(),
        Storage.getDailyCalories(),
        Storage.getMeals(),
      ]);

      if (!userProfile) {
        router.replace('/onboarding');
        return;
      }

      setProfile(userProfile);
      setDailyCalories(calories);
      setMeals(userMeals);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddMeal = () => {
    router.push('/add-meal');
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const updatedMeals = meals.filter(meal => meal.id !== mealId);
      await Storage.setMeals(updatedMeals);
      setMeals(updatedMeals);

      if (dailyCalories) {
        const deletedMeal = meals.find(meal => meal.id === mealId);
        if (deletedMeal) {
          const updatedCalories = {
            ...dailyCalories,
            consumed: dailyCalories.consumed - deletedMeal.calories,
          };
          await Storage.setDailyCalories(updatedCalories);
          setDailyCalories(updatedCalories);
        }
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
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
      console.error('Error updating meal favorite status:', error);
    }
  };

  if (!profile || !dailyCalories) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {profile.name}</Text>
        <Pressable onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </Pressable>
      </View>

      <View style={styles.calorieSection}>
        <Text style={styles.sectionTitle}>Today's Calories</Text>
        <CalorieProgressBar
          consumed={dailyCalories.consumed}
          goal={dailyCalories.goal}
        />
        <Text style={styles.calorieText}>
          {dailyCalories.consumed} / {dailyCalories.goal} kcal
        </Text>
      </View>

      <View style={styles.mealsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <Pressable style={styles.addButton} onPress={handleAddMeal}>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.addButtonText}>Add Meal</Text>
          </Pressable>
        </View>

        {meals.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged today</Text>
        ) : (
          meals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              onFavoritePress={() => handleFavoritePress(meal.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calorieSection: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  calorieText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  mealsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    marginLeft: 4,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
}); 