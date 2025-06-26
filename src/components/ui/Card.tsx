import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../styles/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Card({
  variant = 'default',
  padding = 'lg',
  children,
  style,
  ...props
}: CardProps) {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none': return styles.paddingNone;
      case 'sm': return styles.paddingSm;
      case 'md': return styles.paddingMd;
      case 'lg': return styles.paddingLg;
      default: return styles.paddingLg;
    }
  };

  const cardStyle = [
    styles.base,
    styles[variant],
    getPaddingStyle(),
    style,
  ].filter(Boolean);

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.background,
  },
  
  // Variants
  default: {
    ...theme.shadows.sm,
  },
  elevated: {
    ...theme.shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  
  // Padding
  paddingNone: {
    padding: 0,
  },
  paddingSm: {
    padding: theme.spacing.md,
  },
  paddingMd: {
    padding: theme.spacing.lg,
  },
  paddingLg: {
    padding: theme.spacing.xl,
  },
}); 