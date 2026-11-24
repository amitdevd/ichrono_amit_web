import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Palette.black },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="otp-verify" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="create-password" />
    </Stack>
  );
}
