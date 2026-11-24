import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LOGO_BG } from '@/constants/brand';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import Icon from '@/components/common/Icon';

/**
 * User Web auth pages – backend_ref/views/user/setting/*.blade.php
 *  header.loginUi  : logo + "Back to Home Page >"
 *  .loginMain > .loginContent : centred white card (max 660, radius 25)
 */
export function UserAuthHeader() {
  const { isMobile } = useBreakpoint();
  return (
    <View style={styles.header}>
      <View style={styles.navContainer}>
        <Pressable onPress={() => router.push('/home' as any)}>
          <Image
            source={require('@/assets/images/Logo.png')}
            style={[styles.logo, isMobile && { width: 140, height: 42 }]}
            resizeMode="contain"
          />
        </Pressable>
        <Pressable onPress={() => router.push('/home' as any)} style={styles.backPage}>
          {({ hovered }: any) => (
            <>
              <Text style={[styles.backText, hovered && { color: Palette.fourth }]}>Back to Home Page</Text>
              <Icon name="chevron-right" size={12} color={hovered ? Palette.fourth : Palette.secondary} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function UserAuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screen}>
      <UserAuthHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.loginMain} keyboardShouldPersistTaps="handled">
          <View style={styles.loginContent}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/** `<h3>` with optional `<a><i class="fa-angle-left"></i></a>` back arrow */
export function AuthTitle({ children, backHref }: { children: string; backHref?: string }) {
  return (
    <View style={styles.titleRow}>
      {backHref ? (
        <Pressable onPress={() => router.replace(backHref as any)} hitSlop={10} style={{ marginRight: 10 }}>
          <Icon name="angle-left" size={22} color={Palette.primary} />
        </Pressable>
      ) : null}
      <Text style={styles.h3}>{children}</Text>
    </View>
  );
}

/** `.loginContent p` – small grey paragraph, optional gold link with arrow */
export function AuthText({
  children,
  link,
  onLink,
  style,
}: {
  children?: React.ReactNode;
  link?: string;
  onLink?: () => void;
  style?: any;
}) {
  return (
    <View style={[styles.pRow, style]}>
      <Text style={styles.p}>
        {children}
        {link ? ' ' : ''}
      </Text>
      {link ? (
        <Pressable onPress={onLink} style={styles.linkRow} hitSlop={6}>
          <Text style={styles.link}>{link}</Text>
          <Icon name="arrow-right-long" size={12} color={Palette.secondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** `.accounts.signUp` divider + `.social-icon` Apple / Facebook / Google */
export function SocialLogin() {
  return (
    <View>
      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.orLine} />
      </View>
      <View style={styles.socialRow}>
        {[
          { label: 'Apple', img: require('@/assets/images/apple.png') },
          { label: 'Facebook', img: require('@/assets/images/facebook.png') },
          { label: 'Google', img: require('@/assets/images/google.png') },
        ].map((s) => (
          <Pressable key={s.label} style={({ hovered }: any) => [styles.social, hovered && styles.socialHover]}>
            <Image source={s.img} style={styles.socialImg} resizeMode="contain" />
            <Text style={styles.socialText}>{s.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export const authStyles = StyleSheet.create({
  gold: { color: Palette.secondary, fontWeight: FontWeights.medium },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.backgroundPage },
  header: { backgroundColor: LOGO_BG },
  navContainer: {
    width: '100%',
    maxWidth: 1320,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { width: 230, height: 68 },
  backPage: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: Palette.secondary, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  loginMain: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['4xl'],
  },
  loginContent: {
    width: '100%',
    maxWidth: 660,
    backgroundColor: Palette.white,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Palette.loginBack,
    paddingHorizontal: Spacing['3xl'],
    paddingTop: 36,
    paddingBottom: 50,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  h3: { color: Palette.primary, fontSize: FontSizes['3xl'], fontWeight: FontWeights.medium, flexShrink: 1 },
  pRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: Spacing.xl },
  p: { color: Palette.textSecondary, fontSize: FontSizes.xs, lineHeight: 22, fontWeight: FontWeights.medium },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  link: { color: Palette.secondary, fontSize: FontSizes.xs, lineHeight: 22, fontWeight: FontWeights.medium },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: Spacing['2xl'], marginBottom: Spacing.xl },
  orLine: { flex: 1, height: 1, backgroundColor: Palette.divider },
  orText: { color: Palette.textSecondary, fontSize: FontSizes.sm },
  socialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  social: {
    flexGrow: 1,
    flexBasis: 150,
    height: 48,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.white,
  },
  socialHover: { backgroundColor: Palette.surfaceIce },
  socialImg: { width: 22, height: 22 },
  socialText: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
});
