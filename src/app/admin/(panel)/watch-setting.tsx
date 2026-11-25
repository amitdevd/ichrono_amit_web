import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes } from '@/constants/theme';
import { Card, PageTitle, TableAction } from '@/components/admin/AdminUI';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { WATCH_SETTINGS, type NamedItem } from '@/data';
import { useBreakpoint, Btn, AppModal, Field, ToggleSwitch, DataTable, type Column } from '@ichrono/ui';

/** backend_ref/views/admin/watch-setting/index.blade.php */
type TabKey = keyof typeof WATCH_SETTINGS;

const TABS: {
  key: TabKey;
  tab: string;
  column: string;
  addTitle: string;
  editTitle: string;
  label: string;
  placeholder: string;
  deleteMsg: string;
}[] = [
  { key: 'dial', tab: 'Dial Color', column: 'Color', addTitle: 'Add New Color', editTitle: 'Edit New Color', label: 'Color Name', placeholder: 'Please Enter Color Name', deleteMsg: 'Confirm Dial Color Delete' },
  { key: 'movement', tab: 'Movement Type', column: 'Movement', addTitle: 'Add Movement Type', editTitle: 'Edit Movement', label: 'Movement Type', placeholder: 'Please Enter Movement Type', deleteMsg: 'Confirm Movement Type Delete' },
  { key: 'caseMaterial', tab: 'Case Material', column: 'Case Material', addTitle: 'Add Case Material', editTitle: 'Edit Case Material', label: 'Case Material', placeholder: 'Please Enter Case Material', deleteMsg: 'Confirm Case Material Delete' },
  { key: 'braceletColor', tab: 'Bracelet Color', column: 'Bracelet Color', addTitle: 'Add Bracelet Color', editTitle: 'Edit Bracelet Color', label: 'Bracelet Color', placeholder: 'Please Enter Bracelet Color', deleteMsg: 'Confirm Bracelet Color Delete' },
  { key: 'braceletMaterial', tab: 'Bracelet material', column: 'Bracelet Material', addTitle: 'Add Bracelet Material', editTitle: 'Edit Bracelet Material', label: 'Bracelet Material', placeholder: 'Please Enter Bracelet Material', deleteMsg: 'Confirm Watch Bracelet Material Delete' },
  { key: 'scope', tab: 'Scope Of Delivery', column: 'Scope of Delivery', addTitle: 'Add Scope of Delivery', editTitle: 'Edit Scope of Delivery', label: 'Scope of Delivery', placeholder: 'Please Enter Scope of Delivery', deleteMsg: 'Confirm Scope of Delivery Delete' },
];

export default function WatchSetting() {
  const { mdUp } = useBreakpoint();
  const [tab, setTab] = useState<TabKey>('dial');
  const [lists, setLists] = useState<Record<TabKey, NamedItem[]>>(WATCH_SETTINGS);
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete'>(null);
  const [current, setCurrent] = useState<NamedItem | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const cfg = TABS.find((t) => t.key === tab)!;
  const items = lists[tab];
  const setItems = (next: NamedItem[]) => setLists({ ...lists, [tab]: next });

  const open = (m: 'add' | 'edit' | 'delete', item?: NamedItem) => {
    setCurrent(item ?? null);
    setName(item?.name ?? '');
    setError('');
    setModal(m);
  };

  const save = () => {
    const v = name.trim();
    if (!v) return setError(`The ${cfg.label.toLowerCase()} field is required.`);
    if (items.some((i) => i.name.toLowerCase() === v.toLowerCase() && i.id !== current?.id))
      return setError(`This ${cfg.label.toLowerCase()} already exists.`);
    if (modal === 'add') {
      const id = Math.max(0, ...items.map((i) => i.id)) + 1;
      setItems([...items, { id, name: v, active: true }]);
    } else if (current) {
      setItems(items.map((i) => (i.id === current.id ? { ...i, name: v } : i)));
    }
    setModal(null);
  };

  const columns: Column<NamedItem>[] = [
    { key: 'sr', title: 'Sr.No', width: 90, render: (_r, i) => <Text style={styles.bold}>{i + 1}</Text> },
    { key: 'name', title: cfg.column, width: 280 },
    {
      key: 'action',
      title: 'Action',
      width: 180,
      align: 'center',
      render: (r) => (
        <View style={styles.actions}>
          <TableAction icon="create-outline" label="Edit" onPress={() => open('edit', r)} />
          <TableAction icon="trash" label="Delete" onPress={() => open('delete', r)} />
          <ToggleSwitch value={r.active} onChange={(v) => setItems(items.map((i) => (i.id === r.id ? { ...i, active: v } : i)))} />
        </View>
      ),
    },
  ];

  return (
    <View>
      <PageTitle>Watch Setting</PageTitle>
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Btn key={t.key} title={t.tab} active={tab === t.key} onPress={() => setTab(t.key)} style={{ margin: 6 }} />
        ))}
      </View>

      <Card>
        <View style={styles.topRow}>
          <Btn title="Add" variant="customBtn" onPress={() => open('add')} style={{ width: mdUp ? 260 : '100%' }} />
        </View>
        <View style={{ marginTop: Spacing['2xl'] }}>
          <DataTable key={tab} columns={columns} data={items} keyExtractor={(r) => String(r.id)} />
        </View>
      </Card>

      <AppModal visible={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? cfg.addTitle : cfg.editTitle}>
        <Field
          label={cfg.label}
          placeholder={cfg.placeholder}
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError('');
          }}
          error={error}
          autoCapitalize="words"
        />
        <View style={styles.modalBtns}>
          {modal === 'edit' ? <Btn title="Cancel" onPress={() => setModal(null)} /> : null}
          <Btn title={modal === 'add' ? 'Add' : 'Save Changes'} onPress={save} />
        </View>
      </AppModal>

      <ConfirmDeleteModal
        visible={modal === 'delete'}
        message={cfg.deleteMsg}
        onNo={() => setModal(null)}
        onYes={() => {
          if (current) setItems(items.filter((i) => i.id !== current.id));
          setModal(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginVertical: Spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  bold: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  modalBtns: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: Spacing.lg },
});
