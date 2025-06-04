import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MealCard } from '../components/MealCard';
import { Storage } from '../lib/storage';
import { Meal } from '../types';

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

export default function FavoritesScreen() {
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const meals = await Storage.getMeals();
      const favorites = meals.filter(meal => meal.isFavorite);
      setFavoriteMeals(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleFavoritePress = async (mealId: string) => {
    try {
      const meals = await Storage.getMeals();
      const updatedMeals = meals.map(meal =>
        meal.id === mealId ? { ...meal, isFavorite: !meal.isFavorite } : meal
      );
      await Storage.setMeals(updatedMeals);
      const favorites = updatedMeals.filter(meal => meal.isFavorite);
      setFavoriteMeals(favorites);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Meals</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {favoriteMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={48} color={COLORS.lightText} />
            <Text style={styles.emptyStateText}>No favorite meals yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the heart icon on any meal to add it to favorites
            </Text>
          </View>
        ) : (
          favoriteMeals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              onFavoritePress={() => handleFavoritePress(meal.id)}
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
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 48,
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
  },
}); 