import React, { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { Palette, Radius, FontSizes, FontWeights, Spacing } from '@/constants/theme';

interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  value = '',
  onChange,
  onComplete,
}) => {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = new Array(length).fill('');
    for (let i = 0; i < Math.min(value.length, length); i++) {
      arr[i] = value[i];
    }
    return arr;
  });
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      // Handle paste of multiple characters
      if (text.length > 1) {
        const pasted = text.replace(/[^0-9]/g, '').slice(0, length);
        const newDigits = [...digits];
        for (let i = 0; i < pasted.length; i++) {
          newDigits[i] = pasted[i];
        }
        setDigits(newDigits);
        const code = newDigits.join('');
        onChange?.(code);
        if (code.length === length) {
          onComplete?.(code);
        }
        const nextIdx = Math.min(pasted.length, length - 1);
        inputsRef.current[nextIdx]?.focus();
        return;
      }

      const digit = text.replace(/[^0-9]/g, '');
      const newDigits = [...digits];
      newDigits[index] = digit;
      setDigits(newDigits);

      const code = newDigits.join('');
      onChange?.(code);

      if (digit && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (digit && index === length - 1 && code.length === length) {
        onComplete?.(code);
      }
    },
    [digits, length, onChange, onComplete],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputsRef.current[index - 1]?.focus();
        onChange?.(newDigits.join(''));
      }
    },
    [digits, onChange],
  );

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = !!digits[index];

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputsRef.current[index] = ref;
            }}
            style={[
              styles.box,
              isFocused && styles.boxFocused,
              hasValue && styles.boxFilled,
            ]}
            value={digits[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1}
            textAlign="center"
            selectTextOnFocus
            selectionColor={Palette.primary}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  box: {
    width: 54,
    height: 54,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.loginBack,
    backgroundColor: Palette.white,
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: Palette.primary,
  },
  boxFocused: {
    borderColor: Palette.primary,
    borderWidth: 2,
    backgroundColor: Palette.white,
  },
  boxFilled: {
    borderColor: Palette.primary,
  },
});

export default OtpInput;
