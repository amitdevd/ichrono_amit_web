import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Palette, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { BoxStep, SignupFrame } from '@/components/dealer/DealerFrames';
import { useDealerSignup, type DealerSignupData } from '@/context/dealer-signup';
import { DocumentBox, Btn } from '@ichrono/ui';

/**
 * Dealer Create Account – Step 5: documents upload
 * backend_ref/views/dealer/auth/registrationStepFive.blade.php
 */
type DocKey = keyof DealerSignupData['docs'];

const GROUPS: { title: string; front: DocKey; rear: DocKey }[] = [
  { title: 'Upload business registration', front: 'businessFront', rear: 'businessRear' },
  { title: 'Upload address proof', front: 'addressFront', rear: 'addressRear' },
  { title: 'Upload identity proof', front: 'identityFront', rear: 'identityRear' },
];

export default function DealerStepFive() {
  const { data, update } = useDealerSignup();
  const [errors, setErrors] = useState<Partial<Record<DocKey, string>>>({});

  const setDoc = (k: DocKey, uri: string | null) => {
    update({ docs: { ...data.docs, [k]: uri } });
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const next = () => {
    const e: Partial<Record<DocKey, string>> = {};
    (Object.keys(data.docs) as DocKey[]).forEach((k) => {
      if (!data.docs[k]) e[k] = 'This document is required.';
    });
    setErrors(e);
    if (Object.keys(e).length) return;
    router.push('/dealer/step-six' as any);
  };

  return (
    <SignupFrame step={4}>
      <BoxStep title="Documents" />
      {GROUPS.map((g) => (
        <View key={g.title} style={styles.list}>
          <Text style={styles.h6}>
            {g.title} <Text style={{ color: Palette.error }}>*</Text>
          </Text>
          <View style={styles.row}>
            <DocumentBox uri={data.docs[g.front]} side="Front Page" onChange={(u) => setDoc(g.front, u)} onRemove={() => setDoc(g.front, null)} error={errors[g.front]} />
            <DocumentBox uri={data.docs[g.rear]} side="Rear Page" onChange={(u) => setDoc(g.rear, u)} onRemove={() => setDoc(g.rear, null)} error={errors[g.rear]} />
          </View>
        </View>
      ))}
      <View style={styles.btns}>
        <Btn title="Back" variant="dark" onPress={() => router.replace('/dealer/step-four' as any)} style={{ flex: 1 }} />
        <Btn title="Next" variant="success" onPress={next} style={{ flex: 1 }} />
      </View>
    </SignupFrame>
  );
}

const styles = StyleSheet.create({
  list: { marginBottom: Spacing.xl },
  h6: { color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, marginBottom: Spacing.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.lg },
  btns: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.lg },
});
