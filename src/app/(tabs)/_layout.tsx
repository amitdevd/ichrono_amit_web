import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Palette, FontSizes, Spacing, Shadows } from '@/constants/theme';
import { useBreakpoint } from '@ichrono/ui';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{emoji}</Text>
    </View>
  );
}

function SellTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.sellButton, focused && styles.sellButtonActive]}>
      <Text style={styles.sellIcon}>＋</Text>
    </View>
  );
}

export default function TabsLayout() {
  // On web tablet/desktop the User Web navbar replaces the mobile tab bar.
  const { mdUp } = useBreakpoint();
  const hideTabBar = Platform.OS === 'web' && mdUp;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.secondary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.65)',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: hideTabBar ? { display: 'none' } : styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔍" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarIcon: ({ focused }) => <SellTabIcon focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 70 : 65;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Palette.primary,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: TAB_BAR_HEIGHT,
    paddingTop: Spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.sm,
    ...Shadows.md,
  },
  tabLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    marginTop: Spacing.xxs,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  icon: {
    fontSize: 20,
    opacity: 0.65,
  },
  iconFocused: {
    opacity: 1,
  },
  sellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 16 : 8,
    ...Shadows.gold,
  },
  sellButtonActive: {
    backgroundColor: Palette.goldDark,
  },
  sellIcon: {
    fontSize: 24,
    color: Palette.white,
    fontWeight: '700',
    lineHeight: 28,
  },
});
