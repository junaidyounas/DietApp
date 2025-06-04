import { Gender, UserProfile } from '../types';

// Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
export const calculateBMR = (weight: number, height: number, age: number, gender: Gender): number => {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
};

// Calculate Total Daily Energy Expenditure (TDEE)
export function calculateTDEE(bmr: number, activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'): number {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  return bmr * activityMultipliers[activityLevel];
}

// Calculate daily calorie goal based on dietary goal
export function calculateDailyCalorieGoal(profile: UserProfile): number {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  
  switch (profile.goal) {
    case 'lose':
      return tdee - 500; // 500 calorie deficit for weight loss
    case 'gain':
      return tdee + 500; // 500 calorie surplus for weight gain
    default:
      return tdee; // maintenance
  }
}

// Calculate BMI
export function calculateBMI(weight: number, height: number): number {
  // Height should be in meters
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// Calculate ideal weight range based on height
export function calculateIdealWeightRange(height: number, gender: 'male' | 'female'): { min: number; max: number } {
  // Using Devine formula with gender adjustment
  const baseWeight = height - 100;
  const genderMultiplier = gender === 'male' ? 1 : 0.9;
  return {
    min: baseWeight * genderMultiplier * 0.9, // 10% below base weight
    max: baseWeight * genderMultiplier * 1.1, // 10% above base weight
  };
}

// Calculate daily water intake goal (in ml)
export function calculateWaterIntake(weight: number, activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'): number {
  const baseIntake = weight * 0.033; // Base intake in liters
  const activityMultipliers = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    very_active: 1.4,
  };
  
  return baseIntake * activityMultipliers[activityLevel];
}

// Calculate daily protein needs (in grams)
export function calculateProteinNeeds(weight: number, activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'): number {
  const proteinMultipliers = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.4,
    very_active: 1.6,
  };
  
  return Math.round(weight * proteinMultipliers[activityLevel]);
}

// Calculate all health metrics for a user profile
export const calculateHealthMetrics = (profile: UserProfile) => {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const dailyCalories = calculateDailyCalorieGoal(profile);
  const bmi = calculateBMI(profile.weight, profile.height);
  const idealWeight = calculateIdealWeightRange(profile.height, profile.gender);
  const waterIntake = calculateWaterIntake(profile.weight, profile.activityLevel);
  const proteinNeeds = calculateProteinNeeds(profile.weight, profile.activityLevel);

  return {
    bmr,
    tdee,
    dailyCalories,
    bmi,
    idealWeight,
    waterIntake,
    proteinNeeds,
  };
}; 