import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@/constants/theme';

/**
 * The button classes that appear in the reference templates.
 *  - customBtn   : dark/teal filled (admin "Add New Brands", header Login/Register)
 *  - customBtn2  : teal filled 8px radius (admin modals Yes/No/Add, tab pills)
 *  - customBtn3  : teal pill, full width (user web auth)
 *  - customBtn4  : white pill with gold border (user web Back)
 *  - success     : dealer `btn btn-success` (gold, full width)
 *  - dark        : dealer `btn btn-dark` (teal-black, full width)
 *  - outline     : neutral outline
 */
export type BtnVariant =
  | 'customBtn'
  | 'customBtn2'
  | 'customBtn3'
  | 'customBtn4'
  | 'success'
  | 'dark'
  | 'outline';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: BtnVariant;
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  left?: React.ReactNode;
  right?: React.ReactNode;
  small?: boolean;
};

export default function Btn({
  title,
  onPress,
  variant = 'customBtn2',
  active,
  loading,
  disabled,
  style,
  textStyle,
  left,
  right,
  small,
}: Props) {
  const v = variantStyles[variant];
  const isOutlineTab = variant === 'customBtn2' && active === false;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed, hovered }: any) => [
        styles.base,
        v.box,
        small && styles.small,
        isOutlineTab && styles.tabInactive,
        (pressed || hovered) && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutlineTab ? Palette.primary : v.text.color} size="small" />
      ) : (
        <View style={styles.row}>
          {left}
          <Text
            style={[
              styles.text,
              v.text,
              small && styles.smallText,
              isOutlineTab && styles.tabInactiveText,
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {right}
        </View>
      )}
    </Pressable>
  );
}

const variantStyles: Record<BtnVariant, { box: ViewStyle; text: TextStyle & { color: string } }> = {
  customBtn: {
    box: { backgroundColor: Palette.primary, borderRadius: Radius.md, height: 44 },
    text: { color: Palette.white },
  },
  customBtn2: {
    box: { backgroundColor: Palette.primary, borderRadius: Radius.md, height: 42, paddingHorizontal: 28 },
    text: { color: Palette.white },
  },
  customBtn3: {
    box: { backgroundColor: Palette.primary, borderRadius: Radius.pill, height: 48, width: '100%' },
    text: { color: Palette.white, fontSize: FontSizes.lg },
  },
  customBtn4: {
    box: {
      backgroundColor: Palette.white,
      borderRadius: Radius.pill,
      height: 48,
      borderWidth: 1,
      borderColor: Palette.secondary,
      width: '100%',
    },
    text: { color: Palette.secondary, fontSize: FontSizes.lg },
  },
  success: {
    box: { backgroundColor: Palette.secondary, borderRadius: Radius.md, height: 48 },
    text: { color: Palette.white, fontSize: FontSizes.md },
  },
  dark: {
    box: { backgroundColor: Palette.primary, borderRadius: Radius.md, height: 48 },
    text: { color: Palette.white, fontSize: FontSizes.md },
  },
  outline: {
    box: {
      backgroundColor: Palette.white,
      borderRadius: Radius.md,
      height: 42,
      borderWidth: 1,
      borderColor: Palette.borderLight,
    },
    text: { color: Palette.textBody },
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  small: {
    height: 34,
    paddingHorizontal: Spacing.md,
  },
  smallText: {
    fontSize: FontSizes.sm,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.55,
  },
  tabInactive: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.primary,
  },
  tabInactiveText: {
    color: Palette.primary,
  },
});
