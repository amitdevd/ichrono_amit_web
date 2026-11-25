import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing, FontSizes } from '@/constants/theme';
import { AppModal, Btn, Icon } from '@ichrono/ui';

/** The admin `#deleteModal` ("Confirm Delete", trash icon, Yes / No) */
export default function ConfirmDeleteModal({
  visible,
  message = 'Confirm Deletes',
  onYes,
  onNo,
}: {
  visible: boolean;
  message?: string;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <AppModal visible={visible} onClose={onNo} title="Confirm Delete">
      <View style={styles.body}>
        <Icon name="trash-can" size={56} color={Palette.primary} />
        <Text style={styles.text}>{message}</Text>
        <View style={styles.btns}>
          <Btn title="Yes" onPress={onYes} />
          <Btn title="No" onPress={onNo} />
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  body: { alignItems: 'center', paddingVertical: Spacing.xl },
  text: { marginTop: Spacing.md, color: Palette.neutralText, fontSize: FontSizes.lg, fontWeight: '500', textAlign: 'center' },
  btns: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: Spacing.xl },
});
