import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, type StyleProp, type TextStyle } from 'react-native';
import { useHydrated } from './hooks/useBreakpoint';
import { Palette } from '@ichrono/theme';

/**
 * Thin wrapper so screens can use the same Font Awesome 6 icon names the
 * Blade templates use (fa-solid fa-gauge → "gauge").
 * `set="ion"` switches to Ionicons for the Bootstrap-Icons equivalents
 * (bi-eye-fill → "eye", bi-pencil-square → "create-outline" …).
 */
type Props = {
  name: string;
  size?: number;
  color?: string;
  set?: 'fa' | 'ion';
  solid?: boolean;
  style?: StyleProp<TextStyle>;
};

export default function Icon({ name, size = 16, color = Palette.primary, set = 'fa', solid = true, style }: Props) {
  // Icon fonts are not available while the web build is pre-rendered, so render
  // an empty box of the same size until hydration has finished.
  const ready = useHydrated();
  if (!ready) return <View style={{ width: size, height: size }} />;
  if (set === 'ion') {
    return <Ionicons name={name as any} size={size} color={color} style={style} />;
  }
  return (
    <FontAwesome6
      name={name as any}
      size={size}
      color={color}
      solid={solid}
      style={style}
    />
  );
}
