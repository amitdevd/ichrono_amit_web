import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Palette, Radius, FontSizes } from '@/constants/theme';
import Icon from './Icon';

/** Bootstrap `.form-check.form-switch` */
export function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={[sw.track, value ? sw.on : sw.off]}
      hitSlop={6}
    >
      <View style={[sw.knob, value ? sw.knobOn : sw.knobOff]} />
    </Pressable>
  );
}

const sw = StyleSheet.create({
  track: {
    width: 40,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  on: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  off: { backgroundColor: Palette.white, borderColor: '#B9C6CB' },
  knob: { width: 16, height: 16, borderRadius: 8 },
  knobOn: { backgroundColor: Palette.white, alignSelf: 'flex-end' },
  knobOff: { backgroundColor: '#B9C6CB', alignSelf: 'flex-start' },
});

/** Bootstrap `.form-check` checkbox */
export function CheckBox({
  checked,
  onChange,
  label,
  style,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={() => onChange(!checked)} style={[ck.row, style]}>
      <View style={[ck.box, checked && ck.boxOn]}>
        {checked ? <Icon name="check" size={11} color={Palette.white} /> : null}
      </View>
      {typeof label === 'string' ? <Text style={ck.label}>{label}</Text> : label}
    </Pressable>
  );
}

/** Bootstrap `.form-check` radio */
export function Radio({
  checked,
  onPress,
  label,
  style,
}: {
  checked: boolean;
  onPress: () => void;
  label?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={[ck.row, style]}>
      <View style={[ck.radio, checked && ck.radioOn]}>
        {checked ? <View style={ck.dot} /> : null}
      </View>
      {typeof label === 'string' ? <Text style={ck.label}>{label}</Text> : label}
    </Pressable>
  );
}

const ck = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  box: {
    width: 18,
    height: 18,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    borderColor: Palette.loginBack,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  boxOn: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Palette.loginBack,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
  },
  radioOn: { borderColor: Palette.primary },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Palette.primary },
  label: { color: Palette.textBody, fontSize: FontSizes.sm, flexShrink: 1 },
});
