import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontWeights } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';

/** `.owl-carousel.customOwlcarousel` hero from user/Homepage/index.blade.php */
const SLIDES = [0, 1, 2, 3].map((i) => ({ id: i, image: require('@/assets/images/banner.png') }));

export default function BannerCarousel() {
  const { width, isMobile, lgUp } = useBreakpoint();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const fontSize = lgUp ? Math.min(48, width / 30) : isMobile ? 18 : 28;

  return (
    <View>
      <View style={styles.slide}>
        <Image source={SLIDES[index].image} style={styles.img} resizeMode="cover" />
        <View style={[styles.content, isMobile && styles.contentMobile]}>
          <Text style={[styles.h1, { fontSize, lineHeight: fontSize * 1.25 }]}>
            Discover your <Text style={styles.span}>perfect timepiece</Text> on the premier marketplace for{' '}
            <Text style={styles.span}>luxury watches</Text>
          </Text>
        </View>
      </View>
      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <Pressable
            key={s.id}
            onPress={() => setIndex(i)}
            style={[styles.dot, i === index && styles.dotActive]}
            accessibilityLabel={`Slide ${i + 1}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { width: '100%', aspectRatio: 1920 / 787, overflow: 'hidden', backgroundColor: '#EEF1F2' },
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
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D6D6D6' },
  dotActive: { backgroundColor: Palette.secondary, width: 24 },
});
