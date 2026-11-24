import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';
import { OnboardingProvider } from '@/components/web/OnboardingFrame';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Palette.backgroundPage },
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="step-one" />
        <Stack.Screen name="step-two" />
        <Stack.Screen name="step-three" />
        <Stack.Screen name="step-four" />
        <Stack.Screen name="step-five" />
      </Stack>
    </OnboardingProvider>
  );
}
