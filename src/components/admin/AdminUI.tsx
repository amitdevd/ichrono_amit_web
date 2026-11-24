import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import Icon from '@/components/common/Icon';

/** `.h2` page heading used on every admin page */
export function PageTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <Text style={s.h2}>{children}</Text>
    </View>
  );
}

/** Bootstrap `.card > .card-body` */
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

/** `.table-button` / `.centerAction` icon actions in tables */
export function TableAction({
  icon,
  onPress,
  color = Palette.primary,
  label,
}: {
  icon: string;
  onPress: () => void;
  color?: string;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      hitSlop={6}
      style={({ hovered }: any) => [s.action, hovered && { backgroundColor: Palette.surfaceIce }]}
    >
      <Icon name={icon} set="ion" size={18} color={color} />
    </Pressable>
  );
}

/** Square brand / category thumbnail (`img.square` 40×40) with placeholder */
export function Thumb({ uri, label }: { uri: string | null; label: string }) {
  if (uri) return <Image source={{ uri }} style={s.thumb} />;
  return (
    <View style={[s.thumb, s.thumbEmpty]}>
      <Text style={s.thumbText}>{label.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

/** Placeholder for sidebar items scheduled in later milestones */
export function ComingSoon({ title, milestone }: { title: string; milestone: string }) {
  return (
    <View>
      <PageTitle>{title}</PageTitle>
      <Card style={{ marginTop: Spacing['2xl'], alignItems: 'center', paddingVertical: 60 }}>
        <Icon name="screwdriver-wrench" size={40} color={Palette.secondary} />
        <Text style={s.csTitle}>Scheduled for {milestone}</Text>
        <Text style={s.csText}>
          This screen is part of a later milestone in the I-Chrono plan and will be built after Milestone 1 is approved.
        </Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  h2: {
    color: Palette.primary,
    fontSize: 28,
    fontWeight: FontWeights.semibold,
  },
  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E3E6F0',
    padding: Spacing.xl,
    shadowColor: '#3A3B45',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  action: { padding: 6, borderRadius: Radius.sm },
  thumb: { width: 40, height: 40, borderRadius: Radius.xs },
  thumbEmpty: { backgroundColor: Palette.surfaceIce, alignItems: 'center', justifyContent: 'center' },
  thumbText: { color: Palette.primary, fontWeight: FontWeights.bold, fontSize: FontSizes.md },
  csTitle: { marginTop: Spacing.lg, color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  csText: { marginTop: Spacing.sm, color: Palette.textSecondary, fontSize: FontSizes.sm, textAlign: 'center', maxWidth: 420 },
});
