import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { imageSource, type CatalogWatch, type Listing, type ListingStatus } from '@/data';
import { Icon, useBreakpoint } from '@ichrono/ui';

/**
 * Building blocks shared by the User Web and Dealer Web "create listing" pages
 * (backend_ref user/Listinguser/*.blade.php and dealer/listing/*.blade.php use the
 * same classes: .step-wapper/.info_circle, .watch-panel/.watch-header, .sellProduct …).
 */

// ─── .step-wapper .info_circle ──────────────────────────────────────────────
export const LISTING_STEPS = ['Information', 'Photos', 'Ownership', 'Conditions', 'Description'] as const;

export function StepDots({ active }: { active: number }) {
  return (
    <View style={s.steps} accessibilityRole="progressbar" accessibilityLabel={`Step ${active + 1} of ${LISTING_STEPS.length}`}>
      {LISTING_STEPS.map((label, i) => {
        const on = i <= active;
        return (
          <View key={label} style={s.stepItem}>
            {i > 0 ? <View style={[s.stepLine, on && s.stepLineOn]} /> : null}
            <View style={[s.dot, on && s.dotOn]}>{on ? <View style={s.dotInner} /> : null}</View>
            <Text style={[s.stepLabel, on && s.stepLabelOn]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── .watch-panel / .watch-header / .watch-body ─────────────────────────────
export function WatchPanel({
  title,
  subtitle,
  children,
  style,
  bodyStyle,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.panel, style]}>
      {title ? (
        <View style={s.panelHeader}>
          <Text style={s.h5}>{title}</Text>
          {subtitle ? <Text style={s.headerP}>{subtitle}</Text> : null}
        </View>
      ) : null}
      <View style={[s.panelBody, bodyStyle]}>{children}</View>
    </View>
  );
}

// ─── search box (.search-pnl) ───────────────────────────────────────────────
export function SearchBox({
  value,
  onChangeText,
  placeholder,
  onSubmit,
  onFocus,
  style,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  onSubmit?: () => void;
  onFocus?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.search, style]}>
      <Icon name="magnifying-glass" size={15} color={Palette.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.textMuted}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        returnKeyType="search"
        style={s.searchInput}
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

// ─── clock-ic.svg stand-in: watch face showing the time to set ──────────────
export function ClockFace({ hours, minutes, size = 120 }: { hours: number; minutes: number; size?: number }) {
  const minuteDeg = minutes * 6;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const hand = (deg: number, len: number, w: number, color: string) => (
    <View style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${deg}deg` }] }]} pointerEvents="none">
      <View
        style={{
          position: 'absolute',
          left: size / 2 - w / 2,
          top: size / 2 - len,
          width: w,
          height: len,
          borderRadius: w,
          backgroundColor: color,
        }}
      />
    </View>
  );
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={[s.clock, { width: size, height: size, borderRadius: size / 2 }]}>
        {Array.from({ length: 12 }, (_, i) => (
          <View key={i} style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${i * 30}deg` }] }]} pointerEvents="none">
            <View style={[s.tick, { left: size / 2 - 1.5, height: i % 3 === 0 ? 12 : 7 }]} />
          </View>
        ))}
        {hand(hourDeg, size * 0.26, 5, Palette.primary)}
        {hand(minuteDeg, size * 0.38, 3, Palette.secondary)}
        <View style={[s.pin, { left: size / 2 - 5, top: size / 2 - 5 }]} />
      </View>
      <Text style={s.clockText}>{`${hours}:${String(minutes).padStart(2, '0')}`}</Text>
    </View>
  );
}

/** The two times the seller must show in the proof-of-ownership pictures. */
export const PROOF_TIMES: [number, number][] = [
  [10, 10],
  [4, 40],
];

