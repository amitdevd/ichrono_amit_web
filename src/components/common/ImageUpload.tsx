import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import Icon from './Icon';

export async function pickImage(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0].uri;
}

/**
 * Admin `.avatar-upload` — round preview with a small pencil button
 * (used in Add/Edit Brand and Add/Edit Category modals).
 */
export function AvatarUpload({ uri, onChange }: { uri: string | null; onChange: (u: string) => void }) {
  return (
    <View style={av.wrap}>
      <View style={av.preview}>
        {uri ? (
          <Image source={{ uri }} style={av.img} resizeMode="cover" />
        ) : (
          <Icon name="image" size={46} color={Palette.loginBack} />
        )}
      </View>
      <Pressable
        style={av.edit}
        onPress={async () => {
          const u = await pickImage();
          if (u) onChange(u);
        }}
        accessibilityLabel="Upload image"
      >
        <Icon name="pen" size={12} color={Palette.primary} />
      </Pressable>
    </View>
  );
}

const av = StyleSheet.create({
  wrap: { alignSelf: 'center', width: 160, height: 160, marginVertical: Spacing.sm },
  preview: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#F8F8F8',
    backgroundColor: '#F1F4F6',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  img: { width: '100%', height: '100%' },
  edit: {
    position: 'absolute',
    right: 10,
    top: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
});

/**
 * Dealer `.document-box` — dashed upload tile with "Upload Document / Front Page"
 * that turns into an image preview with a × remove button.
 */
export function DocumentBox({
  uri,
  side,
  onChange,
  onRemove,
  error,
}: {
  uri: string | null;
  side: string;
  onChange: (u: string) => void;
  onRemove: () => void;
  error?: string;
}) {
  return (
    <View style={{ flex: 1, minWidth: 220 }}>
      <Pressable
        onPress={async () => {
          const u = await pickImage();
          if (u) onChange(u);
        }}
        style={[doc.box, !!error && { borderColor: Palette.error }]}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={doc.preview} resizeMode="cover" />
            <Pressable onPress={onRemove} style={doc.remove} hitSlop={6}>
              <Text style={doc.removeText}>×</Text>
            </Pressable>
          </>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Icon name="cloud-arrow-up" size={30} color={Palette.secondary} />
            <Text style={doc.title}>Upload Document</Text>
            <Text style={doc.side}>{side}</Text>
          </View>
        )}
      </Pressable>
      {error ? <Text style={doc.error}>{error}</Text> : null}
    </View>
  );
}

const doc = StyleSheet.create({
  box: {
    height: 150,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.loginBack,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFCFC',
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
  title: { marginTop: 8, color: Palette.primary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  side: { color: Palette.textSecondary, fontSize: FontSizes.xs, marginTop: 2 },
  error: { color: Palette.error, fontSize: FontSizes.xs, marginTop: 4 },
});
