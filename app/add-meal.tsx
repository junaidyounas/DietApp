import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function AddMealScreen() {
  const [meal, setMeal] = useState<Partial<Meal>>({
    name: '',
    calories: undefined,
    protein: undefined,
    carbs: undefined,
    fat: undefined,
    timestamp: new Date().toISOString(),
    isFavorite: false,
  });

  const handleSave = async () => {
    try {
      if (!meal.name || meal.calories === undefined) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const newMeal: Meal = {
        id: Date.now().toString(),
        name: meal.name,
        calories: Math.round(meal.calories),
        protein: Math.round(meal.protein || 0),
        carbs: Math.round(meal.carbs || 0),
        fat: Math.round(meal.fat || 0),
        timestamp: meal.timestamp || new Date().toISOString(),
        isFavorite: false,
      };

      // Get current meals
      const currentMeals = await Storage.getMeals();
      const updatedMeals = [...currentMeals, newMeal];

      // Save updated meals
      await Storage.setMeals(updatedMeals);

      // Update daily calories
      const dailyCalories = await Storage.getDailyCalories();
      if (dailyCalories) {
        const updatedDailyCalories = {
          ...dailyCalories,
          consumed: dailyCalories.consumed + newMeal.calories,
          meals: [...dailyCalories.meals, newMeal],
        };
        await Storage.setDailyCalories(updatedDailyCalories);
      }

      router.back();
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'Failed to save meal. Please try again.');
    }
  };

  const formatNumber = (value: number | undefined) => {
    if (value === undefined) return '';
    return Math.round(value).toString();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </Pressable>
          <Text style={styles.title}>Add Meal</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meal Name *</Text>
              <TextInput
                style={styles.input}
                value={meal.name}
                onChangeText={(text) => setMeal({ ...meal, name: text })}
                placeholder="Enter meal name"
                placeholderTextColor={COLORS.lightText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Calories *</Text>
              <TextInput
                style={styles.input}
                value={formatNumber(meal.calories)}
                onChangeText={(text) => setMeal({ ...meal, calories: Number(text) || undefined })}
                placeholder="Enter calories"
                keyboardType="numeric"
                placeholderTextColor={COLORS.lightText}
              />
            </View>

            <View style={styles.macrosContainer}>
              <View style={styles.macroInput}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formatNumber(meal.protein)}
                  onChangeText={(text) => setMeal({ ...meal, protein: Number(text) || undefined })}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.lightText}
                />
              </View>

              <View style={styles.macroInput}>
                <Text style={styles.label}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formatNumber(meal.carbs)}
                  onChangeText={(text) => setMeal({ ...meal, carbs: Number(text) || undefined })}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.lightText}
                />
              </View>

              <View style={styles.macroInput}>
                <Text style={styles.label}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formatNumber(meal.fat)}
                  onChangeText={(text) => setMeal({ ...meal, fat: Number(text) || undefined })}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.lightText}
                />
              </View>
            </View>

            <Pressable 
              style={[
                styles.saveButton,
                (!meal.name || meal.calories === undefined) && styles.saveButtonDisabled
              ]} 
              onPress={handleSave}
              disabled={!meal.name || meal.calories === undefined}
            >
              <Text style={styles.saveButtonText}>Save Meal</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.lightText,
    opacity: 0.5,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
}); 