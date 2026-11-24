import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Palette.backgroundPage },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp-verify" />
      <Stack.Screen name="create-password" />
      <Stack.Screen name="(panel)" />
    </Stack>
  );
}
