# DietApp - Calorie Tracking App

A cross-platform mobile app built with Expo for tracking diet and calories. The app is designed to be offline-first, using local storage for all data.

## Features

- User profile setup with personalized calorie goals
- Daily calorie tracking with visual progress
- Meal logging with macronutrient tracking
- Offline meal suggestions based on dietary preferences
- Local storage for all data
- Dark mode support
- Push notifications for reminders
- Settings management
- Weight tracking

## Tech Stack

- React Native with Expo
- TypeScript
- MMKV for local storage
- Zustand for state management
- Expo Router for navigation
- Expo Notifications for reminders

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dietapp.git
cd dietapp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
dietapp/
├── app/                    # Expo Router app directory
│   ├── index.tsx          # Home screen
│   ├── onboarding.tsx     # User onboarding
│   ├── add-meal.tsx       # Add meal screen
│   └── settings.tsx       # Settings screen
├── components/            # Reusable components
│   ├── CalorieProgressBar.tsx
│   ├── MealCard.tsx
│   └── SettingsToggle.tsx
├── lib/                   # Core utilities
│   └── storage.ts        # MMKV storage wrapper
├── types/                # TypeScript types
│   └── index.ts         # Type definitions
├── utils/               # Helper functions
│   └── healthCalculations.ts
└── data/               # Static data
    └── meals.ts       # Meal suggestions
```

## Usage

1. First Launch:
   - Complete the onboarding process
   - Enter your personal information
   - Set your dietary goals and preferences

2. Daily Usage:
   - Track your meals using the home screen
   - Add new meals with the + button
   - View your daily progress
   - Check your remaining calories

3. Settings:
   - Customize notifications
   - Change theme preferences
   - Manage your profile
   - Reset data if needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Expo team for the amazing framework
- React Native community for the ecosystem
- All contributors who help improve the app
