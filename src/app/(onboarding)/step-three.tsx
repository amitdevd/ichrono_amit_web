import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { ErrorLine, OnboardingFrame, OptionGrid, useOnboarding } from '@/components/user/OnboardingFrame';
import { Btn } from '@ichrono/ui';

/** backend_ref/views/user/setting/stepthree.blade.php */
const OPTIONS = [
  { key: 'Luxury', image: require('@/assets/images/luxury.webp') },
  { key: 'Real Estate', image: require('@/assets/images/real-estate.webp') },
  { key: 'Cars', image: require('@/assets/images/cars.webp') },
  { key: 'Design', image: require('@/assets/images/design.webp') },
  { key: 'Architecture', image: require('@/assets/images/architecture.webp') },
  { key: 'Fashion', image: require('@/assets/images/fashion.webp') },
];

export default function StepThree() {
  const { answers, update } = useOnboarding();
  const [error, setError] = useState('');
  return (
    <OnboardingFrame
      step={3}
      question="What are some of your other interests?"
      description="We will use your selection to personalise the topics and watches to bring in front of you."
    >
      <OptionGrid
        options={OPTIONS}
        selected={answers.interests}
        onToggle={(k) => {
          setError('');
          update({ interests: answers.interests.includes(k) ? answers.interests.filter((x) => x !== k) : [...answers.interests, k] });
        }}
      />
      <ErrorLine>{error}</ErrorLine>
      <View style={styles.btns}>
        <Btn title="Back" variant="customBtn4" style={{ flex: 1, width: 'auto' }} onPress={() => router.replace('/(onboarding)/step-two' as any)} />
        <Btn
          title="Next"
          variant="customBtn3"
          style={{ flex: 1, width: 'auto' }}
          onPress={() => (answers.interests.length ? router.push('/(onboarding)/step-four' as any) : setError('Please select at least one interest.'))}
        />
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({ btns: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing['2xl'] } });
