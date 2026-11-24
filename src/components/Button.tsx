import React, { useRef, useCallback } from 'react';
import {
  Animated,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import {
  Palette,
  Spacing,
  Radius,
  FontSizes,
  FontWeights,
  Durations,
} from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'headerGold';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: Durations.fast,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: Durations.fast,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    variant === 'primary' && styles.primaryContainer,
    variant === 'secondary' && styles.secondaryContainer,
    variant === 'gold' && styles.goldContainer,
    variant === 'headerGold' && styles.headerGoldContainer,
    variant === 'ghost' && styles.ghostContainer,
    isDisabled && styles.disabled,
    style,
  ];

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'gold':
      case 'headerGold':
        return Palette.white;
      case 'secondary':
        return Palette.secondary;
      case 'ghost':
        return Palette.primary;
      default:
        return Palette.white;
    }
  };

  const spinnerColor = getTextColor();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={containerStyle}
      >
        {loading ? (
          <ActivityIndicator color={spinnerColor} size="small" />
        ) : (
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
            {icon ? `  ` : null}
            {icon}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: Radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    flexDirection: 'row',
  },
  // .customBtn3: Teal pill button
  primaryContainer: {
    backgroundColor: Palette.primary,
  },
  // .customBtn4: Gold outline pill button
  secondaryContainer: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.secondary,
  },
  // .customBtn5: Solid gold pill button
  goldContainer: {
    backgroundColor: Palette.secondary,
  },
  // .customBtn: Header Gold button
  headerGoldContainer: {
    backgroundColor: Palette.secondary,
    height: 38,
    paddingHorizontal: Spacing.md,
  },
  ghostContainer: {
    backgroundColor: Palette.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },
});

export default Button;
