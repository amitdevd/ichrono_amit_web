import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { BackTitle, Card } from '@/components/admin/AdminUI';
import { ClockFace } from '@/components/listing/ListingUI';
import { useListingParam, ListingNotFound } from '@/hooks/use-listing-param';
import { CONDITION_LEVELS, WATCH_PARTS, conditionLabel, type ConditionLevel, type Listing, type WatchPart } from '@/data';
import { AppModal, Btn, FieldLabel, Icon, Radio } from '@ichrono/ui';

/**
 * Admin "Condition of a watch" – backend_ref/views/admin/product/condition-product.blade.php
 * Signs of wear Yes / No, the six "Overall condition" rows and, per row, a modal with the
 * None / Barely visible / Noticeable / Obvious buttons and an "Add" button.
 * The reference page has no final button; "Save" finishes the add / edit flow.
 */
export default function WatchCondition() {
  const { listing, ready, store } = useListingParam();
  return (
    <View>
      <BackTitle
        onBack={() =>
          router.push((listing ? `/admin/product-management/${listing.status === 'draft' ? 'add' : `update?id=${listing.id}`}` : '/admin/product-management') as any)
        }
      >
        Condition of a watch
      </BackTitle>
      {ready && listing ? (
        <ConditionEditor
          listing={listing}
          onSave={(patch) => {
            const isNew = listing.status === 'draft';
            store.update(listing.id, isNew ? { ...patch, status: 'approved', active: true } : patch);
            router.replace((isNew ? '/admin/product-management?source=admin' : `/admin/product-management/details?id=${listing.id}`) as any);
          }}
        />
      ) : ready ? (
        <ListingNotFound backHref="/admin/product-management" backLabel="Back to Product Management" />
      ) : null}
    </View>
  );
}

function ConditionEditor({ listing, onSave }: { listing: Listing; onSave: (patch: Partial<Listing>) => void }) {
  const [hasWear, setHasWear] = useState(listing.hasWear);
  const [conditions, setConditions] = useState(listing.conditions);
  const [open, setOpen] = useState<WatchPart | null>(null);
  const [pick, setPick] = useState<ConditionLevel>('none');
  const [error, setError] = useState('');

  const openPart = (p: WatchPart) => {
    setPick(conditions[p] ?? 'none');
    setOpen(p);
  };
  const lvl = CONDITION_LEVELS.find((l) => l.key === pick)!;

  return (
    <Card>
      <FieldLabel>Does your watch have signs of wear?</FieldLabel>
      <View style={styles.radios}>
        <Radio checked={hasWear} onPress={() => setHasWear(true)} label="Yes" />
        <Radio checked={!hasWear} onPress={() => setHasWear(false)} label="No" />
      </View>

      <View style={{ marginTop: Spacing['2xl'] }}>
        <FieldLabel>Overall condition</FieldLabel>
        <View style={styles.list}>
          {WATCH_PARTS.map((p, i) => (
            <Pressable
              key={p.key}
              onPress={() => openPart(p.key)}
              accessibilityRole="button"
              accessibilityLabel={`${p.label} condition`}
              style={({ hovered }: any) => [styles.row, i > 0 && styles.rowBorder, hovered && { backgroundColor: Palette.surfaceIce }]}
            >
              <View style={styles.icon}>
                <Icon name={p.icon} size={18} color={Palette.primary} />
              </View>
              <Text style={styles.label}>{p.label}</Text>
              {conditions[p.key] ? <Text style={styles.value}>{conditionLabel(conditions[p.key])}</Text> : null}
              <View style={styles.arrow}>
                <Icon name="angle-right" size={14} color={Palette.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={{ alignItems: 'center', marginTop: Spacing['2xl'] }}>
        <Btn
          title="Save"
          variant="customBtn"
          style={{ minWidth: 200 }}
          onPress={() => {
            const miss = WATCH_PARTS.find((p) => !conditions[p.key]);
            if (miss) return setError(`Please add the condition of the ${miss.label.toLowerCase()}.`);
            onSave({ hasWear, conditions });
          }}
        />
      </View>

      <AppModal visible={!!open} onClose={() => setOpen(null)} title={WATCH_PARTS.find((p) => p.key === open)?.label} showClose width={860}>
        <Text style={styles.prompt}>Please select the appropriate condition.</Text>
        <View style={styles.levelRow}>
          {CONDITION_LEVELS.map((l) => (
            <Btn key={l.key} title={l.label} active={pick === l.key} onPress={() => setPick(l.key)} style={{ width: 'auto', paddingHorizontal: 18 }} />
          ))}
        </View>
        <View style={styles.watchBox}>
          <ClockFace hours={10} minutes={10} size={110} />
          <Text style={styles.h6}>{lvl.label}</Text>
          <Text style={styles.desc}>{lvl.desc}</Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: Spacing.xl }}>
          <Btn
            title="Add"
            onPress={() => {
              if (open) setConditions((c) => ({ ...c, [open]: pick }));
              setError('');
              setOpen(null);
            }}
            style={{ width: 'auto', paddingHorizontal: 40 }}
          />
        </View>
      </AppModal>
    </Card>
  );
}

const styles = StyleSheet.create({
  radios: { flexDirection: 'row', gap: Spacing['3xl'], marginTop: Spacing.md },
  list: { borderWidth: 1, borderColor: Palette.neutralBorder, borderRadius: Radius.md, overflow: 'hidden', maxWidth: 560 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.lg, paddingVertical: 12, backgroundColor: Palette.white },
  rowBorder: { borderTopWidth: 1, borderTopColor: Palette.divider },
  icon: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Palette.surfaceIce, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, color: Palette.textBody, fontSize: FontSizes.md },
  value: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: Spacing.md, textAlign: 'center' },
  prompt: { color: Palette.textBody, fontSize: FontSizes.md, textAlign: 'center', marginBottom: Spacing.lg },
  levelRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.md },
  watchBox: {
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceIce,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  h6: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  desc: { color: Palette.textSecondary, fontSize: FontSizes.sm, textAlign: 'center' },
});
