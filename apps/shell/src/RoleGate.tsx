import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth, type UserRole, getHomeRouteForRole } from '@ichrono/auth';
import { Palette } from '@ichrono/theme';

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackRoute?: string;
}

export default function RoleGate({
  allowedRoles,
  children,
  fallbackRoute,
}: RoleGateProps) {
  const { role, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.replace('/(auth)/login' as any);
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      const redirect = fallbackRoute || getHomeRouteForRole(role);
      router.replace(redirect as any);
    }
  }, [isLoggedIn, role, isLoading, allowedRoles, fallbackRoute]);

  if (isLoading || !isLoggedIn || (role && !allowedRoles.includes(role))) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Palette.secondary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.backgroundPage,
  },
});
