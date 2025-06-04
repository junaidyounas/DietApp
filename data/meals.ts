import { DietaryPreference } from '../types';

export interface MealSuggestion {
  id: string;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietaryPreferences: DietaryPreference[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  instructions: string;
}

export const mealSuggestions: MealSuggestion[] = [
  {
    id: '1',
    name: 'Greek Yogurt with Berries',
    calories: 250,
    macros: {
      protein: 20,
      carbs: 25,
      fat: 8,
    },
    dietaryPreferences: ['none', 'vegetarian', 'gluten-free'],
    category: 'breakfast',
    ingredients: [
      'Greek yogurt (200g)',
      'Mixed berries (100g)',
      'Honey (1 tbsp)',
      'Almonds (10g)',
    ],
    instructions: 'Combine yogurt with berries, drizzle with honey, and top with almonds.',
  },
  {
    id: '2',
    name: 'Quinoa Buddha Bowl',
    calories: 450,
    macros: {
      protein: 18,
      carbs: 65,
      fat: 15,
    },
    dietaryPreferences: ['vegan', 'gluten-free'],
    category: 'lunch',
    ingredients: [
      'Quinoa (100g)',
      'Chickpeas (100g)',
      'Avocado (1/2)',
      'Kale (50g)',
      'Tahini dressing (2 tbsp)',
    ],
    instructions: 'Cook quinoa, combine with roasted chickpeas, massaged kale, and avocado. Drizzle with tahini dressing.',
  },
  {
    id: '3',
    name: 'Keto Chicken Salad',
    calories: 350,
    macros: {
      protein: 35,
      carbs: 5,
      fat: 22,
    },
    dietaryPreferences: ['keto', 'gluten-free'],
    category: 'lunch',
    ingredients: [
      'Chicken breast (150g)',
      'Avocado (1/2)',
      'Olive oil (1 tbsp)',
      'Mixed greens (50g)',
      'Parmesan cheese (20g)',
    ],
    instructions: 'Grill chicken, slice avocado, combine with greens and cheese. Dress with olive oil.',
  },
  {
    id: '4',
    name: 'Mediterranean Grilled Fish',
    calories: 400,
    macros: {
      protein: 40,
      carbs: 15,
      fat: 20,
    },
    dietaryPreferences: ['mediterranean', 'gluten-free'],
    category: 'dinner',
    ingredients: [
      'White fish fillet (200g)',
      'Olive oil (2 tbsp)',
      'Lemon (1/2)',
      'Herbs (rosemary, thyme)',
      'Cherry tomatoes (100g)',
    ],
    instructions: 'Marinate fish in olive oil, lemon, and herbs. Grill with cherry tomatoes.',
  },
  {
    id: '5',
    name: 'Protein Smoothie',
    calories: 300,
    macros: {
      protein: 25,
      carbs: 35,
      fat: 10,
    },
    dietaryPreferences: ['none', 'vegetarian', 'gluten-free'],
    category: 'snack',
    ingredients: [
      'Protein powder (30g)',
      'Banana (1)',
      'Almond milk (250ml)',
      'Peanut butter (1 tbsp)',
      'Spinach (30g)',
    ],
    instructions: 'Blend all ingredients until smooth.',
  },
];

// Helper function to get meal suggestions based on dietary preference
export const getMealSuggestions = (preference: DietaryPreference): MealSuggestion[] => {
  return mealSuggestions.filter(meal => 
    meal.dietaryPreferences.includes(preference)
  );
};

// Helper function to get meal suggestions by category
export const getMealsByCategory = (category: MealSuggestion['category']): MealSuggestion[] => {
  return mealSuggestions.filter(meal => meal.category === category);
};

// Helper function to get meal suggestions within calorie range
export const getMealsByCalorieRange = (min: number, max: number): MealSuggestion[] => {
  return mealSuggestions.filter(meal => 
    meal.calories >= min && meal.calories <= max
  );
}; 