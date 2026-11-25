import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import {
  CONDITION_LEVELS,
  LISTING_OPTIONS,
  WATCH_PARTS,
  conditionLabel,
  type ConditionLevel,
  type Gender,
  type Listing,
  type WatchPart,
} from '@/data';
import { useBreakpoint, Btn, Field, SelectField, Icon, Radio, ToggleSwitch, pickImage } from '@ichrono/ui';
import { ClockFace, ImageThumb, PROOF_TIMES, UploadBox, missing, required } from './ListingUI';

/**
 * The five "List Your Watch" forms, shared by
 *  User Web   – user/Listinguser/liststepone…liststepsix.blade.php  (variant "user")
 *  Dealer Web – dealer/listing/list_info, add_information … add_description.blade.php (variant "dealer")
 * The two portals ask for the same data; labels, field order and buttons follow each template.
 */
export type ListingVariant = 'user' | 'dealer';

type FormProps = {
  listing: Partial<Listing>;
  variant: ListingVariant;
  onNext: (patch: Partial<Listing>) => void;
};

function NextButton({ variant, onPress, title }: { variant: ListingVariant; onPress: () => void; title?: string }) {
  return (
    <Btn
      title={title ?? (variant === 'user' ? 'Continue' : 'Next')}
      variant={variant === 'user' ? 'customBtn3' : 'success'}
      onPress={onPress}
      style={{ marginTop: Spacing['2xl'] }}
    />
  );
}

const fieldVariant = (v: ListingVariant) => (v === 'dealer' ? 'dealer' : 'default');

