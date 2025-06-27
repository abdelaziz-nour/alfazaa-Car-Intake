import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused ? styles.inputContainerFocused : {},
    error ? styles.inputContainerError : {},
    leftIcon ? styles.inputContainerWithLeftIcon : {},
    rightIcon ? styles.inputContainerWithRightIcon : {},
  ].filter(Boolean);

  const inputStyle = [
    styles.input,
    leftIcon ? styles.inputWithLeftIcon : {},
    rightIcon ? styles.inputWithRightIcon : {},
    style,
  ].filter(Boolean);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.neutral[400]}
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500' as const,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.sm,
  },
  
  required: {
    color: theme.colors.error[500],
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  
  inputContainerFocused: {
    borderColor: theme.colors.primary[500],
    borderWidth: 2,
    ...theme.shadows.md,
  },
  
  inputContainerError: {
    borderColor: theme.colors.error[500],
  },
  
  inputContainerWithLeftIcon: {
    paddingLeft: theme.spacing.lg,
  },
  
  inputContainerWithRightIcon: {
    paddingRight: theme.spacing.lg,
  },
  
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[900],
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 48,
  },
  
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.sm,
  },
  
  inputWithRightIcon: {
    paddingRight: theme.spacing.sm,
  },
  
  leftIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  rightIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  
  errorText: {
    color: theme.colors.error[500],
  },
}); 