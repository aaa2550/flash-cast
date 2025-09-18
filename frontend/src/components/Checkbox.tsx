import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '@constants';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  checkboxStyle?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  size = 'medium',
  style,
  labelStyle,
  checkboxStyle,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const checkboxSize = getSize();

  const getCheckboxStyle = (): ViewStyle => ({
    width: checkboxSize,
    height: checkboxSize,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 2,
    borderColor: checked ? COLORS.PRIMARY : COLORS.BORDER,
    backgroundColor: checked ? COLORS.PRIMARY : COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: label ? SPACING.XS : 0,
    ...checkboxStyle,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: size === 'small' ? FONT_SIZES.SM : FONT_SIZES.BASE,
    color: disabled ? COLORS.GRAY_500 : COLORS.TEXT_PRIMARY,
    flex: 1,
    ...labelStyle,
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, getCheckboxStyle()]}>
        {checked && (
          <Text style={[styles.checkmark, { fontSize: checkboxSize * 0.7 }]}>
            ✓
          </Text>
        )}
      </View>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.XS,
  },
  checkbox: {
    // 样式在 getCheckboxStyle 中动态生成
  },
  checkmark: {
    color: COLORS.WHITE,
    fontWeight: FONT_WEIGHTS.BOLD,
    textAlign: 'center',
  },
});