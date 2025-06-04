import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Storage } from '../lib/storage';
import { UserProfile } from '../types';
import { calculateHealthMetrics } from '../utils/healthCalculations';

const OnboardingScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const updateFormData = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const profile: UserProfile = {
      ...formData as UserProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const metrics = calculateHealthMetrics(profile);
    Storage.setUserProfile(profile);
    router.replace('/');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.step}>
            <Text style={styles.title}>Basic Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={value => updateFormData('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={formData.age?.toString()}
              onChangeText={value => updateFormData('age', parseInt(value) || 0)}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={formData.weight?.toString()}
              onChangeText={value => updateFormData('weight', parseFloat(value) || 0)}
            />
            <TextInput
              style={styles.input}
              placeholder="Height (cm)"
              keyboardType="numeric"
              value={formData.height?.toString()}
              onChangeText={value => updateFormData('height', parseFloat(value) || 0)}
            />
            <View style={styles.genderContainer}>
              {(['male', 'female'] as const).map(gender => (
                <Pressable
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonActive,
                  ]}
                  onPress={() => updateFormData('gender', gender)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === gender && styles.genderButtonTextActive,
                    ]}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.step}>
            <Text style={styles.title}>Activity Level</Text>
            <View style={styles.goalContainer}>
              {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as const).map(level => (
                <Pressable
                  key={level}
                  style={[
                    styles.goalButton,
                    formData.activityLevel === level && styles.goalButtonActive,
                  ]}
                  onPress={() => updateFormData('activityLevel', level)}
                >
                  <Text
                    style={[
                      styles.goalButtonText,
                      formData.activityLevel === level && styles.goalButtonTextActive,
                    ]}
                  >
                    {level.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.step}>
            <Text style={styles.title}>Dietary Preferences</Text>
            <ScrollView style={styles.preferenceContainer}>
              {([
                'none',
                'vegetarian',
                'vegan',
                'keto',
                'paleo',
                'mediterranean',
                'gluten-free',
                'dairy-free',
              ] as const).map(preference => (
                <Pressable
                  key={preference}
                  style={[
                    styles.preferenceButton,
                    formData.dietaryPreferences?.includes(preference) &&
                      styles.preferenceButtonActive,
                  ]}
                  onPress={() => {
                    const currentPreferences = formData.dietaryPreferences || [];
                    const newPreferences = currentPreferences.includes(preference)
                      ? currentPreferences.filter(p => p !== preference)
                      : [...currentPreferences, preference];
                    updateFormData('dietaryPreferences', newPreferences);
                  }}
                >
                  <Text
                    style={[
                      styles.preferenceButtonText,
                      formData.dietaryPreferences?.includes(preference) &&
                        styles.preferenceButtonTextActive,
                    ]}
                  >
                    {preference
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      case 4:
        return (
          <View style={styles.step}>
            <Text style={styles.title}>Review Your Information</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>Name: {formData.name}</Text>
              <Text style={styles.reviewText}>Age: {formData.age} years</Text>
              <Text style={styles.reviewText}>Weight: {formData.weight} kg</Text>
              <Text style={styles.reviewText}>Height: {formData.height} cm</Text>
              <Text style={styles.reviewText}>
                Gender: {formData.gender?.charAt(0).toUpperCase()}
                {formData.gender?.slice(1)}
              </Text>
              <Text style={styles.reviewText}>
                Activity Level: {formData.activityLevel?.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              <Text style={styles.reviewText}>
                Dietary Preferences:{' '}
                {formData.dietaryPreferences?.map(pref =>
                  pref.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                ).join(', ')}
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
        <View style={styles.navigation}>
          {step > 1 && (
            <Pressable
              style={styles.backButton}
              onPress={() => setStep(prev => prev - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.nextButton,
              (!formData.age ||
                !formData.weight ||
                !formData.height ||
                !formData.gender ||
                !formData.activityLevel ||
                !formData.dietaryPreferences) &&
                styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={
              !formData.age ||
              !formData.weight ||
              !formData.height ||
              !formData.gender ||
              !formData.activityLevel ||
              !formData.dietaryPreferences
            }
          >
            <Text style={styles.nextButtonText}>
              {step === 4 ? 'Complete' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  step: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#4CAF50',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#666',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  goalContainer: {
    gap: 16,
  },
  goalButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  goalButtonActive: {
    backgroundColor: '#4CAF50',
  },
  goalButtonText: {
    fontSize: 18,
    color: '#666',
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  preferenceContainer: {
    maxHeight: 400,
  },
  preferenceButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  preferenceButtonActive: {
    backgroundColor: '#4CAF50',
  },
  preferenceButtonText: {
    fontSize: 16,
    color: '#666',
  },
  preferenceButtonTextActive: {
    color: '#fff',
  },
  reviewContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 