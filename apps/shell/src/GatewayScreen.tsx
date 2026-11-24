import React, { useState, useEffect } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  Palette,
  Spacing,
  Radius,
  FontSizes,
  FontWeights,
} from '@ichrono/theme';
import { FormInput, Button } from '@ichrono/ui';
import { useAuth, type UserRole } from '@ichrono/auth';

export default function GatewayScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 860;

  const { login, role, isLoggedIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<UserRole>('user');
  const [error, setError] = useState<string | null>(null);

  // Automatic redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && role) {
      handleRoleRedirect(role);
    }
  }, [isLoggedIn, role]);

  const handleRoleRedirect = (userRole: UserRole) => {
    switch (userRole) {
      case 'admin':
        router.replace('/admin/dashboard' as any);
        break;
      case 'dealer':
        router.replace('/dealer/dashboard' as any);
        break;
      case 'user':
      default:
        router.replace('/home' as any);
        break;
    }
  };

  const handleUnifiedLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setError(null);
    const authenticated = await login(email, password, selectedPortal);
    handleRoleRedirect(authenticated.role);
  };

  return (
    <View style={styles.screen}>
      {/* Shell Topbar */}
      <View style={styles.topbar}>
        <View style={styles.topbarContent}>
          <Image
            source={require('@/assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.gatewayBadge}>
            <Text style={styles.gatewayBadgeText}>MICROFRONTEND SHELL GATEWAY</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerArea}>
            <Text style={styles.heroTitle}>One Gateway. Three Portals.</Text>
            <Text style={styles.heroSubtitle}>
              Strict role-based access control powering customer marketplace, verified dealer suite, and administrative control console.
            </Text>
          </View>

          {/* Portal Selector Cards */}
          <View style={[styles.portalGrid, isLargeScreen && styles.portalGridLarge]}>
            {/* User Portal Card */}
            <Pressable
              onPress={() => setSelectedPortal('user')}
              style={[
                styles.portalCard,
                selectedPortal === 'user' && styles.portalCardSelected,
              ]}
            >
              <View style={styles.portalCardHeader}>
                <Text style={styles.portalEmoji}>👤</Text>
                {selectedPortal === 'user' && <View style={styles.activeDot} />}
              </View>
              <Text style={styles.portalCardTitle}>Customer Marketplace</Text>
              <Text style={styles.portalCardDesc}>
                Browse luxury watches, manage collections, sell timepieces, and place orders.
              </Text>
              <Pressable
                onPress={() => router.push('/home' as any)}
                style={styles.portalDirectLink}
              >
                <Text style={styles.portalDirectText}>Launch Marketplace →</Text>
              </Pressable>
            </Pressable>

            {/* Dealer Portal Card */}
            <Pressable
              onPress={() => setSelectedPortal('dealer')}
              style={[
                styles.portalCard,
                selectedPortal === 'dealer' && styles.portalCardSelected,
              ]}
            >
              <View style={styles.portalCardHeader}>
                <Text style={styles.portalEmoji}>🏢</Text>
                {selectedPortal === 'dealer' && <View style={styles.activeDot} />}
              </View>
              <Text style={styles.portalCardTitle}>Professional Dealer</Text>
              <Text style={styles.portalCardDesc}>
                Manage inventory, dealer profile, listings, customer inquiries, and orders.
              </Text>
              <Pressable
                onPress={() => router.push('/dealer/login' as any)}
                style={styles.portalDirectLink}
              >
                <Text style={styles.portalDirectText}>Launch Dealer Portal →</Text>
              </Pressable>
            </Pressable>

            {/* Admin Console Card */}
            <Pressable
              onPress={() => setSelectedPortal('admin')}
              style={[
                styles.portalCard,
                selectedPortal === 'admin' && styles.portalCardSelected,
              ]}
            >
              <View style={styles.portalCardHeader}>
                <Text style={styles.portalEmoji}>🛡️</Text>
                {selectedPortal === 'admin' && <View style={styles.activeDot} />}
              </View>
              <Text style={styles.portalCardTitle}>Super Admin Console</Text>
              <Text style={styles.portalCardDesc}>
                Platform security, verification requests, brand catalogs, and system management.
              </Text>
              <Pressable
                onPress={() => router.push('/admin/login' as any)}
                style={styles.portalDirectLink}
              >
                <Text style={styles.portalDirectText}>Launch Admin Console →</Text>
              </Pressable>
            </Pressable>
          </View>

          {/* Unified Login Box with Selected Role */}
          <View style={styles.loginCard}>
            <View style={styles.loginHeaderRow}>
              <Text style={styles.loginPortalTag}>
                SIGN IN AS:{' '}
                <Text style={styles.portalTagHighlight}>
                  {selectedPortal.toUpperCase()}
                </Text>
              </Text>
            </View>

            <FormInput
              label="Email Address"
              placeholder={`Enter ${selectedPortal} email`}
              value={email}
              onChangeText={(t) => {
                setEmail(t.replace(/\s/g, ''));
                if (error) setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={(t) => {
                setPassword(t.replace(/\s/g, ''));
                if (error) setError(null);
              }}
              secureTextEntry
              error={error || undefined}
            />

            <Button
              title={`Authorize & Enter ${selectedPortal.charAt(0).toUpperCase() + selectedPortal.slice(1)} Portal`}
              variant="primary"
              loading={isLoading}
              onPress={handleUnifiedLogin}
              style={styles.loginBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.backgroundPage,
  },
  flex: {
    flex: 1,
  },
  topbar: {
    backgroundColor: Palette.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  topbarContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 170,
    height: 42,
  },
  gatewayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  gatewayBadgeText: {
    color: Palette.secondary,
    fontSize: 10,
    fontWeight: FontWeights.bold,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  headerArea: {
    maxWidth: 800,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  heroTitle: {
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    color: Palette.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  portalGrid: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'column',
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  portalGridLarge: {
    flexDirection: 'row',
  },
  portalCard: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Palette.borderLight,
    padding: Spacing['2xl'],
    justifyContent: 'space-between',
  },
  portalCardSelected: {
    borderColor: Palette.secondary,
    backgroundColor: '#FAF7F2',
  },
  portalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  portalEmoji: {
    fontSize: 32,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.secondary,
  },
  portalCardTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Palette.primary,
    marginBottom: Spacing.xs,
  },
  portalCardDesc: {
    fontSize: FontSizes.xs,
    color: Palette.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  portalDirectLink: {
    alignSelf: 'flex-start',
  },
  portalDirectText: {
    fontSize: FontSizes.xs,
    color: Palette.secondary,
    fontWeight: FontWeights.bold,
  },
  loginCard: {
    maxWidth: 620,
    width: '100%',
    backgroundColor: Palette.white,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Palette.loginBack,
    padding: Spacing['3xl'],
  },
  loginHeaderRow: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  loginPortalTag: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Palette.textSecondary,
  },
  portalTagHighlight: {
    color: Palette.primary,
    fontWeight: FontWeights.bold,
  },
  loginBtn: {
    marginTop: Spacing.md,
  },
});
