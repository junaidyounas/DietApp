import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Storage } from '../lib/storage';
import { UserProfile } from '../types';
import { calculateBMI, calculateIdealWeightRange } from '../utils/healthCalculations';

export default function ProgressScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weight, setWeight] = useState('');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = await Storage.getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setWeight(savedProfile.weight.toString());
      if (savedProfile.measurements) {
        setMeasurements(savedProfile.measurements);
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    const newWeight = parseFloat(weight);
    if (isNaN(newWeight) || newWeight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight.');
      return;
    }

    const updatedProfile: UserProfile = {
      ...profile,
      weight: newWeight,
      measurements: {
        chest: parseFloat(measurements.chest) || 0,
        waist: parseFloat(measurements.waist) || 0,
        hips: parseFloat(measurements.hips) || 0,
      },
    };

    await Storage.setUserProfile(updatedProfile);
    setProfile(updatedProfile);
    Alert.alert('Success', 'Progress updated successfully!');
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please complete your profile first.</Text>
      </View>
    );
  }

  const bmi = calculateBMI(profile.weight, profile.height);
  const idealWeight = calculateIdealWeightRange(profile.height, profile.gender);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight Tracking</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Enter weight"
          />
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>BMI</Text>
            <Text style={styles.statValue}>{bmi.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ideal Weight Range</Text>
            <Text style={styles.statValue}>
              {idealWeight.min.toFixed(1)} - {idealWeight.max.toFixed(1)} kg
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Measurements</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Chest (cm)</Text>
          <TextInput
            style={styles.input}
            value={measurements.chest}
            onChangeText={(value) => setMeasurements({ ...measurements, chest: value })}
            keyboardType="numeric"
            placeholder="Enter chest measurement"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Waist (cm)</Text>
          <TextInput
            style={styles.input}
            value={measurements.waist}
            onChangeText={(value) => setMeasurements({ ...measurements, waist: value })}
            keyboardType="numeric"
            placeholder="Enter waist measurement"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hips (cm)</Text>
          <TextInput
            style={styles.input}
            value={measurements.hips}
            onChangeText={(value) => setMeasurements({ ...measurements, hips: value })}
            keyboardType="numeric"
            placeholder="Enter hips measurement"
          />
        </View>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Progress</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
}); 