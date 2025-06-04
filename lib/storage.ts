import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

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

// Initialize MMKV storage with fallback to AsyncStorage
let storage: MMKV | null = null;
try {
  storage = new MMKV({
    id: 'diet-app-storage',
    encryptionKey: 'diet-app-key'
  });
} catch (error) {
  console.warn('MMKV initialization failed, falling back to AsyncStorage:', error);
}

// Type-safe storage operations
export const Storage = {
  // User Profile
  getUserProfile: async () => {
    try {
      if (storage) {
        const profile = storage.getString(STORAGE_KEYS.USER_PROFILE);
        return profile ? JSON.parse(profile) : null;
      } else {
        const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        return profile ? JSON.parse(profile) : null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },
  setUserProfile: async (profile: any) => {
    try {
      const profileString = JSON.stringify(profile);
      if (storage) {
        storage.set(STORAGE_KEYS.USER_PROFILE, profileString);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, profileString);
      }
    } catch (error) {
      console.error('Error setting user profile:', error);
    }
  },

  // Daily Calories
  getDailyCalories: async () => {
    try {
      if (storage) {
        const calories = storage.getString(STORAGE_KEYS.DAILY_CALORIES);
        return calories ? JSON.parse(calories) : null;
      } else {
        const calories = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_CALORIES);
        return calories ? JSON.parse(calories) : null;
      }
    } catch (error) {
      console.error('Error getting daily calories:', error);
      return null;
    }
  },
  setDailyCalories: async (calories: any) => {
    try {
      const caloriesString = JSON.stringify(calories);
      if (storage) {
        storage.set(STORAGE_KEYS.DAILY_CALORIES, caloriesString);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_CALORIES, caloriesString);
      }
    } catch (error) {
      console.error('Error setting daily calories:', error);
    }
  },

  // Meals
  getMeals: async () => {
    try {
      if (storage) {
        const meals = storage.getString(STORAGE_KEYS.MEALS);
        return meals ? JSON.parse(meals) : [];
      } else {
        const meals = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
        return meals ? JSON.parse(meals) : [];
      }
    } catch (error) {
      console.error('Error getting meals:', error);
      return [];
    }
  },
  setMeals: async (meals: any[]) => {
    try {
      const mealsString = JSON.stringify(meals);
      if (storage) {
        storage.set(STORAGE_KEYS.MEALS, mealsString);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.MEALS, mealsString);
      }
    } catch (error) {
      console.error('Error setting meals:', error);
    }
  },
  addMeal: async (meal: any) => {
    try {
      const meals = await Storage.getMeals();
      meals.push(meal);
      await Storage.setMeals(meals);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  },

  // Favorite Meals
  getFavoriteMeals: async () => {
    try {
      if (storage) {
        const meals = storage.getString(STORAGE_KEYS.FAVORITE_MEALS);
        return meals ? JSON.parse(meals) : [];
      } else {
        const meals = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_MEALS);
        return meals ? JSON.parse(meals) : [];
      }
    } catch (error) {
      console.error('Error getting favorite meals:', error);
      return [];
    }
  },
  setFavoriteMeals: async (meals: any[]) => {
    try {
      const mealsString = JSON.stringify(meals);
      if (storage) {
        storage.set(STORAGE_KEYS.FAVORITE_MEALS, mealsString);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_MEALS, mealsString);
      }
    } catch (error) {
      console.error('Error setting favorite meals:', error);
    }
  },

  // Weight Log
  getWeightLog: async () => {
    try {
      if (storage) {
        const log = storage.getString(STORAGE_KEYS.WEIGHT_LOG);
        return log ? JSON.parse(log) : [];
      } else {
        const log = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHT_LOG);
        return log ? JSON.parse(log) : [];
      }
    } catch (error) {
      console.error('Error getting weight log:', error);
      return [];
    }
  },
  setWeightLog: async (log: any[]) => {
    try {
      const logString = JSON.stringify(log);
      if (storage) {
        storage.set(STORAGE_KEYS.WEIGHT_LOG, logString);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.WEIGHT_LOG, logString);
      }
    } catch (error) {
      console.error('Error setting weight log:', error);
    }
  },

  // Settings
  getSettings: async () => {
    try {
      if (storage) {
        const settings = storage.getString(STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : {};
      } else {
        const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : {};
      }
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },
  setSettings: async (settings: any) => {
    try {
      const settingsString = JSON.stringify(settings);
      if (storage) {
        storage.set(STORAGE_KEYS.SETTINGS, settingsString);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, settingsString);
      }
    } catch (error) {
      console.error('Error setting settings:', error);
    }
  },

  // Premium Status
  getPremiumStatus: async () => {
    try {
      if (storage) {
        return storage.getBoolean(STORAGE_KEYS.PREMIUM_STATUS) || false;
      } else {
        const status = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
        return status === 'true';
      }
    } catch (error) {
      console.error('Error getting premium status:', error);
      return false;
    }
  },
  setPremiumStatus: async (status: boolean) => {
    try {
      if (storage) {
        storage.set(STORAGE_KEYS.PREMIUM_STATUS, status);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, status.toString());
      }
    } catch (error) {
      console.error('Error setting premium status:', error);
    }
  },

  // Generic methods
  remove: async (key: string) => {
    try {
      if (storage) {
        storage.delete(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
  clear: async () => {
    try {
      if (storage) {
        storage.clearAll();
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
}; 