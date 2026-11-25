import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@ichrono/theme';
import Icon from './Icon';

/**
 * Bootstrap `.modal.fade > .modal-dialog.modal-dialog-centered` equivalent.
 * Header uses the reference `.modal-header.management` style (teal h2).
 */
type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showClose?: boolean;
  children: React.ReactNode;
  width?: number;
  bodyStyle?: ViewStyle;
  /** Close when the dark backdrop is pressed (Bootstrap default = true) */
  dismissOnBackdrop?: boolean;
};

export default function AppModal({
  visible,
  onClose,
  title,
  showClose = false,
  children,
  width = 500,
  bodyStyle,
  dismissOnBackdrop = true,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdrop ? onClose : undefined}
          accessibilityLabel="Close dialog"
        />
        <View style={[styles.dialog, { maxWidth: width }]}>
          {title || showClose ? (
            <View style={styles.header}>
              {title ? <Text style={styles.title}>{title}</Text> : <View />}
              {showClose ? (
                <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
                  <Icon name="xmark" size={18} color={Palette.textBody} />
                </Pressable>
              ) : null}
            </View>
          ) : null}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.body, bodyStyle]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  dialog: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: {
    flex: 1,
    color: Palette.primary,
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.semibold,
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 0,
  },
  body: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    paddingTop: Spacing.sm,
  },
});
