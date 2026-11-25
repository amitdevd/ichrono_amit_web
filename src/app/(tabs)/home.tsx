import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import WebHeader from '@/components/user/WebHeader';
import WebFooter from '@/components/user/WebFooter';
import BannerCarousel from '@/components/user/BannerCarousel';
import WatchCard from '@/components/user/WatchCard';
import { useGuestGuard } from '@/hooks/use-guest-guard';
import { useListings } from '@/context/listings';
import { useSiteContent } from '@/context/site-content';
import { forSale, listingToWatch } from '@/data';
import { useBreakpoint, Icon } from '@ichrono/ui';

/**
 * User Web home page – backend_ref/views/user/Homepage/index.blade.php
 * Milestone 4: the sections are live –
 *  - banner carousel  ← admin → Banners (running today)
 *  - Recommended For You ← approved listings on sale (users' private sales carry the badge)
 *  - Popular Brands ← active brands from admin → Brands; "Display All Brands" shows them all
 */
const RECOMMENDED_COUNT = 8; //  two rows of four, as in the reference
const BRANDS_SHOWN = 10; //      two rows of five, as in the reference

export default function HomeScreen() {
  const { isXL, lgUp, mdUp, isMobile } = useBreakpoint();
  const { requireLogin } = useGuestGuard();
  // col-xl-3 col-lg-4 col-md-4 col-12
  const cols = isXL ? 4 : mdUp ? 3 : isMobile ? 1 : 2;
  const cardBasis = `${(100 - (cols - 1) * 2) / cols}%` as const;
  const brandBasis = lgUp ? '18%' : mdUp ? '30%' : '46%';
  const { listings } = useListings();
  const { brands } = useSiteContent();
  const [allBrands, setAllBrands] = useState(false);

  const recommended = useMemo(() => forSale(listings).slice(0, RECOMMENDED_COUNT).map(listingToWatch), [listings]);
  const activeBrands = brands.filter((b) => b.active);
  const shownBrands = allBrands ? activeBrands : activeBrands.slice(0, BRANDS_SHOWN);

  return (
    <ScrollView style={styles.screen} stickyHeaderIndices={[0]}>
      <WebHeader />

      <BannerCarousel />

      {/* section.recommend */}
      <View style={[styles.container, styles.section]}>
        <Text style={styles.h3}>Recommended For You</Text>
        <View style={styles.grid}>
          {recommended.map((w) => (
            <WatchCard key={w.id} watch={w} guard={requireLogin} style={{ flexBasis: cardBasis, flexGrow: cols === 1 ? 1 : 0 }} />
          ))}
        </View>
      </View>

      {/* .brands */}
      <View style={styles.brands}>
        <View style={styles.container}>
          <Text style={styles.h3}>Popular Brands</Text>
          <View style={styles.brandGrid}>
            {shownBrands.map((b) => (
              <Pressable
                key={b.id}
                onPress={requireLogin()}
                style={({ hovered }: any) => [styles.brand, { flexBasis: brandBasis }, hovered && styles.brandHover]}
              >
                {({ hovered }: any) => <Text style={[styles.h4, hovered && { color: Palette.white }]}>{b.name}</Text>}
              </Pressable>
            ))}
          </View>
          {!allBrands && activeBrands.length > BRANDS_SHOWN ? (
            <View style={{ alignItems: 'center', marginTop: Spacing['2xl'] }}>
              <Pressable
                onPress={requireLogin(() => setAllBrands(true))}
                style={({ hovered }: any) => [styles.allBrands, hovered && { opacity: 0.9 }]}
              >
                <Text style={styles.allBrandsText}>Display All Brands</Text>
                <Icon name="arrow-right-long" size={16} color={Palette.white} />
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>

      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.white },
  container: { width: '100%', maxWidth: 1320, alignSelf: 'center', paddingHorizontal: Spacing.lg },
  section: { paddingVertical: Spacing['4xl'] },
  h3: { color: Palette.primary, fontSize: FontSizes['3xl'], fontWeight: FontWeights.semibold, marginBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: '2%' as any, rowGap: Spacing['2xl'] },
  brands: { backgroundColor: Palette.surfaceIce, paddingVertical: Spacing['4xl'] },
  brandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.lg, justifyContent: 'center' },
  brand: {
    flexGrow: 1,
    height: 90,
    backgroundColor: Palette.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  brandHover: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  h4: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold, textAlign: 'center' },
  allBrands: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.primary,
    borderRadius: Radius.md,
    height: 46,
    paddingHorizontal: 28,
  },
  allBrandsText: { color: Palette.white, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
});
