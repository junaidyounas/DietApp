import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

interface CalorieProgressBarProps {
  consumed: number;
  goal: number;
  height?: number;
  showDetails?: boolean;
}

export const CalorieProgressBar: React.FC<CalorieProgressBarProps> = ({
  consumed,
  goal,
  height = 20,
  showDetails = true,
}) => {
  const colorScheme = useColorScheme();
  const progress = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);

  const getProgressColor = () => {
    if (progress >= 100) return ['#FF4B4B', '#FF6B6B'];
    if (progress >= 80) return ['#FFA726', '#FFB74D'];
    return ['#4CAF50', '#66BB6A'];
  };

  return (
    <View style={styles.container}>
      <View style={[styles.progressContainer, { height }]}>
        <LinearGradient
          colors={getProgressColor()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBar, { width: `${progress}%` }]}
        />
        <BlurView
          intensity={colorScheme === 'dark' ? 20 : 40}
          tint={colorScheme}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            {consumed} / {goal} kcal
          </Text>
          <Text style={styles.remainingText}>
            {remaining} kcal remaining
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
  },
  remainingText: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 