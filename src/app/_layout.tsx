import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Palette } from '@ichrono/theme';
import { AuthProvider } from '@ichrono/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Palette.backgroundPage },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="dealer" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
