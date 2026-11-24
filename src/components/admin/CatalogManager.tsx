import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { Card, PageTitle, TableAction, Thumb } from './AdminUI';
import Btn from '@/components/common/Btn';
import AppModal from '@/components/common/AppModal';
import Field from '@/components/common/Field';
import { ToggleSwitch } from '@/components/common/Controls';
import { AvatarUpload } from '@/components/common/ImageUpload';
import DataTable, { type Column } from '@/components/common/DataTable';
import Icon from '@/components/common/Icon';

/**
 * Shared screen for "Brands Management" (admin/brand/index.blade.php) and
 * "Watch category Management" (admin/watch/index.blade.php): both have the
 * same table (SR No / Image / Name / Action), Add + Edit modals with an
 * avatar image upload, a Confirm Delete modal and an active switch.
 */
export type CatalogItem = { id: number; name: string; image: string | null; active: boolean };

type Props = {
  title: string;
  addLabel: string; // "Add New Brands"
  nameColumn: string; // "Brand name"
  noun: string; // "Brand" | "category"
  addModalTitle: string;
  editModalTitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  initial: CatalogItem[];
};

export default function CatalogManager(p: Props) {
  const { mdUp } = useBreakpoint();
  const [items, setItems] = useState<CatalogItem[]>(p.initial);
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete'>(null);
  const [current, setCurrent] = useState<CatalogItem | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});

  const open = (m: 'add' | 'edit' | 'delete', item?: CatalogItem) => {
    setCurrent(item ?? null);
    setName(item?.name ?? '');
    setImage(item?.image ?? null);
    setErrors({});
    setModal(m);
  };
  const close = () => setModal(null);

  const save = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = `The ${p.noun.toLowerCase()} name field is required.`;
    if (modal === 'add' && !image) e.image = 'The image field is required.';
    if (Object.keys(e).length) return setErrors(e);
    if (modal === 'add') {
      const id = Math.max(0, ...items.map((i) => i.id)) + 1;
      setItems([{ id, name: name.trim(), image, active: true }, ...items]);
    } else if (current) {
      setItems(items.map((i) => (i.id === current.id ? { ...i, name: name.trim(), image } : i)));
    }
    close();
  };

  const columns: Column<CatalogItem>[] = [
    { key: 'sr', title: 'SR No.', width: 90, render: (_r, i) => <Text style={styles.td}>{i + 1}</Text> },
    { key: 'image', title: 'Image', width: 110, render: (r) => <Thumb uri={r.image} label={r.name} /> },
    { key: 'name', title: p.nameColumn, width: 260 },
    {
      key: 'action',
      title: 'Action',
      width: 180,
      align: 'center',
      render: (r) => (
        <View style={styles.actions}>
          <TableAction icon="create-outline" label="Edit" onPress={() => open('edit', r)} />
          <TableAction icon="trash" label="Delete" onPress={() => open('delete', r)} />
          <ToggleSwitch
            value={r.active}
            onChange={(v) => setItems(items.map((i) => (i.id === r.id ? { ...i, active: v } : i)))}
          />
        </View>
      ),
    },
  ];

  return (
    <View>
      <PageTitle>{p.title}</PageTitle>
      <Card style={{ marginTop: Spacing['2xl'] }}>
        <View style={styles.topRow}>
          <Btn
            title={p.addLabel}
            variant="customBtn"
            onPress={() => open('add')}
            style={{ width: mdUp ? 260 : '100%' }}
          />
        </View>
        <View style={{ marginTop: Spacing['2xl'] }}>
          <DataTable columns={columns} data={items} keyExtractor={(r) => String(r.id)} />
        </View>
      </Card>

      {/* Add / Edit */}
      <AppModal
        visible={modal === 'add' || modal === 'edit'}
        onClose={close}
        title={modal === 'add' ? p.addModalTitle : p.editModalTitle}
      >
        <Field
          label={p.inputLabel}
          placeholder={p.inputPlaceholder}
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
          autoCapitalize="words"
        />
        <Text style={styles.label}>Upload images</Text>
        <AvatarUpload
          uri={image}
          onChange={(u) => {
            setImage(u);
            if (errors.image) setErrors({ ...errors, image: undefined });
          }}
        />
        {errors.image ? <Text style={styles.errorCenter}>{errors.image}</Text> : null}
        <View style={styles.modalBtns}>
          <Btn title="Cancel" onPress={close} />
          <Btn title={modal === 'add' ? 'Add' : 'Save'} onPress={save} />
        </View>
      </AppModal>

      {/* Delete */}
      <AppModal visible={modal === 'delete'} onClose={close} title="Confirm Delete">
        <View style={styles.deleteBody}>
          <Icon name="trash-can" size={56} color="rgba(0,58,78,0.97)" />
          <Text style={styles.deleteText}>Confirm {p.noun} Deletes</Text>
          <View style={styles.modalBtns}>
            <Btn
              title="Yes"
              onPress={() => {
                if (current) setItems(items.filter((i) => i.id !== current.id));
                close();
              }}
            />
            <Btn title="No" onPress={close} />
          </View>
        </View>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  td: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  label: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: '500', marginBottom: 6 },
  errorCenter: { color: Palette.error, fontSize: FontSizes.xs, textAlign: 'center' },
  modalBtns: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: Spacing.xl },
  deleteBody: { alignItems: 'center', paddingVertical: Spacing.xl },
  deleteText: { marginTop: Spacing.md, color: '#212529', fontSize: FontSizes.lg, fontWeight: '500' },
});
