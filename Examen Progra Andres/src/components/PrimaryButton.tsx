import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
};

const backgroundByVariant: Record<Variant, string> = {
  primary: colors.primary,
  secondary: colors.secondary,
  danger: colors.danger,
  outline: 'transparent',
};

export function PrimaryButton({ title, onPress, variant = 'primary', loading, disabled, style, testID }: Props) {
  const isDisabled = disabled || loading;
  const isOutline = variant === 'outline';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: backgroundByVariant[variant] },
        isOutline && styles.outline,
        (pressed || isDisabled) && styles.dimmed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dimmed: {
    opacity: 0.7,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
  },
});
