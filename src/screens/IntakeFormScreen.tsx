import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useVehicle } from '../context/VehicleContext';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../types';
import { theme } from '../styles/theme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';

interface IntakeFormScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakeForm'>;
}

interface FormErrors {
  driverName?: string;
  driverId?: string;
  customerName?: string;
  customerPhone?: string;
  vehiclePlate?: string;
  vehicleColor?: string;
  vehicleType?: string;
}

export default function IntakeFormScreen({ navigation }: IntakeFormScreenProps) {
  const { state, dispatch } = useVehicle();
  const [errors, setErrors] = useState<FormErrors>({});
  const vehicleTypes = ['Sedan', 'SUV', 'Pickup', 'Van', 'Truck', 'Other'];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!state.driverName.trim())
      newErrors.driverName = 'Driver name is required';
    if (!state.driverId.trim()) {
      newErrors.driverId = 'Driver ID is required';
    } else if (!/^\d{11}$/.test(state.driverId)) {
      newErrors.driverId = 'Driver ID must be exactly 11 digits';
    }
    if (!state.customerName.trim())
      newErrors.customerName = 'Customer name is required';
    if (!state.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\d{8}$/.test(state.customerPhone)) {
      newErrors.customerPhone = 'Phone number must be exactly 8 digits';
    }
    if (!state.vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'Vehicle plate is required';
    } else if (!/^\d{1,7}$/.test(state.vehiclePlate)) {
      newErrors.vehiclePlate = 'Plate must be numbers only, max 7 digits';
    }
    if (!state.vehicleColor.trim())
      newErrors.vehicleColor = 'Vehicle color is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate('VehicleBody');
    } else {
      Alert.alert(
        'Validation Error',
        'Please fill in all required fields correctly.',
      );
    }
  };

  const updateField = (field: keyof FormErrors, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary[500]} barStyle="light-content" />
      
      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Vehicle Intake Form</Text>
            <Text style={styles.subtitle}>Please fill in all required information</Text>
          </View>

          <View style={styles.content}>
            {/* Driver Information */}
            <Card variant="elevated" style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="user" size="md" color={theme.colors.primary[500]} />
                <Text style={styles.sectionTitle}>Driver Information</Text>
              </View>

              <Input
                label="Driver Name"
                required
                value={state.driverName}
                onChangeText={value => updateField('driverName', value)}
                placeholder="Enter driver name"
                error={errors.driverName}
                leftIcon={<Icon name="user" size="sm" color={theme.colors.neutral[400]} />}
              />

              <Input
                label="Driver ID"
                required
                value={state.driverId}
                onChangeText={value => updateField('driverId', value)}
                placeholder="Enter 11-digit driver ID"
                error={errors.driverId}
                keyboardType="phone-pad"
                maxLength={11}
                leftIcon={<Text style={styles.idIcon}>ID</Text>}
                
              />
            </Card>

            {/* Customer Information */}
            <Card variant="elevated" style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="user" size="md" color={theme.colors.secondary[600]} />
                <Text style={styles.sectionTitle}>Customer Information</Text>
              </View>

              <Input
                label="Customer Name"
                required
                value={state.customerName}
                onChangeText={value => updateField('customerName', value)}
                placeholder="Enter customer name"
                error={errors.customerName}
                leftIcon={<Icon name="user" size="sm" color={theme.colors.neutral[400]} />}
              />

              <Input
                label="Phone Number"
                required
                value={state.customerPhone}
                onChangeText={value => updateField('customerPhone', value)}
                placeholder="Enter 8-digit phone number"
                error={errors.customerPhone}
                keyboardType="phone-pad"
                maxLength={8}
                leftIcon={<Icon name="phone" size="sm" color={theme.colors.neutral[400]} />}
              />
            </Card>

            {/* Vehicle Information */}
            <Card variant="elevated" style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="car" size="md" color={theme.colors.info[500]} />
                <Text style={styles.sectionTitle}>Vehicle Information</Text>
              </View>

              <Input
                label="Vehicle Plate Number"
                required
                value={state.vehiclePlate}
                onChangeText={value => updateField('vehiclePlate', value.toUpperCase())}
                placeholder="Enter plate number"
                error={errors.vehiclePlate}
                autoCapitalize="characters"
                maxLength={7}
                keyboardType="numeric"
              />

              <Input
                label="Vehicle Color"
                required
                value={state.vehicleColor}
                onChangeText={value => updateField('vehicleColor', value)}
                placeholder="Enter vehicle color"
                error={errors.vehicleColor}
              />

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Type <Text style={styles.required}>*</Text></Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={state.vehicleType}
                    onValueChange={value => updateField('vehicleType', value)}
                    style={styles.picker}
                  >
                    {vehicleTypes.map((type: string) => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
              </View>
            </Card>

            <View style={styles.buttonContainer}>
              <Button
                title="Continue to Vehicle Inspection"
                onPress={handleNext}
                fullWidth
                rightIcon={<Icon name="next" size="md" color="#ffffff" />}
                size="lg"
              />
            </View>

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  
  flex1: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing['3xl'],
    borderBottomLeftRadius: theme.borderRadius['2xl'],
    borderBottomRightRadius: theme.borderRadius['2xl'],
    ...theme.shadows.lg,
  },
  
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700' as const,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing['2xl'],
  },
  
  section: {
    marginBottom: theme.spacing['2xl'],
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600' as const,
    color: theme.colors.neutral[800],
    marginLeft: theme.spacing.md,
  },
  
  inputGroup: {
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
  
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  
  picker: {
    height: 55,
  },
  
  idIcon: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.colors.neutral[400],
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  buttonContainer: {
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.xl,
  },
  
  bottomPadding: {
    height: theme.spacing['4xl'],
  },
});
