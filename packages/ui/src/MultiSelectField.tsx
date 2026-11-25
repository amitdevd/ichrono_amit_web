import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@ichrono/theme';
import Icon from './Icon';
import { CheckBox } from './Controls';
import Btn from './Btn';

/**
 * `.sd-multiSelect select[multiple]` replacement: shows the picked values as
 * chips and opens a searchable checklist with Select all / Clear.
 */
type Props = {
  label?: string;
  required?: boolean;
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

export default function MultiSelectField({
  label,
  required,
  values,
  onChange,
  options,
  placeholder = 'Select',
  error,
  style,
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<string[]>(values);
  const filtered = q ? options.filter((o) => o.toLowerCase().includes(q.toLowerCase())) : options;

  const show = () => {
    setDraft(values);
    setQ('');
    setOpen(true);
  };

  return (
    <View style={[s.group, style]}>
      {label ? (
        <Text style={s.label}>
          {label}
          {required ? <Text style={{ color: Palette.error }}> *</Text> : null}
        </Text>
      ) : null}
      <Pressable onPress={show} style={[s.box, !!error && { borderColor: Palette.error }]}>
        <View style={s.chips}>
          {values.length === 0 ? <Text style={s.placeholder}>{placeholder}</Text> : null}
          {values.slice(0, 4).map((v) => (
            <View key={v} style={s.chip}>
              <Text style={s.chipText}>{v}</Text>
              <Pressable onPress={() => onChange(values.filter((x) => x !== v))} hitSlop={6}>
                <Icon name="xmark" size={10} color={Palette.primary} />
              </Pressable>
            </View>
          ))}
          {values.length > 4 ? <Text style={s.more}>+{values.length - 4} more</Text> : null}
        </View>
        <Icon name="chevron-down" size={12} color={Palette.textBody} />
      </Pressable>
      {error ? <Text style={s.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={s.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={s.sheet}>
            <Text style={s.title}>{label || placeholder}</Text>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search..."
              placeholderTextColor={Palette.loginBack}
              style={[s.search, { outlineStyle: 'none' } as any]}
            />
            <View style={s.bulk}>
              <Pressable onPress={() => setDraft(Array.from(new Set([...draft, ...filtered])))}>
                <Text style={s.bulkText}>Select all</Text>
              </Pressable>
              <Pressable onPress={() => setDraft([])}>
                <Text style={s.bulkText}>Clear</Text>
              </Pressable>
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(o) => o}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => (
                <CheckBox
                  checked={draft.includes(item)}
                  onChange={(on) => setDraft(on ? [...draft, item] : draft.filter((x) => x !== item))}
                  label={item}
                  style={s.opt}
                />
              )}
            />
            <View style={s.btns}>
              <Btn title="Cancel" variant="outline" onPress={() => setOpen(false)} />
              <Btn
                title="Done"
                onPress={() => {
                  onChange(options.filter((o) => draft.includes(o)));
                  setOpen(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: Spacing.lg },
  label: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: 6 },
  box: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius.md,
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 8,
  },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  placeholder: { color: Palette.loginBack, fontSize: FontSizes.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.surfaceIce,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: { color: Palette.primary, fontSize: FontSizes.xs, fontWeight: FontWeights.medium },
  more: { color: Palette.textSecondary, fontSize: FontSizes.xs },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  sheet: { width: '100%', maxWidth: 420, backgroundColor: Palette.white, borderRadius: Radius.lg, padding: Spacing.lg },
  title: { fontSize: FontSizes.lg, fontWeight: FontWeights.semibold, color: Palette.primary, marginBottom: Spacing.md },
  search: {
    height: 40,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    color: Palette.textBody,
  },
  bulk: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  bulkText: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  opt: { paddingVertical: 9, paddingHorizontal: 4 },
  btns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: Spacing.md },
});
