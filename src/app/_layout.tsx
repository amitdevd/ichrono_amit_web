import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { BRAND_NAME } from '@/constants/brand';
import { Palette } from '@ichrono/theme';
import { AuthProvider } from '@ichrono/auth';
import { SellerProvider } from '@/context/seller';
import { ListingsProvider } from '@/context/listings';
import { SiteContentProvider } from '@/context/site-content';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SellerProvider>
        <SiteContentProvider>
          <ListingsProvider>
            <Head>
              <title>{BRAND_NAME}</title>
            </Head>
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
              <Stack.Screen name="seller" />
            </Stack>
          </ListingsProvider>
        </SiteContentProvider>
      </SellerProvider>
    </AuthProvider>
  );
}
