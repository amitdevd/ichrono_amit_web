import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import type { Watch } from '@/data';
import { Icon } from '@ichrono/ui';

/** `.recommend-main-content` card from user/Homepage/index.blade.php */
export default function WatchCard({
  watch,
  style,
  onPress,
  guard = (fn) => fn ?? (() => {}),
}: {
  watch: Watch;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  /** guest-mode wrapper: returns a handler that sends guests to login */
  guard?: (fn?: () => void) => () => void;
}) {
  const [fav, setFav] = useState(false);
  return (
    <Pressable onPress={guard(onPress)} style={({ hovered }: any) => [styles.card, hovered && styles.hover, style]}>
      {watch.privateSeller ? (
        <View style={styles.privateSeller}>
          <Image source={require('@/assets/images/private-seller.png')} style={{ width: 16, height: 17 }} />
          <Text style={styles.psText}>Private Seller</Text>
        </View>
      ) : null}
      <View style={styles.imgWrap}>
        <Image source={watch.image} style={styles.img} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <View style={styles.between}>
          <Text style={styles.h6} numberOfLines={1}>
            {watch.name}
          </Text>
          <Pressable onPress={guard(() => setFav((f) => !f))} hitSlop={8} accessibilityLabel="Add to wishlist">
            <Icon name="heart" size={17} color={fav ? Palette.error : Palette.primary} solid={fav} />
          </Pressable>
        </View>
        <Text style={styles.ref}>{watch.ref}</Text>
        <View style={[styles.between, { marginTop: 10, marginBottom: 8 }]}>
          <View style={styles.tags}>
            <Text style={styles.tag}>{watch.condition}</Text>
            <Text style={styles.tag}>{watch.quality}</Text>
          </View>
          <View style={styles.country}>
            {watch.country === 'IN' ? (
              <Image source={require('@/assets/images/flag.png')} style={{ width: 24, height: 16 }} />
            ) : (
              // only the India flag image exists in the project; other countries show a globe
              <Icon name="earth-americas" size={14} color={Palette.textSecondary} />
            )}
            <Text style={styles.countryText}>{watch.country}</Text>
          </View>
        </View>
        <Text style={styles.amount}>
          {watch.price} <Text style={styles.shipping}>{watch.shipping}</Text>
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    overflow: 'hidden',
  },
  hover: {
    shadowColor: Palette.primary,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  privateSeller: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.white,
    borderRadius: Radius.pill,
    shadowColor: Palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  psText: { color: Palette.primary, fontSize: FontSizes.xs, fontWeight: FontWeights.medium },
  imgWrap: { height: 210, backgroundColor: Palette.surfaceSubtle, alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%' },
  content: { padding: Spacing.lg },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  h6: { flex: 1, color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  ref: { color: Palette.textSecondary, fontSize: FontSizes.sm, marginTop: 2 },
  tags: { flexDirection: 'row', gap: 6 },
  tag: {
    color: Palette.textBody,
    fontSize: FontSizes.xs,
    backgroundColor: Palette.surfaceIce,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  country: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  countryText: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  amount: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  shipping: { color: Palette.secondary, fontSize: FontSizes.xs, fontWeight: FontWeights.medium },
});
