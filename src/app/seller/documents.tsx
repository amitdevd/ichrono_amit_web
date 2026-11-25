import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights, Radius } from '@/constants/theme';
import SellerSetupFrame from '@/components/user/SellerSetupFrame';
import { useSeller, type SellerDocs } from '@/context/seller';
import { useBreakpoint, Btn, pickImage } from '@ichrono/ui';

/** backend_ref/views/user/profile/add-documents.blade.php (+ edit-documents) */
type K = keyof SellerDocs;
const GROUPS: { label: string; front: K; back: K }[] = [
  { label: 'Upload business registration', front: 'businessFront', back: 'businessBack' },
  { label: 'Upload address proof', front: 'addressFront', back: 'addressBack' },
  { label: 'Identity proof', front: 'identityFront', back: 'identityBack' },
];

export default function SellerDocuments() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const seller = useSeller();
  const { mdUp } = useBreakpoint();
  const [docs, setDocs] = useState<SellerDocs>(seller.docs);
  const [errors, setErrors] = useState<Partial<Record<K, string>>>({});

  const set = (k: K, v: string | null) => {
    setDocs((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const e: Partial<Record<K, string>> = {};
    (Object.keys(docs) as K[]).forEach((k) => {
      if (!docs[k]) e[k] = 'This file is required.';
    });
    setErrors(e);
    if (Object.keys(e).length) return;
    seller.setDocs(docs);
    router.push((edit ? '/seller/review' : '/seller/address') as any);
  };

  return (
    <SellerSetupFrame step="documents" backHref={edit ? '/seller/review' : '/profile'}>
      {GROUPS.map((g) => (
        <View key={g.label} style={{ marginBottom: Spacing.lg }}>
          <Text style={styles.label}>
            {g.label} <Text style={{ color: Palette.error }}>*</Text>
          </Text>
          <View style={[styles.row, !mdUp && { flexDirection: 'column' }]}>
            {([
              [g.front, 'Front Side'],
              [g.back, 'Back Side'],
            ] as [K, string][]).map(([k, side]) => (
              <View key={k} style={{ flex: 1 }}>
                <Pressable
                  onPress={async () => {
                    const u = await pickImage();
                    if (u) set(k, u);
                  }}
                  style={({ hovered }: any) => [styles.upload, hovered && { backgroundColor: Palette.surfaceIce }, !!errors[k] && { borderColor: Palette.error }]}
                >
                  {docs[k] ? (
                    <>
                      <Image source={{ uri: docs[k]! }} style={styles.preview} resizeMode="cover" />
                      <Pressable onPress={() => set(k, null)} style={styles.remove} hitSlop={6} accessibilityLabel="Remove file">
                        <Text style={styles.removeText}>×</Text>
                      </Pressable>
                    </>
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <Image source={require('@/assets/images/upload-icon.webp')} style={{ width: 44, height: 44 }} resizeMode="contain" />
                      <Text style={styles.side}>{side}</Text>
                    </View>
                  )}
                </Pressable>
                {errors[k] ? <Text style={styles.error}>{errors[k]}</Text> : null}
              </View>
            ))}
          </View>
        </View>
      ))}
      <Btn title={edit ? 'Save' : 'Continue'} variant="customBtn3" onPress={submit} style={{ marginTop: Spacing.lg }} />
    </SellerSetupFrame>
  );
}

const styles = StyleSheet.create({
  label: { color: Palette.textBody, fontSize: FontSizes.sm, fontWeight: FontWeights.medium, marginBottom: 8 },
  row: { flexDirection: 'row', gap: Spacing.lg },
  upload: {
    height: 170,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.loginBack,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceSubtle,
    overflow: 'hidden',
  },
  preview: { width: '100%', height: '100%' },
  remove: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: Palette.white, fontSize: 18, lineHeight: 20, fontWeight: FontWeights.bold },
  side: { marginTop: 10, color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 4 },
});
