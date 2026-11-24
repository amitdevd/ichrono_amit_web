import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';
import { DealerSignupProvider } from '@/context/dealer-signup';

export default function DealerLayout() {
  return (
    <DealerSignupProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Palette.backgroundPage },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="step-three" />
        <Stack.Screen name="step-four" />
        <Stack.Screen name="step-five" />
        <Stack.Screen name="step-six" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-otp" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="(panel)" />
      </Stack>
    </DealerSignupProvider>
  );
}
