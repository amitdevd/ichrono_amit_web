import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontWeights } from '@/constants/theme';
import { useSiteContent, liveBanners } from '@/context/site-content';
import { useBreakpoint, useHydrated } from '@ichrono/ui';

/**
 * `.owl-carousel.customOwlcarousel` hero from user/Homepage/index.blade.php.
 * Slides are the banners managed in admin → Banners (active and running today);
 * a banner without its own image uses the reference banner.png. If no banner is
 * running, the reference banner is shown.
 */
const DEFAULT_IMAGE = require('@/assets/images/banner.png');

export default function BannerCarousel() {
  const { width, isMobile, lgUp } = useBreakpoint();
  const { banners } = useSiteContent();
  // the date check needs the visitor's clock, so it runs after hydration
  const hydrated = useHydrated();
  const live = hydrated ? liveBanners(banners) : [];
  const SLIDES = live.length
    ? live.map((b) => ({ id: b.id, title: b.title, image: b.image ? { uri: b.image } : DEFAULT_IMAGE }))
    : [{ id: 0, title: '', image: DEFAULT_IMAGE }];
  const [index, setIndex] = useState(0);
  const count = SLIDES.length;
  const current = index % count;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count]);

  const fontSize = lgUp ? Math.min(48, width / 30) : isMobile ? 18 : 28;

  return (
    <View>
      <View style={styles.slide}>
        <Image source={SLIDES[current].image} style={styles.img} resizeMode="cover" accessibilityLabel={SLIDES[current].title || 'Banner'} />
        <View style={[styles.content, isMobile && styles.contentMobile]}>
          <Text style={[styles.h1, { fontSize, lineHeight: fontSize * 1.25 }]}>
            Discover your <Text style={styles.span}>perfect timepiece</Text> on the premier marketplace for{' '}
            <Text style={styles.span}>luxury watches</Text>
          </Text>
        </View>
      </View>
      <View style={styles.dots}>
        {count > 1
          ? SLIDES.map((s, i) => (
              <Pressable
                key={s.id}
                onPress={() => setIndex(i)}
                style={[styles.dot, i === current && styles.dotActive]}
                accessibilityLabel={`Slide ${i + 1}`}
              />
            ))
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { width: '100%', aspectRatio: 1920 / 787, overflow: 'hidden', backgroundColor: Palette.surfaceMuted },
  img: { width: '100%', height: '100%' },
  content: { position: 'absolute', left: '17%', top: 0, bottom: 0, width: '45%', justifyContent: 'center' },
  contentMobile: {
    left: '4%',
    width: '64%',
    top: '12%',
    bottom: '12%',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.78)',
  },
  h1: { color: Palette.primary, fontWeight: FontWeights.medium },
  span: { color: Palette.secondary, fontWeight: FontWeights.bold },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: Spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Palette.neutralDot },
  dotActive: { backgroundColor: Palette.secondary, width: 24 },
});
