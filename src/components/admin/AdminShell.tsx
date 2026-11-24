import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useAuth } from '@/context/auth-context';
import Icon from '@/components/common/Icon';

/**
 * Admin panel chrome recreated from backend_ref/views/admin/layout/aside.blade.php:
 * white top bar (logo + hamburger + profile dropdown) and the teal
 * `.customSidebar` menu. The sidebar collapses with the hamburger on desktop
 * and becomes a slide-over drawer on tablet / mobile.
 */
export const ADMIN_MENU = [
  { label: 'Dashboard', icon: 'gauge', href: '/admin/dashboard' },
  { label: 'Brands Managment', icon: 'code-branch', href: '/admin/brands-management' },
  { label: 'Watch Managment', icon: 'clock', href: '/admin/watch-management' },
  { label: 'Dealer Managment', icon: 'handshake', href: '/admin/dealer-management' },
  { label: 'Countries setting', icon: 'globe', href: '/admin/country-management-settings' },
  { label: 'Banners', icon: 'signs-post', href: '/admin/banner' },
  { label: 'Watch Setting', icon: 'stopwatch', href: '/admin/watch-setting' },
  { label: 'User Management', icon: 'users', href: '/admin/user-management' },
  { label: 'Product Management', icon: 'box', href: '/admin/product-management' },
] as const;

const SIDEBAR_W = 260;
const TOPBAR_H = 76;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { lgUp, isMobile } = useBreakpoint();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const toggle = () => (lgUp ? setCollapsed((c) => !c) : setDrawerOpen((o) => !o));
  const displayName = user?.role === 'admin' ? user.name : 'Douglas McGee';

  const sidebar = (
    <ScrollView style={styles.sidebar} contentContainerStyle={{ paddingVertical: Spacing.lg }}>
      {ADMIN_MENU.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href as any)}
            style={({ hovered }: any) => [styles.navItem, (active || hovered) && styles.navItemActive]}
          >
            <View style={styles.navIcon}>
              <Icon name={item.icon} size={16} color={active ? Palette.primary : Palette.white} />
            </View>
            <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Pressable onPress={() => router.push('/admin/dashboard' as any)} style={styles.brand}>
          <Image
            source={require('@/assets/images/Logo.png')}
            style={[styles.logo, isMobile && { width: 150 }]}
            resizeMode="contain"
          />
        </Pressable>
        <Pressable onPress={toggle} style={styles.bars} accessibilityLabel="Toggle menu">
          <Icon name="bars" size={20} color={Palette.primary} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.divider} />
        <Pressable onPress={() => setMenuOpen((o) => !o)} style={styles.profile}>
          {!isMobile ? <Text style={styles.profileName}>{displayName}</Text> : null}
          <Image source={require('@/assets/images/user.webp')} style={styles.avatar} />
          <Icon name="chevron-down" size={10} color={Palette.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.body}>
        {lgUp && !collapsed ? <View style={{ width: SIDEBAR_W }}>{sidebar}</View> : null}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {children}
        </ScrollView>
      </View>

      {/* Profile dropdown */}
      {menuOpen ? (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={styles.dropdown}>
            <Pressable
              style={({ hovered }: any) => [styles.ddItem, hovered && styles.ddHover]}
              onPress={() => setMenuOpen(false)}
            >
              <Icon name="gears" size={13} color="#B7B9CC" />
              <Text style={styles.ddText}>Settings</Text>
            </Pressable>
            <View style={styles.ddDivider} />
            <Pressable
              style={({ hovered }: any) => [styles.ddItem, hovered && styles.ddHover]}
              onPress={() => logout('/admin/login')}
            >
              <Icon name="right-from-bracket" size={13} color="#B7B9CC" />
              <Text style={styles.ddText}>Logout</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {/* Drawer for tablet/mobile */}
      <Modal visible={!lgUp && drawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
        <View style={styles.drawerBackdrop}>
          <View style={styles.drawer}>
            <View style={styles.drawerHead}>
              <Image source={require('@/assets/images/Logo.png')} style={{ width: 160, height: 40 }} resizeMode="contain" />
              <Pressable onPress={() => setDrawerOpen(false)} hitSlop={10}>
                <Icon name="xmark" size={20} color={Palette.white} />
              </Pressable>
            </View>
            {sidebar}
          </View>
          <Pressable style={{ flex: 1 }} onPress={() => setDrawerOpen(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.backgroundPage },
  topbar: {
    height: TOPBAR_H,
    backgroundColor: Palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.xl,
    shadowColor: '#3A3B45',
    shadowOpacity: 0.15,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 10,
  },
  brand: { width: SIDEBAR_W, alignItems: 'center', justifyContent: 'center', height: '100%' },
  logo: { width: 200, height: 52 },
  bars: { marginLeft: Spacing.lg, padding: Spacing.sm },
  divider: { width: 1, height: 40, backgroundColor: '#E3E6F0', marginHorizontal: Spacing.lg },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileName: { color: '#858796', fontSize: FontSizes.sm },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Palette.surfaceIce },
  body: { flex: 1, flexDirection: 'row' },
  sidebar: { flex: 1, backgroundColor: Palette.primary },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginVertical: 3,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  navItemActive: { backgroundColor: Palette.white },
  navIcon: { width: 26 },
  navText: { color: Palette.white, fontSize: 15, fontWeight: FontWeights.medium },
  navTextActive: { color: Palette.primary },
  content: { flex: 1 },
  contentInner: { padding: Spacing['2xl'], paddingBottom: 60 },
  dropdown: {
    position: 'absolute',
    top: TOPBAR_H - 6,
    right: Spacing.xl,
    width: 190,
    backgroundColor: Palette.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E3E6F0',
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 20,
  },
  ddItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 16 },
  ddHover: { backgroundColor: '#F8F9FC' },
  ddText: { color: '#3A3B45', fontSize: FontSizes.sm },
  ddDivider: { height: 1, backgroundColor: '#E3E6F0', marginVertical: 4 },
  drawerBackdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: { width: 280, backgroundColor: Palette.primary },
  drawerHead: {
    height: TOPBAR_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
});
