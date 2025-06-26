import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../styles/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : {},
    disabled ? styles.disabled : {},
  ].filter(Boolean);

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled ? styles.disabledText : {},
  ].filter(Boolean);

  if (style) {
    if (Array.isArray(style)) {
      buttonStyle.push(...(style.filter(Boolean) as ViewStyle[]));
    } else {
      buttonStyle.push(style as ViewStyle);
    }
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {leftIcon && !loading && leftIcon}
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'destructive' ? '#ffffff' : theme.colors.primary[500]} 
          size="small" 
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
      {rightIcon && !loading && rightIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary[500],
  },
  secondary: {
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  destructive: {
    backgroundColor: theme.colors.error[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  sm: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 40,
  },
  md: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 48,
  },
  lg: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing['2xl'],
    minHeight: 56,
  },
  
  // States
  disabled: {
    backgroundColor: theme.colors.neutral[100],
    borderColor: theme.colors.neutral[200],
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.base,
  },
  secondaryText: {
    color: theme.colors.neutral[700],
    fontSize: theme.typography.fontSize.base,
  },
  destructiveText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.base,
  },
  ghostText: {
    color: theme.colors.primary[500],
    fontSize: theme.typography.fontSize.base,
  },
  disabledText: {
    color: theme.colors.neutral[400],
  },
  
  // Size text
  smText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mdText: {
    fontSize: theme.typography.fontSize.base,
  },
  lgText: {
    fontSize: theme.typography.fontSize.lg,
  },
}); 