// ─── .best-upload-image ─────────────────────────────────────────────────────
export function UploadBox({
  title = 'Upload an Image',
  hint = 'Supported file: JPEG, PNG, PDF',
  onPress,
  error,
  style,
}: {
  title?: string;
  hint?: string;
  onPress: () => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ hovered }: any) => [s.upload, hovered && { borderColor: Palette.secondary }, !!error && { borderColor: Palette.error }]}
      >
        <View style={s.uploadIcon}>
          <Icon name="cloud-arrow-up" size={22} color={Palette.secondary} />
        </View>
        <Text style={s.uploadTitle}>{title}</Text>
        <Text style={s.uploadHint}>{hint}</Text>
      </Pressable>
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

/** `.image-preview-wrapper` thumbnail with the round "-" remove button */
export function ImageThumb({ uri, onRemove, size = 120 }: { uri: string; onRemove?: () => void; size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <Image source={imageSource(uri)} style={[s.thumb, { width: size, height: size }]} resizeMode="cover" />
      {onRemove ? (
        <Pressable onPress={onRemove} style={s.remove} accessibilityLabel="Remove image" hitSlop={6}>
          <Text style={s.removeText}>-</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── .sellProduct (watch summary) + .sellProductmain ("Looking to sell a watch?") ─
export function WatchSummary({
  watch,
}: {
  watch: Pick<CatalogWatch, 'brand' | 'model' | 'reference' | 'caseMaterial' | 'dialColor' | 'year'> & { image?: string | null };
}) {
  const { mdUp } = useBreakpoint();
  return (
    <View style={[s.summaryRow, !mdUp && { flexDirection: 'column' }]}>
      <View style={[s.sellProduct, mdUp && { flex: 1 }]}>
        <View style={s.imgProduct}>
          {watch.image ? (
            <Image source={imageSource(watch.image)} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          ) : (
            <Icon name="image" size={48} color={Palette.borderStrong} />
          )}
        </View>
        <Text style={s.sumBrand}>{watch.brand || 'N/A'}</Text>
        <View style={s.sumRow}>
          <Text style={s.sumModel}>{watch.model || 'N/A'}</Text>
          <Text style={s.sumRef}>{watch.reference || 'N/A'}</Text>
        </View>
        {[
          ['Case', watch.caseMaterial],
          ['Dial Color', watch.dialColor],
          ['Year', watch.year],
        ].map(([k, v]) => (
          <View key={k} style={s.sumTr}>
            <Text style={s.sumTh}>{k}</Text>
            <Text style={s.sumTd}>{v || '-'}</Text>
          </View>
        ))}
      </View>
      <View style={[s.sellProduct, s.sellMain, mdUp && { flex: 1 }]}>
        <Text style={s.sumBrand}>Looking to sell a watch?</Text>
        <Text style={s.sumSub}>Sell it yourself</Text>
        {['Create a free listing', 'Get the best price', '6.5% commission fee'].map((t) => (
          <View key={t} style={s.li}>
            <Icon name="circle-check" size={16} color={Palette.success} />
            <Text style={s.liText}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── .listingStatus pills ───────────────────────────────────────────────────
const STATUS_STYLE: Record<ListingStatus, { label: string; bg: string; fg: string }> = {
  draft: { label: 'In Active', bg: Palette.surfaceMuted, fg: Palette.textSecondary },
  pending: { label: 'Pending', bg: Palette.goldMuted, fg: Palette.goldDark },
  approved: { label: 'Approved', bg: Palette.successBg, fg: Palette.success },
  rejected: { label: 'Rejected', bg: Palette.errorBg, fg: Palette.error },
};

export function StatusPill({ status, label }: { status: ListingStatus; label?: string }) {
  const st = STATUS_STYLE[status];
  return (
    <View style={[s.pill, { backgroundColor: st.bg }]}>
      <Text style={[s.pillText, { color: st.fg }]}>{label ?? st.label}</Text>
    </View>
  );
}

/** Shorthand used by the forms: required-field message in the backend's wording. */
export const required = (field: string) => `The ${field} field is required.`;

export function missing<T extends Record<string, any>>(l: T, fields: [keyof T, string][]) {
  const e: Record<string, string> = {};
  fields.forEach(([k, label]) => {
    if (!String(l[k] ?? '').trim()) e[k as string] = required(label);
  });
  return e;
}

export const listingSummary = (l: Listing) => ({
  brand: l.brand,
  model: l.model,
  reference: l.reference,
  caseMaterial: l.caseMaterial,
  dialColor: l.dialColor,
  year: l.year,
  image: l.images[0] ?? null,
});

const s = StyleSheet.create({
  steps: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginBottom: Spacing['2xl'], width: '100%' },
  // items share the width (max 96px each) so all five fit on a phone
  stepItem: { alignItems: 'center', flex: 1, maxWidth: 96, minWidth: 0, position: 'relative' },
  stepLine: { position: 'absolute', top: 9, right: '50%', width: '100%', height: 2, backgroundColor: Palette.borderMedium },
  stepLineOn: { backgroundColor: Palette.secondary },
  dot: {
    zIndex: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Palette.borderMedium,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { borderColor: Palette.secondary },
  dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Palette.secondary },
  stepLabel: { marginTop: 8, color: Palette.textMuted, fontSize: 11, fontWeight: FontWeights.medium },
  stepLabelOn: { color: Palette.primary, fontWeight: FontWeights.semibold },

  panel: { backgroundColor: Palette.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.borderSoft, overflow: 'hidden' },
  panelHeader: { backgroundColor: Palette.surfaceIce, padding: Spacing.xl, borderBottomWidth: 1, borderBottomColor: Palette.borderSoft },
  h5: { color: Palette.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  headerP: { marginTop: 4, color: Palette.textSecondary, fontSize: FontSizes.sm },
  panelBody: { padding: Spacing.xl },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderMedium,
    borderRadius: Radius.pill,
  },
  searchInput: { flex: 1, height: '100%', color: Palette.textBody, fontSize: FontSizes.sm, outlineStyle: 'none' } as any,

  clock: {
    backgroundColor: Palette.white,
    borderWidth: 4,
    borderColor: Palette.primary,
    position: 'relative',
  },
  tick: { position: 'absolute', top: 4, width: 3, borderRadius: 2, backgroundColor: Palette.borderStrong },
  pin: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: Palette.secondary },
  clockText: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },

  upload: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 170,
    padding: Spacing.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Palette.borderMedium,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceSubtle,
    gap: 6,
  },
  uploadIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: Palette.goldMuted, alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  uploadHint: { color: Palette.textMuted, fontSize: FontSizes.xs },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 6 },
  thumb: { borderRadius: Radius.md, borderWidth: 1, borderColor: Palette.borderSoft, backgroundColor: Palette.surfaceSubtle },
  remove: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: Palette.white, fontSize: 18, lineHeight: 20, fontWeight: FontWeights.bold },

  summaryRow: { flexDirection: 'row', gap: Spacing.xl },
  sellProduct: { backgroundColor: Palette.white, borderWidth: 1, borderColor: Palette.borderSoft, borderRadius: Radius.lg, padding: Spacing.xl },
  sellMain: { backgroundColor: Palette.surfaceIce, justifyContent: 'center' },
  imgProduct: {
    height: 220,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  sumBrand: { color: Palette.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semibold },
  sumSub: { color: Palette.textSecondary, fontSize: FontSizes.md, marginTop: 4, marginBottom: Spacing.md },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 4, marginBottom: Spacing.md },
  sumModel: { color: Palette.textBody, fontSize: FontSizes.md },
  sumRef: { color: Palette.secondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  sumTr: { flexDirection: 'row', paddingVertical: 8, borderTopWidth: 1, borderTopColor: Palette.divider },
  sumTh: { width: 110, color: Palette.textSecondary, fontSize: FontSizes.sm },
  sumTd: { flex: 1, color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  li: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  liText: { color: Palette.textBody, fontSize: FontSizes.md },

  pill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.pill },
  pillText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold },
});
