import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { LOGO, LOGO_BG } from '@/constants/brand';
import { withAlpha } from '@ichrono/theme';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useGuestGuard } from '@/hooks/use-guest-guard';
import { useBreakpoint, Icon } from '@ichrono/ui';

/**
 * User web top navigation – backend_ref/views/user/layout/header.blade.php
 * Row 1: logo + Login/Register (guest) or bell + "Hello! name" (signed in)
 * Row 2: search box + menu links (collapses behind the toggler below 992px)
 */
export const NAV_LINKS = ['Buy a watch', 'Sell A watch', 'Categories', 'Watchcollection', 'Andy Dev Plus', 'FAQ', 'Info'];

export default function WebHeader() {
  const { lgUp, isMobile } = useBreakpoint();
  const { isLoggedIn, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(NAV_LINKS[0]);
  const [q, setQ] = useState('');
  const { requireLogin } = useGuestGuard();

  const showMenu = lgUp || open;

  return (
    <View style={styles.header}>
      <View style={[styles.container, styles.row1]}>
        <Pressable onPress={() => router.push('/home' as any)}>
          <Image source={LOGO} style={[styles.logo, isMobile && { width: 110, height: 46 }]} resizeMode="contain" />
        </Pressable>
        <View style={styles.rightRow}>
          {!lgUp ? (
            <Pressable onPress={() => setOpen((o) => !o)} style={styles.toggler} accessibilityLabel="Toggle navigation">
              <Icon name="bars" size={20} color={Palette.white} />
            </Pressable>
          ) : null}
          {!isLoggedIn ? (
            <Pressable
              onPress={() => router.push('/(auth)/login' as any)}
              style={({ hovered }: any) => [styles.loginBtn, hovered && { opacity: 0.9 }]}
            >
              <Image source={require('@/assets/images/login-user.png')} style={styles.loginIcon} />
              {!isMobile ? <Text style={styles.loginText}>Login/Register</Text> : null}
            </Pressable>
          ) : (
            <View style={styles.userRow}>
              <Pressable accessibilityLabel="Notifications">
                <Image source={require('@/assets/images/bell.webp')} style={styles.bell} />
              </Pressable>
              <Pressable style={styles.loginUser} onPress={() => router.push('/profile' as any)}>
                <Image source={require('@/assets/images/user.webp')} style={styles.userImg} />
                {!isMobile ? <Text style={styles.hello}>Hello! {user?.name ?? 'User'}</Text> : null}
                <Image source={require('@/assets/images/downArrow.webp')} style={styles.arrowDown} resizeMode="contain" />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {showMenu ? (
        <View style={[styles.container, styles.row2, !lgUp && styles.row2Stack]}>
          <View style={[styles.search, !lgUp && { width: '100%' }]}>
            <TextInput
              value={q}
              onChangeText={setQ}
              onSubmitEditing={requireLogin()}
              placeholder="Search Watch..."
              placeholderTextColor={Palette.textOnPrimaryMuted}
              style={[styles.searchInput, { outlineStyle: 'none' } as any]}
            />
            <Icon name="magnifying-glass" size={15} color={Palette.secondary} />
          </View>
          <View style={[styles.links, !lgUp && styles.linksStack]}>
            {NAV_LINKS.map((l) => (
              <Pressable
                key={l}
                onPress={requireLogin(() => {
                  setActive(l);
                  if (l === 'Sell A watch') router.push('/profile' as any);
                })}
                style={styles.navLink}
              >
                {({ hovered }: any) => (
                  <Text style={[styles.navText, (active === l || hovered) && styles.navActive]}>{l}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: LOGO_BG, zIndex: 5 },
  container: { width: '100%', maxWidth: 1320, alignSelf: 'center', paddingHorizontal: Spacing.lg },
  row1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  logo: { width: 150, height: 62 },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggler: {
    width: 42,
    height: 38,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.secondary,
    borderRadius: Radius.md,
    height: 42,
    paddingHorizontal: Spacing.lg,
  },
  loginIcon: { width: 20, height: 20 },
  loginText: { color: Palette.white, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  bell: { width: 26, height: 26 },
  loginUser: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userImg: { width: 40, height: 40, borderRadius: 20 },
  hello: { color: Palette.white, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  arrowDown: { width: 12, height: 8 },
  row2: { flexDirection: 'row', alignItems: 'center', paddingBottom: 14, gap: Spacing.xl },
  row2Stack: { flexDirection: 'column', alignItems: 'stretch', gap: Spacing.md },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 340,
    height: 42,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: withAlpha(Palette.fourth, 0.6),
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: Spacing.lg,
  },
  searchInput: { flex: 1, height: '100%', color: Palette.white, fontSize: FontSizes.sm },
  links: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap' },
  linksStack: { flexDirection: 'column', justifyContent: 'flex-start' },
  navLink: { paddingVertical: 8, paddingHorizontal: 12 },
  navText: { color: Palette.white, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  navActive: { color: Palette.fourth },
});
