import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@/constants/theme';

/**
 * `<input type="date" class="form-control">`. On web this renders the real
 * browser date picker; on native it falls back to a text input (YYYY-MM-DD).
 */
type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  style?: StyleProp<ViewStyle>;
};

export default function DateField({ label, value, onChange, style }: Props) {
  return (
    <View style={[styles.group, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {Platform.OS === 'web' ? (
        React.createElement('input', {
          type: 'date',
          value,
          onChange: (e: any) => onChange(e.target.value),
          style: {
            height: 46,
            borderRadius: Radius.md,
            border: `1px solid ${Palette.loginBack}`,
            padding: '0 12px',
            fontSize: FontSizes.sm,
            color: Palette.textBody,
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            backgroundColor: Palette.white,
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          },
        })
      ) : (
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Palette.loginBack}
          style={styles.native}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: Spacing.lg },
  label: {
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: 6,
  },
  native: {
    height: 46,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    color: Palette.textBody,
  },
});
