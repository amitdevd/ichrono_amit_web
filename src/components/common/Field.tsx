import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Palette, Radius, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import Icon from './Icon';

/**
 * Bootstrap `.form-group > label.form-label + input.form-control` with
 * optional required asterisk, password eye toggle, right-side addon
 * (e.g. dealer "Verify" tag / GPS button) and validation text.
 */
type Props = {
  label?: string;
  required?: boolean;
  value: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  error?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** visual variant: "admin" uses 8px radius grey border, "dealer" taller inputs */
  variant?: 'default' | 'dealer';
};

export default function Field({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  error,
  secure,
  keyboardType,
  editable = true,
  multiline,
  rows = 3,
  maxLength,
  right,
  style,
  autoCapitalize = 'none',
  variant = 'default',
}: Props) {
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);
  const height = multiline ? rows * 24 + 20 : variant === 'dealer' ? 50 : 46;

  return (
    <View style={[styles.group, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.req}> *</Text> : null}
        </Text>
      ) : null}
      <View
        style={[
          styles.box,
          { height, minHeight: height },
          focused && styles.focused,
          !!error && styles.errorBorder,
          !editable && styles.readonly,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Palette.loginBack}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            multiline && styles.multiline,
            // remove default web outline
            { outlineStyle: 'none' } as any,
          ]}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} style={styles.eye}>
            <Icon name={hidden ? 'eye-slash' : 'eye'} size={16} color={Palette.loginBack} />
          </Pressable>
        ) : null}
        {right}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Text style={styles.label}>
      {children}
      {required ? <Text style={styles.req}> *</Text> : null}
    </Text>
  );
}

export function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <Text style={styles.error}>{children}</Text>;
}

const styles = StyleSheet.create({
  group: {
    marginBottom: Spacing.lg,
  },
  label: {
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: 6,
  },
  req: {
    color: Palette.error,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.loginBack,
    borderRadius: Radius.md,
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.md,
  },
  focused: {
    borderColor: Palette.primary,
  },
  errorBorder: {
    borderColor: Palette.error,
  },
  readonly: {
    backgroundColor: '#F1F4F6',
  },
  input: {
    flex: 1,
    height: '100%',
    color: Palette.textBody,
    fontSize: FontSizes.sm,
  },
  multiline: {
    paddingVertical: Spacing.sm,
    textAlignVertical: 'top',
  },
  eye: {
    paddingLeft: Spacing.sm,
  },
  error: {
    color: Palette.error,
    fontSize: FontSizes.xs,
    marginTop: 4,
  },
});
