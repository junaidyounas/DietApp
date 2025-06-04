import { MMKV } from 'react-native-mmkv';

// Initialize MMKV storage
export const storage = new MMKV({
  id: 'diet-app-storage',
  encryptionKey: 'diet-app-key'
});

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  DAILY_CALORIES: 'daily_calories',
  MEALS: 'meals',
  FAVORITE_MEALS: 'favorite_meals',
  WEIGHT_LOG: 'weight_log',
  SETTINGS: 'settings',
  PREMIUM_STATUS: 'premium_status',
} as const;

// Type-safe storage operations
export const Storage = {
  // User Profile
  getUserProfile: () => {
    const profile = storage.getString(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  },
  setUserProfile: (profile: any) => {
    storage.set(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Daily Calories
  getDailyCalories: () => {
    const calories = storage.getString(STORAGE_KEYS.DAILY_CALORIES);
    return calories ? JSON.parse(calories) : null;
  },
  setDailyCalories: (calories: any) => {
    storage.set(STORAGE_KEYS.DAILY_CALORIES, JSON.stringify(calories));
  },

  // Meals
  getMeals: () => {
    const meals = storage.getString(STORAGE_KEYS.MEALS);
    return meals ? JSON.parse(meals) : [];
  },
  setMeals: (meals: any[]) => {
    storage.set(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  },
  addMeal: (meal: any) => {
    const meals = Storage.getMeals();
    meals.push(meal);
    Storage.setMeals(meals);
  },

  // Favorite Meals
  getFavoriteMeals: () => {
    const meals = storage.getString(STORAGE_KEYS.FAVORITE_MEALS);
    return meals ? JSON.parse(meals) : [];
  },
  setFavoriteMeals: (meals: any[]) => {
    storage.set(STORAGE_KEYS.FAVORITE_MEALS, JSON.stringify(meals));
  },

  // Weight Log
  getWeightLog: () => {
    const log = storage.getString(STORAGE_KEYS.WEIGHT_LOG);
    return log ? JSON.parse(log) : [];
  },
  setWeightLog: (log: any[]) => {
    storage.set(STORAGE_KEYS.WEIGHT_LOG, JSON.stringify(log));
  },

  // Settings
  getSettings: () => {
    const settings = storage.getString(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
  },
  setSettings: (settings: any) => {
    storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Premium Status
  getPremiumStatus: () => {
    return storage.getBoolean(STORAGE_KEYS.PREMIUM_STATUS) || false;
  },
  setPremiumStatus: (status: boolean) => {
    storage.set(STORAGE_KEYS.PREMIUM_STATUS, status);
  },

  // Generic methods
  remove: (key: string) => {
    storage.delete(key);
  },
  clear: () => {
    storage.clearAll();
  },
}; 