import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  Palette,
  Spacing,
  Radius,
  FontSizes,
  FontWeights,
  Durations,
} from '@/constants/theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.min(Math.max(currentStep / totalSteps, 0), 1);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: Durations.slow,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        Step{' '}
        <Text style={styles.stepHighlight}>{currentStep}</Text>
        {' '}of{' '}
        <Text style={styles.stepHighlight}>{totalSteps}</Text>
      </Text>

      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: widthInterpolation }]}
        />
      </View>
    </View>
  );
};

const TRACK_HEIGHT = 4;

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing['2xl'],
  },
  stepText: {
    color: Palette.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  stepHighlight: {
    color: Palette.gold,
    fontWeight: FontWeights.semibold,
  },
  track: {
    height: TRACK_HEIGHT,
    backgroundColor: Palette.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: TRACK_HEIGHT,
    backgroundColor: Palette.gold,
    borderRadius: Radius.full,
  },
});

export default ProgressBar;
