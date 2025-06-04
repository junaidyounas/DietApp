export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietaryGoal = 'lose' | 'maintain' | 'gain';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft';

export type DietaryPreference = 
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'gluten-free'
  | 'dairy-free';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  activityLevel: ActivityLevel;
  goal: DietaryGoal;
  dietaryPreferences: string[];
  measurements?: {
    chest: number;
    waist: number;
    hips: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  isFavorite: boolean;
}

export interface WeightLog {
  id: string;
  weight: number;
  timestamp: string;
  notes?: string;
}

export interface Settings {
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  darkMode: boolean;
  notifications: boolean;
  waterGoal: number; // in ml
  mealReminderTimes: string[]; // HH:mm format
}

export interface DailyCalories {
  date: string;
  goal: number;
  consumed: number;
  remaining: number;
  meals: Meal[];
} 