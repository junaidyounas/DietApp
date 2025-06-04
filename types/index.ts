export type Gender = 'male' | 'female' | 'other';

export type DietaryGoal = 'lose' | 'maintain' | 'gain';

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
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
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
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  timestamp: string;
  isFavorite?: boolean;
}

export interface WeightLog {
  id: string;
  weight: number;
  timestamp: string;
  notes?: string;
}

export interface Settings {
  notifications: {
    mealReminders: boolean;
    waterReminders: boolean;
    dailyCheckIn: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  waterGoal: number; // in ml
  mealReminderTimes: string[]; // HH:mm format
}

export interface DailyCalories {
  date: string;
  consumed: number;
  goal: number;
  meals: Meal[];
} 