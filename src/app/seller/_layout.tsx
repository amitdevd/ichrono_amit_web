import { Stack } from 'expo-router';
import { Palette } from '@/constants/theme';

/** User Web – "Set up as Private seller" (Milestone 2) and "Create listing" (Milestone 3) */
export default function SellerLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Palette.backgroundPage } }} />;
}
