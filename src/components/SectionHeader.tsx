import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Palette,
  Spacing,
  FontSizes,
  FontWeights,
} from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {actionText && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionText} →</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xxs,
  },
  title: {
    color: Palette.primary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.2,
  },
  action: {
    color: Palette.secondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    letterSpacing: 0.3,
  },
});

export default SectionHeader;
