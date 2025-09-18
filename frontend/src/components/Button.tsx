import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...getSizeStyle(),
      ...getVariantStyle(),
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: SPACING.SM,
          paddingVertical: SPACING.XS,
          minHeight: 32,
        };
      case 'large':
        return {
          paddingHorizontal: SPACING.XL,
          paddingVertical: SPACING.BASE,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: SPACING.LG,
          paddingVertical: SPACING.SM,
          minHeight: 44,
        };
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.SECONDARY,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.PRIMARY,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          ...SHADOWS.NONE,
        };
      default:
        return {
          backgroundColor: COLORS.PRIMARY,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...getTextSizeStyle(),
      ...getTextVariantStyle(),
    };

    return baseTextStyle;
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: FONT_SIZES.SM };
      case 'large':
        return { fontSize: FONT_SIZES.LG };
      default:
        return { fontSize: FONT_SIZES.BASE };
    }
  };

  const getTextVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'outline':
        return { color: COLORS.PRIMARY };
      case 'text':
        return { color: COLORS.PRIMARY };
      default:
        return { color: COLORS.TEXT_WHITE };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? COLORS.PRIMARY : COLORS.WHITE}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.BASE,
    ...SHADOWS.SM,
  },
  text: {
    fontWeight: FONT_WEIGHTS.MEDIUM,
    textAlign: 'center',
  },
});