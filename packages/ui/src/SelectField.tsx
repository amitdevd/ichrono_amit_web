import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@ichrono/theme';
import Icon from './Icon';

/**
 * Bootstrap `select.form-select` replacement. Opens an option sheet with an
 * optional search box (for long lists like countries).
 */
export type Option = { label: string; value: string };

type Props = {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: (Option | string)[];
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  style?: StyleProp<ViewStyle>;
  height?: number;
  compact?: boolean;
};

const norm = (o: Option | string): Option => (typeof o === 'string' ? { label: o, value: o } : o);

export default function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = 'Select',
  error,
  searchable,
  style,
  height = 46,
  compact,
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const opts = options.map(norm);
  const current = opts.find((o) => o.value === value);
  const filtered = q ? opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) : opts;

  return (
    <View style={[!compact && styles.group, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={{ color: Palette.error }}> *</Text> : null}
        </Text>
      ) : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.box, { height }, !!error && { borderColor: Palette.error }]}
      >
        <Text style={[styles.value, !current && styles.placeholder]} numberOfLines={1}>
          {current ? current.label : placeholder}
        </Text>
        <Icon name="chevron-down" size={12} color={Palette.textBody} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label || placeholder}</Text>
            {searchable ? (
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search..."
                placeholderTextColor={Palette.loginBack}
                style={[styles.search, { outlineStyle: 'none' } as any]}
              />
            ) : null}
            <FlatList
              data={filtered}
              keyExtractor={(o) => o.value}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => {
                const sel = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                      setQ('');
                    }}
                    style={({ hovered }: any) => [styles.opt, (sel || hovered) && styles.optActive]}
                  >
                    <Text style={[styles.optText, sel && styles.optTextActive]}>{item.label}</Text>
                    {sel ? <Icon name="check" size={12} color={Palette.primary} /> : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
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
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius.md,
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.md,
  },
  value: { flex: 1, color: Palette.textBody, fontSize: FontSizes.sm, marginRight: 8 },
  placeholder: { color: Palette.loginBack },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 4 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  sheetTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Palette.primary,
    marginBottom: Spacing.md,
  },
  search: {
    height: 40,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    color: Palette.textBody,
  },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  optActive: { backgroundColor: Palette.surfaceIce },
  optText: { color: Palette.textBody, fontSize: FontSizes.sm },
  optTextActive: { color: Palette.primary, fontWeight: FontWeights.semibold },
});
