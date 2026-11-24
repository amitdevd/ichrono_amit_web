import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@/constants/theme';

/** Dealer `.type-business > input.custom-radio` button group */
export default function OptionChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: string;
  onChange: (v: T) => void;
}) {
  return (
    <View style={s.row}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={({ hovered }: any) => [s.chip, on && s.chipOn, !on && hovered && s.chipHover]}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
          >
            <Text style={[s.text, on && s.textOn]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md },
  chip: {
    flex: 1,
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  chipHover: { backgroundColor: Palette.surfaceIce },
  chipOn: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  text: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  textOn: { color: Palette.white },
});
