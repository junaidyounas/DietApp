import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Storage } from '../lib/storage';
import { UserProfile } from '../types';
import { calculateHealthMetrics } from '../utils/healthCalculations';

const { width } = Dimensions.get('window');

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

const UNIT_CONVERSIONS = {
  kgToLbs: (kg: number) => kg * 2.20462,
  lbsToKg: (lbs: number) => lbs / 2.20462,
  cmToFt: (cm: number) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return { feet, inches: remainingInches };
  },
  ftToCm: (feet: number, inches: number) => (feet * 12 + inches) * 2.54,
};

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
    heightUnit: 'cm',
    weightUnit: 'kg',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryPreferences: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const isComplete = await Storage.isOnboardingComplete();
    if (isComplete) {
      router.replace('/');
    }
  };

  const handleNext = async () => {
    if (step < 9) {
      setStep(step + 1);
    } else {
      try {
        // Convert units to metric for calculations
        const metricProfile = {
          ...profile,
          height: profile.heightUnit === 'ft' && profile.height !== undefined
            ? UNIT_CONVERSIONS.ftToCm(Math.floor(profile.height), (profile.height % 1) * 12)
            : profile.height || 0,
          weight: profile.weightUnit === 'lbs' && profile.weight !== undefined
            ? UNIT_CONVERSIONS.lbsToKg(profile.weight)
            : profile.weight || 0,
        };

        // Calculate health metrics
        const metrics = calculateHealthMetrics(metricProfile as UserProfile);

        // Save profile and daily calories
        await Storage.setUserProfile(profile as UserProfile);
        await Storage.setDailyCalories({
          date: new Date().toISOString().split('T')[0],
          goal: metrics.dailyCalories,
          consumed: 0,
          meals: [],
        });

        // Mark onboarding as complete
        await Storage.setOnboardingComplete(true);

        router.replace('/');
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === step && styles.progressDotActive,
              i < step && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStep = () => {
    const stepContent = (() => {
      switch (step) {
        case 1:
          return (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.iconContainer}
              >
                <Ionicons name="person-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>What's your name?</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Enter your name"
                autoFocus
                placeholderTextColor={COLORS.lightText}
              />
            </Animated.View>
          );
        case 2:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.accent]}
                style={styles.iconContainer}
              >
                <Ionicons name="calendar-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>How old are you?</Text>
              <TextInput
                style={styles.input}
                value={profile.age?.toString()}
                onChangeText={(text) => setProfile({ ...profile, age: Number(text) || 0 })}
                placeholder="Enter your age"
                keyboardType="numeric"
                placeholderTextColor={COLORS.lightText}
              />
            </Animated.View>
          );
        case 3:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.primary]}
                style={styles.iconContainer}
              >
                <Ionicons name="scale-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>Choose your weight unit</Text>
              <View style={styles.radioGroup}>
                {(['kg', 'lbs'] as const).map((unit) => (
                  <Pressable
                    key={unit}
                    style={[
                      styles.radioButton,
                      profile.weightUnit === unit && styles.radioButtonSelected,
                    ]}
                    onPress={() => setProfile({ ...profile, weightUnit: unit })}
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        profile.weightUnit === unit && styles.radioButtonTextSelected,
                      ]}
                    >
                      {unit.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          );
        case 4:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.iconContainer}
              >
                <Ionicons name="scale-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>What's your weight?</Text>
              <TextInput
                style={styles.input}
                value={profile.weight?.toString()}
                onChangeText={(text) => setProfile({ ...profile, weight: Number(text) || 0 })}
                placeholder={`Weight in ${profile.weightUnit}`}
                keyboardType="numeric"
                placeholderTextColor={COLORS.lightText}
              />
            </Animated.View>
          );
        case 5:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.accent]}
                style={styles.iconContainer}
              >
                <Ionicons name="resize-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>Choose your height unit</Text>
              <View style={styles.radioGroup}>
                {(['cm', 'ft'] as const).map((unit) => (
                  <Pressable
                    key={unit}
                    style={[
                      styles.radioButton,
                      profile.heightUnit === unit && styles.radioButtonSelected,
                    ]}
                    onPress={() => setProfile({ ...profile, heightUnit: unit })}
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        profile.heightUnit === unit && styles.radioButtonTextSelected,
                      ]}
                    >
                      {unit.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          );
        case 6:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.primary]}
                style={styles.iconContainer}
              >
                <Ionicons name="body-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>What's your height?</Text>
              {profile.heightUnit === 'cm' ? (
                <TextInput
                  style={styles.input}
                  value={profile.height?.toString()}
                  onChangeText={(text) => setProfile({ ...profile, height: Number(text) || 0 })}
                  placeholder="Height in centimeters"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.lightText}
                />
              ) : (
                <View style={styles.heightInputContainer}>
                  <View style={styles.heightInput}>
                    <TextInput
                      style={[styles.input, styles.heightInputField]}
                      value={Math.floor(profile.height || 0).toString()}
                      onChangeText={(text) => {
                        const feet = Number(text) || 0;
                        const inches = (profile.height || 0) % 1;
                        setProfile({ ...profile, height: feet + inches });
                      }}
                      placeholder="Feet"
                      keyboardType="numeric"
                      placeholderTextColor={COLORS.lightText}
                    />
                    <Text style={styles.heightUnit}>ft</Text>
                  </View>
                  <View style={styles.heightInput}>
                    <TextInput
                      style={[styles.input, styles.heightInputField]}
                      value={Math.round(((profile.height || 0) % 1) * 12).toString()}
                      onChangeText={(text) => {
                        const feet = Math.floor(profile.height || 0);
                        const inches = Number(text) || 0;
                        setProfile({ ...profile, height: feet + inches / 12 });
                      }}
                      placeholder="Inches"
                      keyboardType="numeric"
                      placeholderTextColor={COLORS.lightText}
                    />
                    <Text style={styles.heightUnit}>in</Text>
                  </View>
                </View>
              )}
            </Animated.View>
          );
        case 7:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.iconContainer}
              >
                <Ionicons name="male-female-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>What's your gender?</Text>
              <View style={styles.radioGroup}>
                {(['male', 'female'] as const).map((gender) => (
                  <Pressable
                    key={gender}
                    style={[
                      styles.radioButton,
                      profile.gender === gender && styles.radioButtonSelected,
                    ]}
                    onPress={() => setProfile({ ...profile, gender })}
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        profile.gender === gender && styles.radioButtonTextSelected,
                      ]}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          );
        case 8:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.accent]}
                style={styles.iconContainer}
              >
                <Ionicons name="fitness-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>What's your activity level?</Text>
              <View style={styles.radioGroup}>
                {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as const).map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.radioButton,
                      profile.activityLevel === level && styles.radioButtonSelected,
                    ]}
                    onPress={() => setProfile({ ...profile, activityLevel: level })}
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        profile.activityLevel === level && styles.radioButtonTextSelected,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          );
        case 9:
          return (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.step}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.primary]}
                style={styles.iconContainer}
              >
                <Ionicons name="flag-outline" size={64} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.label}>What's your goal?</Text>
              <View style={styles.radioGroup}>
                {(['lose', 'maintain', 'gain'] as const).map((goal) => (
                  <Pressable
                    key={goal}
                    style={[
                      styles.radioButton,
                      profile.goal === goal && styles.radioButtonSelected,
                    ]}
                    onPress={() => setProfile({ ...profile, goal })}
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        profile.goal === goal && styles.radioButtonTextSelected,
                      ]}
                    >
                      {goal.charAt(0).toUpperCase() + goal.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          );
        default:
          return null;
      }
    })();

    return stepContent;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to DietApp</Text>
        <Text style={styles.subtitle}>Let's set up your profile</Text>
      </View>
      {renderProgressBar()}
      {renderStep()}
      <View style={styles.navigation}>
        {step > 1 && (
          <Pressable style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleNext}
          disabled={step === 1 && !profile.name}
        >
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
            {step === 9 ? 'Finish' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightText,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightText,
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: COLORS.primary,
  },
  step: {
    padding: 20,
    minHeight: width * 0.8,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  radioGroup: {
    width: '100%',
  },
  radioButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  radioButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioButtonText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
  },
  radioButtonTextSelected: {
    color: COLORS.white,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: COLORS.white,
  },
  heightInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  heightInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  heightInputField: {
    flex: 1,
    marginBottom: 0,
  },
  heightUnit: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
}); 