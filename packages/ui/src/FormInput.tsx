import React, { useRef, useState, useCallback } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
} from 'react-native';
import {
  Palette,
  Spacing,
  Radius,
  FontSizes,
  FontWeights,
  Durations,
} from '@ichrono/theme';

interface FormInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: string;
  leftAddon?: string;
  editable?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  leftIcon,
  leftAddon,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureHidden, setIsSecureHidden] = useState(secureTextEntry);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: Durations.normal,
      useNativeDriver: false,
    }).start();
  }, [focusAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: Durations.normal,
      useNativeDriver: false,
    }).start();
  }, [focusAnim]);

  const borderColor = error
    ? Palette.error
    : focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Palette.loginBack, Palette.primary],
      });

  const toggleSecure = useCallback(() => {
    setIsSecureHidden((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor },
          !editable && styles.inputDisabled,
        ]}
      >
        {leftAddon ? (
          <View style={styles.leftAddonContainer}>
            <Text style={styles.leftAddonText}>{leftAddon}</Text>
            <View style={styles.addonDivider} />
          </View>
        ) : null}

        {leftIcon ? <Text style={styles.leftIcon}>{leftIcon}</Text> : null}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithIcon : null,
            secureTextEntry ? styles.inputWithToggle : null,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Palette.loginBack}
          secureTextEntry={isSecureHidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Palette.primary}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={toggleSecure}
            style={styles.eyeToggle}
            hitSlop={8}
          >
            <Text style={styles.eyeIcon}>
              {isSecureHidden ? '👁️' : '🙈'}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderRadius: Radius.md,
    height: 46,
    overflow: 'hidden',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  leftAddonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
    height: '100%',
  },
  leftAddonText: {
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.sm,
  },
  addonDivider: {
    width: 1,
    height: 24,
    backgroundColor: Palette.borderLight,
    marginRight: Spacing.sm,
  },
  leftIcon: {
    fontSize: FontSizes.md,
    paddingLeft: Spacing.md,
  },
  input: {
    flex: 1,
    color: Palette.textBody,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    paddingHorizontal: Spacing.md,
    height: 46,
  } as TextStyle,
  inputWithIcon: {
    paddingLeft: Spacing.xs,
  },
  inputWithToggle: {
    paddingRight: Spacing.xs,
  },
  eyeToggle: {
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
  },
  eyeIcon: {
    fontSize: FontSizes.md,
  },
  errorText: {
    color: Palette.error,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xxs,
  },
});

export default FormInput;
