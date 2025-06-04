import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Storage } from '../lib/storage';
import { UserProfile } from '../types';
import { calculateHealthMetrics } from '../utils/healthCalculations';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryPreferences: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      try {
        // Calculate health metrics
        const metrics = calculateHealthMetrics(profile as UserProfile);

        // Save profile and daily calories
        const completeProfile: UserProfile = {
          ...profile as UserProfile,
        };

        await Storage.setUserProfile(completeProfile);
        await Storage.setDailyCalories({
          date: new Date().toISOString().split('T')[0],
          goal: metrics.dailyCalories,
          consumed: 0,
          meals: [],
        });

        router.replace('/');
      } catch (error) {
        console.error('Error saving profile:', error);
        // Handle error appropriately
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.step}>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your name"
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.step}>
            <Text style={styles.label}>Basic Information</Text>
            <TextInput
              style={styles.input}
              value={profile.age?.toString()}
              onChangeText={(text) => setProfile({ ...profile, age: Number(text) || 0 })}
              placeholder="Age"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={profile.height?.toString()}
              onChangeText={(text) => setProfile({ ...profile, height: Number(text) || 0 })}
              placeholder="Height (cm)"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={profile.weight?.toString()}
              onChangeText={(text) => setProfile({ ...profile, weight: Number(text) || 0 })}
              placeholder="Weight (kg)"
              keyboardType="numeric"
            />
            <View style={styles.radioGroup}>
              <Text style={styles.radioLabel}>Gender:</Text>
              <Pressable
                style={[styles.radioButton, profile.gender === 'male' && styles.radioButtonSelected]}
                onPress={() => setProfile({ ...profile, gender: 'male' })}
              >
                <Text>Male</Text>
              </Pressable>
              <Pressable
                style={[styles.radioButton, profile.gender === 'female' && styles.radioButtonSelected]}
                onPress={() => setProfile({ ...profile, gender: 'female' })}
              >
                <Text>Female</Text>
              </Pressable>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.step}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.radioGroup}>
              {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as const).map((level) => (
                <Pressable
                  key={level}
                  style={[styles.radioButton, profile.activityLevel === level && styles.radioButtonSelected]}
                  onPress={() => setProfile({ ...profile, activityLevel: level })}
                >
                  <Text style={styles.radioButtonText}>
                    {level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.step}>
            <Text style={styles.label}>Your Goal</Text>
            <View style={styles.radioGroup}>
              {(['lose', 'maintain', 'gain'] as const).map((goal) => (
                <Pressable
                  key={goal}
                  style={[styles.radioButton, profile.goal === goal && styles.radioButtonSelected]}
                  onPress={() => setProfile({ ...profile, goal })}
                >
                  <Text style={styles.radioButtonText}>
                    {goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to DietApp</Text>
        <Text style={styles.subtitle}>Let's set up your profile</Text>
      </View>
      {renderStep()}
      <View style={styles.navigation}>
        {step > 1 && (
          <Pressable style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        )}
        <Pressable style={[styles.button, styles.buttonPrimary]} onPress={handleNext}>
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
            {step === 4 ? 'Finish' : 'Next'}
          </Text>
        </Pressable>
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  step: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#000',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  buttonTextPrimary: {
    color: '#fff',
  },
}); 