// ─── Step one: brand / model / reference ────────────────────────────────────
export function BasicsForm({ listing, variant, onNext }: FormProps) {
  const [v, setV] = useState({ brand: listing.brand ?? '', model: listing.model ?? '', reference: listing.reference ?? '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof v) => (t: string) => {
    setV({ ...v, [k]: t });
    setErrors({ ...errors, [k]: '' });
  };
  const submit = () => {
    const e = missing(v, [
      ['brand', 'brand'],
      ['model', 'model'],
      ['reference', 'refernece number'],
    ]);
    setErrors(e);
    if (!Object.keys(e).length) onNext(v);
  };
  return (
    <View>
      <SelectField
        label="Brand"
        value={v.brand}
        onChange={set('brand')}
        options={LISTING_OPTIONS.brands}
        placeholder={variant === 'user' ? 'Please Select' : 'Brand'}
        searchable
        error={errors.brand}
      />
      <Field label="Model" value={v.model} onChangeText={set('model')} placeholder="Enter model" error={errors.model} autoCapitalize="words" variant={fieldVariant(variant)} />
      <Field
        label="Reference Number"
        value={v.reference}
        onChangeText={set('reference')}
        placeholder="Enter reference number"
        error={errors.reference}
        autoCapitalize="characters"
        variant={fieldVariant(variant)}
      />
      <NextButton variant={variant} onPress={submit} title="Next" />
    </View>
  );
}

// ─── Step two: watch information ────────────────────────────────────────────
type InfoKey =
  | 'year'
  | 'gender'
  | 'serial'
  | 'dialColor'
  | 'diameterMin'
  | 'diameterMax'
  | 'category'
  | 'movement'
  | 'caseMaterial'
  | 'braceletMaterial'
  | 'braceletColor'
  | 'scope'
  | 'price';

const INFO_FIELDS: { key: InfoKey; field: string; user: [string, string]; dealer: [string, string] }[] = [
  { key: 'year', field: 'year of production', user: ['Year of Production', 'Select Year'], dealer: ['Select year of production', 'Select year'] },
  { key: 'category', field: 'category', user: ['Select Category', 'Select Category'], dealer: ['Choose Category', 'Select category'] },
  { key: 'gender', field: 'gender', user: ['Gender', 'Select Gender'], dealer: ['Choose gender', 'Select gender'] },
  { key: 'serial', field: 'serial number', user: ['Serial Number (will not be published)', 'GS0028/06'], dealer: ['Serial number (will not be published)', 'Serial number'] },
  { key: 'dialColor', field: 'dial color', user: ['Dial Color', 'Select the dial color'], dealer: ['Select dial color', 'Select dial color'] },
  { key: 'diameterMin', field: 'case diameter min', user: ['', 'Min'], dealer: ['', 'Min'] },
  { key: 'diameterMax', field: 'case diameter max', user: ['', 'Max'], dealer: ['', 'Max'] },
  { key: 'movement', field: 'movement type', user: ['Movement Type', 'Select a Movement Type'], dealer: ['Movement Type', 'Select movement type'] },
  { key: 'caseMaterial', field: 'case material', user: ['Case Material', 'Select case'], dealer: ['Select case material', 'Select case material'] },
  { key: 'braceletMaterial', field: 'bracelet material', user: ['Bracelet Material', 'Select Bracelet Material'], dealer: ['Select bracelet material', 'Select bracelet material'] },
  { key: 'braceletColor', field: 'bracelet color', user: ['Bracelet color', 'Select color'], dealer: ['Select bracelet color', 'Select bracelet color'] },
  { key: 'scope', field: 'scope of delivery', user: ['Scope of Delivery', 'Select the scope of delivery'], dealer: ['Select scope of Delivery', 'Select scope of delivery'] },
  { key: 'price', field: 'watch price', user: ['Watch Price', '66000'], dealer: ['Watch Price', 'price'] },
];

const OPTIONS: Partial<Record<InfoKey, string[]>> = {
  year: LISTING_OPTIONS.years,
  category: LISTING_OPTIONS.categories,
  gender: LISTING_OPTIONS.genders,
  dialColor: LISTING_OPTIONS.dialColors,
  movement: LISTING_OPTIONS.movements,
  caseMaterial: LISTING_OPTIONS.caseMaterials,
  braceletMaterial: LISTING_OPTIONS.braceletMaterials,
  braceletColor: LISTING_OPTIONS.braceletColors,
  scope: LISTING_OPTIONS.scopes,
};

const num = (t: string) => t.replace(/[^0-9.]/g, '');

export function InformationForm({ listing, variant, onNext }: FormProps) {
  const { lgUp } = useBreakpoint();
  const [v, setV] = useState<Record<InfoKey, string>>(() =>
    Object.fromEntries(INFO_FIELDS.map((f) => [f.key, String((listing as any)[f.key] ?? '')])) as Record<InfoKey, string>,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: InfoKey, numeric = false) => (t: string) => {
    setV((o) => ({ ...o, [k]: numeric ? num(t) : t }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = () => {
    const e = missing(v, INFO_FIELDS.map((f) => [f.key, f.field]));
    if (!e.diameterMin && !e.diameterMax && Number(v.diameterMin) > Number(v.diameterMax)) {
      e.diameterMax = 'The case diameter max must be greater than or equal to the min.';
    }
    setErrors(e);
    if (!Object.keys(e).length) onNext({ ...v, gender: v.gender as Gender });
  };

  const isUser = variant === 'user';
  const half = lgUp ? { flex: 1 } : null;
  const field = (k: InfoKey) => {
    const f = INFO_FIELDS.find((x) => x.key === k)!;
    const [label, placeholder] = isUser ? f.user : f.dealer;
    const opts = OPTIONS[k];
    if (opts) {
      return (
        <SelectField
          key={k}
          label={label}
          required={isUser}
          value={v[k]}
          onChange={set(k)}
          options={opts}
          placeholder={placeholder}
          searchable={opts.length > 8}
          error={errors[k]}
          style={half}
        />
      );
    }
    const isNum = k === 'price' || k === 'diameterMin' || k === 'diameterMax';
    return (
      <Field
        key={k}
        label={label || undefined}
        required={isUser && !!label}
        value={v[k]}
        onChangeText={set(k, isNum)}
        placeholder={placeholder}
        error={errors[k]}
        keyboardType={isNum ? 'decimal-pad' : 'default'}
        autoCapitalize={k === 'serial' ? 'characters' : 'none'}
        variant={fieldVariant(variant)}
        left={k === 'price' ? <Text style={styles.prefix}>$</Text> : undefined}
        right={k === 'diameterMin' || k === 'diameterMax' ? <Text style={styles.suffix}>mm</Text> : undefined}
        style={half}
      />
    );
  };
  const row = (...keys: InfoKey[]) => (
    <View style={[styles.row, !lgUp && { flexDirection: 'column', gap: 0 }]}>{keys.map(field)}</View>
  );

  return (
    <View>
      {isUser ? (
        <>
          {row('year', 'gender')}
          {field('serial')}
          {field('dialColor')}
          <Text style={styles.label}>
            Case Diameter<Text style={{ color: Palette.error }}> *</Text>
          </Text>
          {row('diameterMin', 'diameterMax')}
          {field('category')}
          {field('movement')}
          {row('caseMaterial', 'braceletMaterial')}
          {field('braceletColor')}
          {field('scope')}
          {field('price')}
        </>
      ) : (
        <>
          {field('year')}
          {field('category')}
          {field('gender')}
          {field('serial')}
          {field('dialColor')}
          <Text style={styles.label}>Case diameter</Text>
          {row('diameterMin', 'diameterMax')}
          {field('movement')}
          {field('caseMaterial')}
          {field('braceletMaterial')}
          {field('braceletColor')}
          {field('scope')}
          {field('price')}
        </>
      )}
      <NextButton variant={variant} onPress={submit} />
    </View>
  );
}

// ─── Step three: watch pictures (max 5) ─────────────────────────────────────
const MAX_IMAGES = 5;

export function PhotosForm({ listing, variant, onNext }: FormProps) {
  const [images, setImages] = useState<string[]>(listing.images ?? []);
  const [error, setError] = useState('');

  const add = async () => {
    if (images.length >= MAX_IMAGES) return setError(`You may upload max ${MAX_IMAGES} pictures.`);
    const uri = await pickImage();
    if (uri) {
      setImages((list) => [...list, uri].slice(0, MAX_IMAGES));
      setError('');
    }
  };

  const submit = () => {
    if (!images.length) return setError('Please upload at least one picture of your watch.');
    onNext({ images });
  };

  return (
    <View>
      <UploadBox
        onPress={add}
        hint={variant === 'user' ? 'Supported file: JPEG, PNG, PDF' : `Supported file types: JPEG, PNG | Max: ${MAX_IMAGES} files`}
        error={error}
      />
      {images.length ? (
        <View style={styles.thumbs}>
          {images.map((u, i) => (
            <ImageThumb key={`${u}-${i}`} uri={u} onRemove={() => setImages((list) => list.filter((_, j) => j !== i))} />
          ))}
        </View>
      ) : null}
      {variant === 'dealer' ? (
        <Field value={`${images.length} / Max ${MAX_IMAGES}`} editable={false} variant="dealer" style={{ marginTop: Spacing.xl }} />
      ) : null}
      <NextButton variant={variant} onPress={submit} />
    </View>
  );
}

// ─── Step four: proof of ownership ──────────────────────────────────────────
export function OwnershipForm({ listing, variant, onNext }: FormProps) {
  const { mdUp } = useBreakpoint();
  const [proof, setProof] = useState<[string | null, string | null]>(listing.proof ?? [null, null]);
  const [errors, setErrors] = useState<[string, string]>(['', '']);

  const pick = async (i: 0 | 1) => {
    const uri = await pickImage();
    if (!uri) return;
    const next: [string | null, string | null] = [...proof];
    next[i] = uri;
    setProof(next);
    const e: [string, string] = [...errors];
    e[i] = '';
    setErrors(e);
  };

  const submit = () => {
    const e: [string, string] = [proof[0] ? '' : required('image one'), proof[1] ? '' : required('image two')];
    setErrors(e);
    if (!e[0] && !e[1]) onNext({ proof });
  };

  const titles = variant === 'dealer' ? ['Upload an Image (Before Ownership)', 'Upload an Image (After Ownership)'] : ['Upload an Image', 'Upload an Image'];
  const hint = variant === 'dealer' ? 'Supported file: JPEG, JPG, PNG, AVIF' : 'Supported file: JPEG, PNG, PDF';

  return (
    <View>
      {([0, 1] as const).map((i) => (
        <View key={i} style={[styles.proofRow, !mdUp && { flexDirection: 'column' }]}>
          <View style={[styles.clockBox, mdUp && { flex: 1 }]}>
            <ClockFace hours={PROOF_TIMES[i][0]} minutes={PROOF_TIMES[i][1]} />
          </View>
          <View style={mdUp ? { flex: 1 } : null}>
            {proof[i] ? (
              <View style={styles.proofPreview}>
                <ImageThumb uri={proof[i]!} size={150} />
                <Btn title="Change image" variant="outline" small onPress={() => pick(i)} style={{ width: 'auto', paddingHorizontal: 18 }} />
              </View>
            ) : (
              <UploadBox title={titles[i]} hint={hint} onPress={() => pick(i)} error={errors[i]} />
            )}
          </View>
        </View>
      ))}
      <NextButton variant={variant} onPress={submit} />
    </View>
  );
}

// ─── Step five: conditions ──────────────────────────────────────────────────
export function ConditionsForm({ listing, variant, onNext }: FormProps) {
  const [hasWear, setHasWear] = useState(!!listing.hasWear);
  const [conditions, setConditions] = useState<Partial<Record<WatchPart, ConditionLevel>>>(listing.conditions ?? {});
  const [open, setOpen] = useState<WatchPart | null>(null);
  const [error, setError] = useState('');

  const submit = () => {
    const missingPart = WATCH_PARTS.find((p) => !conditions[p.key]);
    if (missingPart) return setError(`Please set the condition of the ${missingPart.label.toLowerCase()}.`);
    onNext({ hasWear, conditions });
  };

  return (
    <View>
      <View style={styles.wear}>
        <Text style={styles.wearText}>Does your watch have signs of wear?</Text>
        <ToggleSwitch value={hasWear} onChange={setHasWear} />
      </View>
      <Text style={styles.setTitle}>Set the Overall Condition</Text>
      <View style={styles.condList}>
        {WATCH_PARTS.map((p, i) => (
          <Pressable
            key={p.key}
            onPress={() => setOpen(p.key)}
            accessibilityRole="button"
            accessibilityLabel={`${p.label} condition`}
            style={({ hovered }: any) => [styles.condRow, i > 0 && styles.condRowBorder, hovered && { backgroundColor: Palette.surfaceIce }]}
          >
            <View style={styles.condIcon}>
              <Icon name={p.icon} size={18} color={Palette.primary} />
            </View>
            <Text style={styles.condLabel}>{p.label}</Text>
            {conditions[p.key] ? <Text style={styles.condValue}>{conditionLabel(conditions[p.key])}</Text> : null}
            <Icon name="chevron-right" size={14} color={Palette.textMuted} />
          </Pressable>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <NextButton variant={variant} onPress={submit} />

      <ConditionSheet
        part={open}
        value={open ? conditions[open] : undefined}
        onClose={() => setOpen(null)}
        onSave={(lvl) => {
          if (open) setConditions((c) => ({ ...c, [open]: lvl }));
          setError('');
          setOpen(null);
        }}
      />
    </View>
  );
}

/** `.offcanvas-bottom .conditionWisewatch` – pick a condition level for one part */
export function ConditionSheet({
  part,
  value,
  onClose,
  onSave,
  saveLabel = 'Save Condition',
}: {
  part: WatchPart | null;
  value?: ConditionLevel;
  onClose: () => void;
  onSave: (lvl: ConditionLevel) => void;
  saveLabel?: string;
}) {
  const { mdUp } = useBreakpoint();
  const [tab, setTab] = useState<ConditionLevel>(value ?? 'none');
  const [checked, setChecked] = useState<ConditionLevel | undefined>(value);
  const [lastPart, setLastPart] = useState<WatchPart | null>(null);
  // reset the selection whenever another part is opened
  if (part !== lastPart) {
    setLastPart(part);
    setTab(value ?? 'none');
    setChecked(value);
  }
  const label = WATCH_PARTS.find((p) => p.key === part)?.label ?? '';
  const lvl = CONDITION_LEVELS.find((l) => l.key === tab)!;

  return (
    <Modal visible={!!part} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <Text style={styles.closeText}>X</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            <Text style={styles.sheetH3}>Please select the appropriate condition.</Text>
            <View style={[styles.sheetCols, !mdUp && { flexDirection: 'column' }]}>
              <View style={[styles.levelNav, mdUp && { width: '34%' }]}>
                {CONDITION_LEVELS.map((l) => (
                  <Pressable key={l.key} onPress={() => setTab(l.key)} style={[styles.levelBtn, tab === l.key && styles.levelBtnOn]}>
                    <Text style={[styles.levelText, tab === l.key && { color: Palette.white }]}>{l.label}</Text>
                    <Icon name="chevron-right" size={12} color={tab === l.key ? Palette.white : Palette.textMuted} />
                  </Pressable>
                ))}
              </View>
              <View style={[styles.levelPane, mdUp && { flex: 1 }]}>
                <View style={styles.paneIcon}>
                  <ClockFace hours={10} minutes={10} size={84} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paneH4}>{lvl.label}</Text>
                  <Text style={styles.paneP}>{lvl.desc}</Text>
                  <Radio checked={checked === lvl.key} onPress={() => setChecked(lvl.key)} label="Select" style={{ marginTop: Spacing.md }} />
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: Spacing.xl }}>
              <Btn
                title={saveLabel}
                variant="customBtn3"
                disabled={!checked}
                onPress={() => checked && onSave(checked)}
                style={{ width: 'auto', paddingHorizontal: 40 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Step six: description (+ dealer shipping costs) ────────────────────────
export function DescriptionForm({
  listing,
  variant,
  onSaveDraft,
  onSubmit,
}: {
  listing: Partial<Listing>;
  variant: ListingVariant;
  onSaveDraft: (patch: Partial<Listing>) => void;
  onSubmit: (patch: Partial<Listing>) => void;
}) {
  const { mdUp } = useBreakpoint();
  const [description, setDescription] = useState(listing.description ?? '');
  const [domestic, setDomestic] = useState(listing.domestic ?? { min: '', max: '', cost: '' });
  const [continental, setContinental] = useState(listing.continental ?? { min: '', max: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isDealer = variant === 'dealer';

  const patch = (): Partial<Listing> => (isDealer ? { description, domestic, continental } : { description });

  const submit = () => {
    if (isDealer) {
      const e: Record<string, string> = {};
      if (!domestic.min || !domestic.max) e.domesticRange = required('domestic item price range');
      else if (Number(domestic.min) > Number(domestic.max)) e.domesticRange = 'The maximum price must be greater than the minimum price.';
      if (!domestic.cost) e.domesticCost = required('domestic shipping cost');
      if (!continental.min || !continental.max) e.continentalRange = required('continental item price range');
      else if (Number(continental.min) > Number(continental.max)) e.continentalRange = 'The maximum price must be greater than the minimum price.';
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    onSubmit(patch());
  };

  const money = (value: string, onChange: (t: string) => void, label: string, style?: any) => (
    <Field
      value={value}
      onChangeText={(t) => onChange(num(t))}
      placeholder={label}
      keyboardType="decimal-pad"
      variant="dealer"
      left={<Text style={styles.prefix}>$</Text>}
      style={[{ marginBottom: 0 }, style]}
    />
  );

  return (
    <View>
      <View style={{ padding: Spacing.xl }}>
        <Field
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          rows={6}
          autoCapitalize="sentences"
          variant={fieldVariant(variant)}
        />
      </View>

      {isDealer ? (
        <View style={{ paddingHorizontal: Spacing.xl, gap: Spacing.lg }}>
          <View style={styles.setCost}>
            <Text style={styles.setTitle}>Set Domestic Cost</Text>
            <Text style={styles.label}>Item price range</Text>
            <View style={[styles.row, !mdUp && { flexDirection: 'column' }]}>
              {money(domestic.min, (t) => setDomestic({ ...domestic, min: t }), 'Min', mdUp && { flex: 1 })}
              {money(domestic.max, (t) => setDomestic({ ...domestic, max: t }), 'Max', mdUp && { flex: 1 })}
            </View>
            {errors.domesticRange ? <Text style={styles.error}>{errors.domesticRange}</Text> : null}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>Shipping Cost</Text>
            {money(domestic.cost, (t) => setDomestic({ ...domestic, cost: t }), 'Shipping cost')}
            {errors.domesticCost ? <Text style={styles.error}>{errors.domesticCost}</Text> : null}
          </View>
          <View style={styles.setCost}>
            <Text style={styles.setTitle}>Set Continental Cost</Text>
            <Text style={styles.label}>Item price range</Text>
            <View style={[styles.row, !mdUp && { flexDirection: 'column' }]}>
              {money(continental.min, (t) => setContinental({ ...continental, min: t }), 'Min', mdUp && { flex: 1 })}
              {money(continental.max, (t) => setContinental({ ...continental, max: t }), 'Max', mdUp && { flex: 1 })}
            </View>
            {errors.continentalRange ? <Text style={styles.error}>{errors.continentalRange}</Text> : null}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>Shipping Cost</Text>
            <Text style={styles.free}>Free</Text>
          </View>
        </View>
      ) : null}

      <View style={[styles.actions, !mdUp && { flexDirection: 'column' }]}>
        <Btn
          title="Save as a draft"
          variant={isDealer ? 'outline' : 'customBtn4'}
          onPress={() => onSaveDraft(patch())}
          style={mdUp ? { flex: 1 } : null}
        />
        <Btn title="Submit" variant={isDealer ? 'success' : 'customBtn3'} onPress={submit} style={mdUp ? { flex: 1 } : null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.lg },
  label: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: 8 },
  prefix: { color: Palette.textSecondary, fontSize: FontSizes.md, marginRight: 6 },
  suffix: { color: Palette.textSecondary, fontSize: FontSizes.sm, marginLeft: 6 },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 6 },
  thumbs: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: Spacing.lg },
  proofRow: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.xl },
  clockBox: {
    minHeight: 170,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    borderRadius: Radius.lg,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  proofPreview: {
    minHeight: 170,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: Spacing.md,
  },
  wear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
    marginBottom: Spacing.lg,
  },
  wearText: { color: Palette.textBody, fontSize: FontSizes.md, flexShrink: 1 },
  setTitle: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, marginBottom: Spacing.md },
  condList: { borderWidth: 1, borderColor: Palette.borderSoft, borderRadius: Radius.lg, overflow: 'hidden' },
  condRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.lg, paddingVertical: 14, backgroundColor: Palette.white },
  condRowBorder: { borderTopWidth: 1, borderTopColor: Palette.divider },
  condIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Palette.surfaceIce, alignItems: 'center', justifyContent: 'center' },
  condLabel: { flex: 1, color: Palette.textBody, fontSize: FontSizes.md, fontWeight: FontWeights.medium },
  condValue: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  sheetTitle: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: Palette.primary, fontWeight: FontWeights.bold },
  sheetBody: { padding: Spacing.xl },
  sheetH3: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.medium, marginBottom: Spacing.lg },
  sheetCols: { flexDirection: 'row', gap: Spacing.xl },
  levelNav: { gap: 8 },
  levelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.borderSoft,
    backgroundColor: Palette.white,
  },
  levelBtnOn: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  levelText: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  levelPane: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceIce,
    alignItems: 'flex-start',
  },
  paneIcon: { alignItems: 'center' },
  paneH4: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  paneP: { color: Palette.textSecondary, fontSize: FontSizes.sm, marginTop: 6, lineHeight: 20 },
  setCost: { borderWidth: 1, borderColor: Palette.borderSoft, borderRadius: Radius.lg, padding: Spacing.xl, backgroundColor: Palette.surfaceSubtle },
  free: { color: Palette.success, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  actions: { flexDirection: 'row', gap: Spacing.xl, padding: Spacing['2xl'] },
});
