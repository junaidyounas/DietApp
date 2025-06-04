import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { CalorieProgressBar } from '../components/CalorieProgressBar';
import { MealCard } from '../components/MealCard';
import { Storage } from '../lib/storage';
import { Meal, UserProfile } from '../types';
import { calculateDailyCalorieGoal } from '../utils/healthCalculations';

const HomeScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const userProfile = await Storage.getUserProfile();
    const todayMeals = Storage.getMeals().filter((meal: Meal) => {
      const mealDate = new Date(meal.timestamp);
      const today = new Date();
      return (
        mealDate.getDate() === today.getDate() &&
        mealDate.getMonth() === today.getMonth() &&
        mealDate.getFullYear() === today.getFullYear()
      );
    });

    setProfile(userProfile);
    setMeals(todayMeals);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const dailyCalorieGoal = profile ? calculateDailyCalorieGoal(profile) : 0;
  const remainingCalories = dailyCalorieGoal - totalCalories;

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to DietApp!</Text>
        <Pressable
          style={styles.startButton}
          onPress={() => router.push('/onboarding')}
        >
          <Text style={styles.startButtonText}>Start Your Journey</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {profile.name}!</Text>
        <Pressable
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#666" />
        </Pressable>
      </View>

      <View style={styles.calorieContainer}>
        <Text style={styles.calorieTitle}>Today's Progress</Text>
        <CalorieProgressBar
          consumed={totalCalories}
          goal={dailyCalorieGoal}
        />
      </View>

      <View style={styles.mealsContainer}>
        <View style={styles.mealsHeader}>
          <Text style={styles.mealsTitle}>Today's Meals</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/add-meal')}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
          </Pressable>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>
              No meals logged today. Tap + to add your first meal!
            </Text>
          </View>
        ) : (
          meals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => router.push(`/meal/${meal.id}`)}
              onFavoritePress={() => {
                const updatedMeals = meals.map(m =>
                  m.id === meal.id ? { ...m, isFavorite: !m.isFavorite } : m
                );
                Storage.setMeals(updatedMeals);
                setMeals(updatedMeals);
              }}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  calorieContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  mealsContainer: {
    flex: 1,
    padding: 16,
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealsTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
}); 