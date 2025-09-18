import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '@constants';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showPasswordToggle?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showPasswordToggle = false,
  style,
  inputStyle,
  autoCapitalize = 'none',
  autoCorrect = false,
  onBlur,
  onFocus,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = (): ViewStyle => {
    return [
      styles.container,
      style,
    ];
  };

  const getInputContainerStyle = (): ViewStyle => {
    return [
      styles.inputContainer,
      isFocused && styles.inputContainerFocused,
      error && styles.inputContainerError,
      disabled && styles.inputContainerDisabled,
    ];
  };

  const getInputStyle = (): TextStyle => {
    return [
      styles.input,
      multiline && styles.inputMultiline,
      disabled && styles.inputDisabled,
      inputStyle,
    ];
  };

  return (
    <View style={getContainerStyle()}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={COLORS.GRAY_500}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
          >
            <Text style={styles.passwordToggleText}>
              {isPasswordVisible ? '隐藏' : '显示'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.BASE,
  },
  label: {
    fontSize: FONT_SIZES.SM,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.BASE,
    backgroundColor: COLORS.WHITE,
    minHeight: 44,
  },
  inputContainerFocused: {
    borderColor: COLORS.PRIMARY,
  },
  inputContainerError: {
    borderColor: COLORS.ERROR,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.GRAY_100,
    borderColor: COLORS.GRAY_300,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.BASE,
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.SM,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputDisabled: {
    color: COLORS.GRAY_500,
  },
  passwordToggle: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
  },
  passwordToggleText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
  },
  errorText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
  },
});