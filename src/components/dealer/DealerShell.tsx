import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuth } from '@/context/auth-context';
import Icon from '@/components/common/Icon';

/**
 * Dealer panel chrome – backend_ref/views/dealer/layouts/adminHeader.blade.php
 * (fixed `#header` with logo + toggle, bell and profile dropdown; `#sidebar`
 * with Dashboard / Listings / Logout and `.tabActive` state).
 */
const MENU = [
  { label: 'Dashboard', icon: 'table-columns', href: '/dealer/dashboard' },
  { label: 'Listings', icon: 'list', href: '/dealer/listings' },
] as const;

const SIDEBAR_W = 270;
const HEADER_H = 70;

export default function DealerShell({ children }: { children: React.ReactNode }) {
  const { lgUp, isMobile } = useBreakpoint();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setDrawer(false);
    setMenu(false);
  }, [pathname]);

  const name = user?.role === 'dealer' ? user.name : 'K. Anderson';
  const signOut = () => logout('/dealer/login');

  const nav = (
    <View style={{ paddingVertical: Spacing.xl, paddingHorizontal: Spacing.lg, gap: 6 }}>
      {MENU.map((m) => {
        const active = pathname.startsWith(m.href);
        return (
          <Pressable
            key={m.href}
            onPress={() => router.push(m.href as any)}
            style={({ hovered }: any) => [styles.link, active && styles.tabActive, !active && hovered && styles.linkHover]}
          >
            <Icon name={m.icon} size={16} color={active ? Palette.white : Palette.primary} />
            <Text style={[styles.linkText, active && { color: Palette.white }]}>{m.label}</Text>
          </Pressable>
        );
      })}
      <Pressable onPress={signOut} style={({ hovered }: any) => [styles.link, hovered && styles.linkHover]}>
        <Icon name="right-from-bracket" size={16} color={Palette.primary} />
        <Text style={styles.linkText}>Logout</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={[styles.logoWrap, lgUp && { width: SIDEBAR_W - 20 }]}>
          <Image source={require('@/assets/images/Logo.png')} style={[styles.logo, isMobile && { width: 130 }]} resizeMode="contain" />
        </View>
        <Pressable
          onPress={() => (lgUp ? setCollapsed((c) => !c) : setDrawer(true))}
          style={{ padding: 8 }}
          accessibilityLabel="Toggle sidebar"
        >
          <Icon name="bars" size={22} color={Palette.primary} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.bell} accessibilityLabel="Notifications">
          <Icon name="bell" size={18} color={Palette.primary} solid={false} />
        </Pressable>
        <Pressable onPress={() => setMenu((o) => !o)} style={styles.profile}>
          <Image source={require('@/assets/images/user.webp')} style={styles.avatar} />
          {!isMobile ? <Text style={styles.profileName}>{name}</Text> : null}
          <Icon name="chevron-down" size={10} color={Palette.textSecondary} />
        </Pressable>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {lgUp && !collapsed ? <View style={styles.sidebar}>{nav}</View> : null}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.main}>
          {children}
        </ScrollView>
      </View>

      {menu ? (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenu(false)} />
          <View style={styles.dropdown}>
            <View style={styles.ddHead}>
              <Text style={styles.ddName}>{name}</Text>
              <Text style={styles.ddRole}>Professional Dealer</Text>
            </View>
            <View style={styles.ddDivider} />
            <Pressable style={({ hovered }: any) => [styles.ddItem, hovered && styles.ddHover]} onPress={() => setMenu(false)}>
              <Icon name="user" size={14} color={Palette.textBody} solid={false} />
              <Text style={styles.ddText}>My Profile</Text>
            </Pressable>
            <View style={styles.ddDivider} />
            <Pressable style={({ hovered }: any) => [styles.ddItem, hovered && styles.ddHover]} onPress={signOut}>
              <Icon name="right-from-bracket" size={14} color={Palette.textBody} />
              <Text style={styles.ddText}>Sign Out</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      <Modal visible={!lgUp && drawer} transparent animationType="fade" onRequestClose={() => setDrawer(false)}>
        <View style={styles.drawerBackdrop}>
          <View style={styles.drawer}>
            <View style={styles.drawerHead}>
              <Image source={require('@/assets/images/Logo.png')} style={{ width: 150, height: 40 }} resizeMode="contain" />
              <Pressable onPress={() => setDrawer(false)} hitSlop={10}>
                <Icon name="xmark" size={20} color={Palette.primary} />
              </Pressable>
            </View>
            {nav}
          </View>
          <Pressable style={{ flex: 1 }} onPress={() => setDrawer(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6F9FF' },
  header: {
    height: HEADER_H,
    backgroundColor: Palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    shadowColor: '#012970',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 10,
  },
  logoWrap: { marginRight: Spacing.md },
  logo: { width: 170, height: 46 },
  bell: { padding: 10, marginRight: Spacing.sm },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Palette.surfaceIce },
  profileName: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  sidebar: {
    width: SIDEBAR_W,
    backgroundColor: Palette.white,
    shadowColor: '#012970',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
  },
  linkHover: { backgroundColor: Palette.surfaceIce },
  tabActive: { backgroundColor: Palette.primary },
  linkText: { color: Palette.primary, fontSize: 15, fontWeight: FontWeights.semibold },
  main: { padding: Spacing['2xl'], paddingBottom: 60 },
  dropdown: {
    position: 'absolute',
    top: HEADER_H - 4,
    right: Spacing.lg,
    width: 220,
    backgroundColor: Palette.white,
    borderRadius: Radius.md,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 20,
  },
  ddHead: { alignItems: 'center', paddingVertical: 10 },
  ddName: { color: Palette.primary, fontWeight: FontWeights.semibold, fontSize: FontSizes.md },
  ddRole: { color: Palette.textSecondary, fontSize: FontSizes.xs, marginTop: 2 },
  ddItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 16 },
  ddHover: { backgroundColor: '#F6F9FF' },
  ddText: { color: Palette.textBody, fontSize: FontSizes.sm },
  ddDivider: { height: 1, backgroundColor: Palette.divider },
  drawerBackdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: { width: 280, backgroundColor: Palette.white },
  drawerHead: {
    height: HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
});
