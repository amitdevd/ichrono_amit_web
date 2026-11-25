import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { LISTING_OPTIONS, listingTitle, type Gender, type Listing } from '@/data';
import { ImageThumb, UploadBox, missing } from '@/components/listing/ListingUI';
import { ListingGallery } from '@/components/listing/ListingDetails';
import { useBreakpoint, Btn, Field, SelectField, pickImage } from '@ichrono/ui';

/**
 * Admin "Add Product Details" / "Edit Product Details" form –
 * backend_ref/views/admin/product/add-product.blade.php and edit-product.blade.php
 * (`.product-form .form-grid`: two columns, description full width, "Next" → watch condition).
 * The reference has a single "Watch name" field; a leading brand name is split off so the
 * product keeps a brand like the user / dealer listings.
 */
const KNOWN_BRANDS = [...LISTING_OPTIONS.brands].sort((a, b) => b.length - a.length);

function splitName(name: string): { brand: string; model: string } {
  const n = name.trim();
  const brand = KNOWN_BRANDS.find((b) => n.toLowerCase().startsWith(b.toLowerCase() + ' ') || n.toLowerCase() === b.toLowerCase());
  return brand ? { brand, model: n.slice(brand.length).trim() } : { brand: '', model: n };
}

type Values = {
  name: string;
  price: string;
  year: string;
  gender: string;
  serial: string;
  dialColor: string;
  diameterMax: string;
  diameterMin: string;
  movement: string;
  caseMaterial: string;
  braceletMaterial: string;
  braceletColor: string;
  scope: string;
  description: string;
};

export default function ProductForm({
  listing,
  mode,
  onNext,
}: {
  listing?: Listing;
  mode: 'add' | 'edit';
  onNext: (patch: Partial<Listing>) => void;
}) {
  const { lgUp } = useBreakpoint();
  const [images, setImages] = useState<string[]>(listing?.images ?? []);
  const [imgError, setImgError] = useState('');
  const [v, setV] = useState<Values>({
    name: listing ? listingTitle(listing) : '',
    price: listing?.price ?? '',
    year: listing?.year ?? '',
    gender: listing?.gender ?? '',
    serial: listing?.serial ?? '',
    dialColor: listing?.dialColor ?? '',
    diameterMax: listing?.diameterMax ?? '',
    diameterMin: listing?.diameterMin ?? '',
    movement: listing?.movement ?? '',
    caseMaterial: listing?.caseMaterial ?? '',
    braceletMaterial: listing?.braceletMaterial ?? '',
    braceletColor: listing?.braceletColor ?? '',
    scope: listing?.scope ?? '',
    description: listing?.description ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof Values, numeric = false) => (t: string) => {
    setV((o) => ({ ...o, [k]: numeric ? t.replace(/[^0-9.]/g, '') : t }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = () => {
    const e = missing(v, [
      ['name', 'watch name'],
      ['price', 'watch price'],
      ['year', 'year of production'],
      ['gender', 'gender'],
      ['serial', 'serial number'],
      ['dialColor', 'dial color'],
      ['diameterMax', 'case diameter max'],
      ['diameterMin', 'case diameter min'],
      ['movement', 'movement type'],
      ['caseMaterial', 'case material'],
      ['braceletMaterial', 'bracelet material'],
      ['braceletColor', 'bracelet color'],
      ['scope', 'scope of delivery'],
    ]);
    setErrors(e);
    if (!images.length) setImgError('Please upload at least one image.');
    if (Object.keys(e).length || !images.length) return;
    const { description, name, ...rest } = v;
    onNext({ ...rest, ...splitName(name), gender: v.gender as Gender, description, images });
  };

  const cell = lgUp ? { flexBasis: '48%' as any, flexGrow: 1 } : { width: '100%' as any };
  const select = (k: keyof Values, label: string, options: string[]) => (
    <SelectField label={label} value={v[k]} onChange={set(k)} options={options} placeholder={label} searchable={options.length > 8} error={errors[k]} style={cell} />
  );

  return (
    <View>
      {mode === 'edit' && listing ? (
        <View style={{ marginBottom: Spacing.xl }}>
          <ListingGallery images={images} height={220} />
        </View>
      ) : null}
      <Text style={styles.label}>Upload images</Text>
      <UploadBox
        onPress={async () => {
          const u = await pickImage();
          if (u) {
            setImages((l) => [...l, u].slice(0, 5));
            setImgError('');
          }
        }}
        hint="Supported file: JPEG, PNG | Max: 5 files"
        error={imgError}
      />
      {images.length ? (
        <View style={styles.thumbs}>
          {images.map((u, i) => (
            <ImageThumb key={`${u}-${i}`} uri={u} size={90} onRemove={() => setImages((l) => l.filter((_, j) => j !== i))} />
          ))}
        </View>
      ) : null}

      <View style={[styles.grid, { marginTop: Spacing.xl }]}>
        <Field label="Watch name" value={v.name} onChangeText={set('name')} placeholder="Rolex XF" error={errors.name} autoCapitalize="words" style={cell} />
        <Field
          label="Watch price"
          value={v.price}
          onChangeText={set('price', true)}
          placeholder="7566"
          keyboardType="decimal-pad"
          error={errors.price}
          left={<Text style={styles.prefix}>$</Text>}
          style={cell}
        />
        {select('year', 'Select Year of production', LISTING_OPTIONS.years)}
        {select('gender', 'Select Gender', LISTING_OPTIONS.genders)}
        <Field label="Select Serial number" value={v.serial} onChangeText={set('serial')} placeholder="12345678" error={errors.serial} autoCapitalize="characters" style={cell} />
        {select('dialColor', 'Select Dial color', LISTING_OPTIONS.dialColors)}
        <View style={cell}>
          <Text style={styles.label}>Select Case diameter</Text>
          <View style={styles.pair}>
            <Field value={v.diameterMax} onChangeText={set('diameterMax', true)} placeholder="Max" keyboardType="decimal-pad" error={errors.diameterMax} style={{ flex: 1 }} />
            <Field value={v.diameterMin} onChangeText={set('diameterMin', true)} placeholder="Min" keyboardType="decimal-pad" error={errors.diameterMin} style={{ flex: 1 }} />
          </View>
        </View>
        {select('movement', 'Select Movement Type', LISTING_OPTIONS.movements)}
        {select('caseMaterial', 'Select Case material', LISTING_OPTIONS.caseMaterials)}
        {select('braceletMaterial', 'Select Bracelet material', LISTING_OPTIONS.braceletMaterials)}
        {select('braceletColor', 'Select Bracelet color', LISTING_OPTIONS.braceletColors)}
        {select('scope', 'Select Scope of Delivery', LISTING_OPTIONS.scopes)}
        <Field
          label="Description (optional)"
          value={v.description}
          onChangeText={set('description')}
          multiline
          rows={4}
          autoCapitalize="sentences"
          style={{ width: '100%' }}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: Spacing.lg }}>
        <Btn title="Next" variant="customBtn" onPress={submit} style={{ minWidth: 220 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: Spacing.xl },
  pair: { flexDirection: 'row', gap: Spacing.md },
  label: { color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: 8 },
  prefix: { color: Palette.textSecondary, fontSize: FontSizes.md, marginRight: 6 },
  thumbs: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: Spacing.md },
});
