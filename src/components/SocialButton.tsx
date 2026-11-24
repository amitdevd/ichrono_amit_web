import React, { useRef, useCallback } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Palette,
  Spacing,
  Radius,
  FontSizes,
  FontWeights,
  Durations,
} from '@/constants/theme';

export type SocialProvider = 'apple' | 'facebook' | 'google';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
}

const PROVIDER_CONFIG: Record<
  SocialProvider,
  { label: string; imageSource: any }
> = {
  apple: {
    label: 'Apple',
    imageSource: require('@/assets/images/apple.png'),
  },
  facebook: {
    label: 'Facebook',
    imageSource: require('@/assets/images/facebook.png'),
  },
  google: {
    label: 'Google',
    imageSource: require('@/assets/images/google.png'),
  },
};

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const config = PROVIDER_CONFIG[provider];

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
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

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
      >
        <Image
          source={config.imageSource}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.label}>{config.label}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const SocialButtonGroup: React.FC<{
  onSelect?: (provider: SocialProvider) => void;
}> = ({ onSelect }) => {
  return (
    <View style={styles.groupContainer}>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.buttonsRow}>
        <SocialButton provider="apple" onPress={() => onSelect?.('apple')} />
        <SocialButton provider="facebook" onPress={() => onSelect?.('facebook')} />
        <SocialButton provider="google" onPress={() => onSelect?.('google')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    marginTop: Spacing.xl,
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.borderLight,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.xs,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.sm,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: Spacing.xs,
  },
  label: {
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});

export default SocialButton;
