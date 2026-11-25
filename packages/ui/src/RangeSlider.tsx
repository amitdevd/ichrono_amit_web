import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette, Radius, FontSizes } from '@ichrono/theme';

/**
 * `<input type="range">` – the real browser slider on web, +/- steppers on native.
 */
type Props = { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; disabled?: boolean };

export default function RangeSlider({ value, onChange, min = 0, max = 100, step = 1, disabled }: Props) {
  if (Platform.OS === 'web') {
    const pct = ((value - min) / (max - min)) * 100;
    return React.createElement('input', {
      type: 'range',
      min,
      max,
      step,
      value,
      disabled,
      onChange: (e: any) => onChange(Number(e.target.value)),
      style: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        appearance: 'none',
        WebkitAppearance: 'none',
        background: `linear-gradient(to right, ${Palette.secondary} ${pct}%, #DCE4E7 ${pct}%)`,
        accentColor: Palette.secondary,
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      },
    });
  }
  return (
    <View style={s.row}>
      <Pressable disabled={disabled} onPress={() => onChange(Math.max(min, value - step * 5))} style={s.btn}>
        <Text style={s.btnText}>−</Text>
      </Pressable>
      <View style={s.track}>
        <View style={[s.fill, { width: `${((value - min) / (max - min)) * 100}%` }]} />
      </View>
      <Pressable disabled={disabled} onPress={() => onChange(Math.min(max, value + step * 5))} style={s.btn}>
        <Text style={s.btnText}>+</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btn: { width: 30, height: 30, borderRadius: 15, backgroundColor: Palette.surfaceIce, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: Palette.primary, fontSize: FontSizes.lg },
  track: { flex: 1, height: 6, borderRadius: Radius.xs, backgroundColor: Palette.borderSoft, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Palette.secondary },
});
