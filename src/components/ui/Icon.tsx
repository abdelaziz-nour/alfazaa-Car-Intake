import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

// Simple text-based icons until we add a proper icon library
const iconMap: Record<string, string> = {
  // Navigation
  menu: '☰',
  back: '←',
  next: '→',
  close: '×',
  
  // Actions
  search: '🔍',
  filter: '⚙',
  download: '⬇',
  share: '↗',
  print: '🖨',
  
  // Status
  check: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
  
  // Vehicle
  car: '🚗',
  damage: '⚠',
  
  // Forms
  user: '👤',
  phone: '📞',
  calendar: '📅',
  edit: '✏',
  signature: '✍',
  
  // Common
  add: '+',
  remove: '-',
  expand: '▼',
  collapse: '▲',
};

export default function Icon({ name, size = 'md', color }: IconProps) {
  const iconText = iconMap[name] || '?';
  
  return (
    <Text style={[
      styles.base,
      styles[size],
      color && { color }
    ]}>
      {iconText}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    textAlign: 'center',
    color: theme.colors.neutral[600],
  },
  sm: {
    fontSize: 14,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 20,
  },
  xl: {
    fontSize: 24,
  },
}); 