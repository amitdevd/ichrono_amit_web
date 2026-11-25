import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import { WATCH_PARTS, conditionLabel, formatDate, formatPrice, imageSource, listingTitle, type Listing } from '@/data';
import { AppModal, Icon, useBreakpoint } from '@ichrono/ui';
import { StatusPill } from './ListingUI';

/**
 * Full details of one listing – used by the User Web profile ("Full Details" in the
 * milestone plan) and as the body of the admin "Product Details" page.
 */
export function ListingGallery({ images, height = 260 }: { images: string[]; height?: number }) {
  const [i, setI] = useState(0);
  if (!images.length) {
    return (
      <View style={[styles.gallery, { height, alignItems: 'center', justifyContent: 'center' }]}>
        <Icon name="image" size={48} color={Palette.borderStrong} />
      </View>
    );
  }
  const idx = Math.min(i, images.length - 1);
  return (
    <View>
      <View style={[styles.gallery, { height }]}>
        <Image source={imageSource(images[idx])} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        {images.length > 1 ? (
          <>
            <Pressable onPress={() => setI((idx - 1 + images.length) % images.length)} style={[styles.nav, { left: 8 }]} accessibilityLabel="Previous image">
              <Icon name="chevron-left" size={14} color={Palette.primary} />
            </Pressable>
            <Pressable onPress={() => setI((idx + 1) % images.length)} style={[styles.nav, { right: 8 }]} accessibilityLabel="Next image">
              <Icon name="chevron-right" size={14} color={Palette.primary} />
            </Pressable>
          </>
        ) : null}
      </View>
      {images.length > 1 ? (
        <View style={styles.dots}>
          {images.map((_, j) => (
            <Pressable key={j} onPress={() => setI(j)} style={[styles.dot, j === idx && styles.dotOn]} accessibilityLabel={`Image ${j + 1}`} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function listingRows(l: Listing): [string, string][] {
  return [
    ['Watch name', listingTitle(l)],
    ['Watch price', formatPrice(l.price)],
    ['Year of production', l.year],
    ['Gender', l.gender],
    ['Serial number', l.serial],
    ['Reference number', l.reference],
    ['Category', l.category],
    ['Dial color', l.dialColor],
    ['Case diameter', l.diameterMin ? `${l.diameterMin} - ${l.diameterMax} mm` : ''],
    ['Movement Type', l.movement],
    ['Case material', l.caseMaterial],
    ['Bracelet material', l.braceletMaterial],
    ['Bracelet color', l.braceletColor],
    ['Scope of Delivery', l.scope],
    ['Signs of wear', l.hasWear ? 'Yes' : 'No'],
    ['Condition', WATCH_PARTS.filter((p) => l.conditions[p.key]).map((p) => `${p.label}: ${conditionLabel(l.conditions[p.key])}`).join(' · ')],
    ['Description (optional)', l.description],
  ];
}

export function DetailRows({ rows }: { rows: [string, string][] }) {
  const { mdUp } = useBreakpoint();
  return (
    <View>
      {rows.map(([k, v]) => (
        <View key={k} style={[styles.row, !mdUp && { flexDirection: 'column', gap: 2 }]}>
          <Text style={styles.key}>{k}</Text>
          <Text style={styles.val}>{v || '-'}</Text>
        </View>
      ))}
    </View>
  );
}

export function ListingDetailsModal({ listing, onClose }: { listing: Listing | null; onClose: () => void }) {
  return (
    <AppModal visible={!!listing} onClose={onClose} title="Watch Details" showClose width={720}>
      {listing ? (
        <ScrollView>
          <ListingGallery images={listing.images} height={240} />
          <View style={styles.statusRow}>
            <StatusPill status={listing.status} label={listing.status === 'draft' ? 'Draft' : undefined} />
            <Text style={styles.meta}>Last updated {formatDate(listing.updatedAt)}</Text>
          </View>
          {listing.status === 'rejected' && listing.rejectReason ? (
            <View style={styles.reason}>
              <Icon name="circle-exclamation" size={14} color={Palette.error} />
              <Text style={styles.reasonText}>{listing.rejectReason}</Text>
            </View>
          ) : null}
          <DetailRows rows={listingRows(listing)} />
          {listing.proof.some(Boolean) ? (
            <View style={{ marginTop: Spacing.lg }}>
              <Text style={styles.key}>Proof of ownership</Text>
              <View style={styles.proofRow}>
                {listing.proof.filter(Boolean).map((p, i) => (
                  <Image key={i} source={imageSource(p)} style={styles.proof} resizeMode="cover" />
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  gallery: { borderRadius: Radius.lg, backgroundColor: Palette.surfaceSubtle, overflow: 'hidden', borderWidth: 1, borderColor: Palette.borderSoft },
  nav: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSoft,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.neutralDot },
  dotOn: { backgroundColor: Palette.secondary, width: 22 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.lg, marginBottom: Spacing.sm },
  meta: { color: Palette.textMuted, fontSize: FontSizes.xs },
  reason: { flexDirection: 'row', gap: 8, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Palette.errorBg, marginBottom: Spacing.sm },
  reasonText: { flex: 1, color: Palette.error, fontSize: FontSizes.sm },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Palette.divider },
  key: { width: 190, color: Palette.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.bold },
  val: { flex: 1, color: Palette.textBody, fontSize: FontSizes.sm },
  proofRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  proof: { width: 110, height: 110, borderRadius: Radius.md, borderWidth: 1, borderColor: Palette.borderSoft },
});
