import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  Palette,
  Spacing,
  FontSizes,
  FontWeights,
} from '@ichrono/theme';

export type UserRole = 'user' | 'dealer' | 'admin';

interface AuthHeaderProps {
  currentRole?: UserRole;
  showRoleSwitcher?: boolean;
  backHref?: string;
  backLabel?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  currentRole = 'user',
  showRoleSwitcher = true,
  backHref = '/home',
  backLabel = 'Back to Home Page',
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.navbar}>
        <Pressable onPress={() => router.push('/' as any)} style={styles.brandContainer}>
          <Image
            source={require('@/assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable
          onPress={() => router.push(backHref as any)}
          style={styles.backLink}
        >
          <Text style={styles.backText}>{backLabel}</Text>
          <Text style={styles.chevron}> ›</Text>
        </Pressable>
      </View>

      {showRoleSwitcher ? (
        <View style={styles.roleSwitcherContainer}>
          <View style={styles.roleSwitcher}>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              style={[
                styles.roleTab,
                currentRole === 'user' && styles.roleTabActive,
              ]}
            >
              <Text
                style={[
                  styles.roleTabText,
                  currentRole === 'user' && styles.roleTabTextActive,
                ]}
              >
                👤 User Portal
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/dealer/login')}
              style={[
                styles.roleTab,
                currentRole === 'dealer' && styles.roleTabActive,
              ]}
            >
              <Text
                style={[
                  styles.roleTabText,
                  currentRole === 'dealer' && styles.roleTabTextActive,
                ]}
              >
                🏢 Dealer Portal
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/admin/login')}
              style={[
                styles.roleTab,
                currentRole === 'admin' && styles.roleTabActive,
              ]}
            >
              <Text
                style={[
                  styles.roleTabText,
                  currentRole === 'admin' && styles.roleTabTextActive,
                ]}
              >
                🛡️ Admin Portal
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Palette.primary,
    width: '100%',
    paddingBottom: Spacing.sm,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 170,
    height: 44,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: Palette.secondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  chevron: {
    color: Palette.secondary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  roleSwitcherContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xs,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  roleSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 3,
    alignSelf: 'flex-start',
    gap: 4,
  },
  roleTab: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
  },
  roleTabActive: {
    backgroundColor: Palette.secondary,
  },
  roleTabText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  roleTabTextActive: {
    color: Palette.white,
    fontWeight: FontWeights.bold,
  },
});

export default AuthHeader;
