import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { IntakeRecord } from '../types';

export default function IntakeDetailsScreen() {
  const route = useRoute<RouteProp<any, any>>();
  const record: IntakeRecord = route.params?.record;

  if (!record) {
    return (
      <View style={styles.centered}><Text>No record found.</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.company}>AL-FAZAA</Text>
        <Text style={styles.title}>Intake Details</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Driver Information</Text>
        <Text style={styles.label}>Name: <Text style={styles.value}>{record.driverName}</Text></Text>
        <Text style={styles.label}>ID: <Text style={styles.value}>{record.driverId}</Text></Text>

        <Text style={styles.sectionTitle}>Customer Information</Text>
        <Text style={styles.label}>Name: <Text style={styles.value}>{record.customerName}</Text></Text>
        <Text style={styles.label}>Phone: <Text style={styles.value}>{record.customerPhone}</Text></Text>

        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <Text style={styles.label}>Plate: <Text style={styles.value}>{record.vehiclePlate}</Text></Text>
        <Text style={styles.label}>Color: <Text style={styles.value}>{record.vehicleColor}</Text></Text>
        <Text style={styles.label}>Type: <Text style={styles.value}>{record.vehicleType}</Text></Text>

        <Text style={styles.sectionTitle}>Damages</Text>
        {record.damageNotes && record.damageNotes.length ? (
          <View style={{ marginLeft: 10, marginBottom: 8 }}>
            {record.damageNotes.map((d, i) => (
              <Text key={i} style={styles.bullet}>• {d.part}: {d.damage}</Text>
            ))}
          </View>
        ) : (
          <Text style={styles.value}>None</Text>
        )}

        <Text style={styles.sectionTitle}>General Comments</Text>
        <Text style={styles.value}>{record.generalComments || 'None'}</Text>

        <Text style={styles.sectionTitle}>Signature</Text>
        <Text style={styles.value}>{record.signature ? 'Signed' : 'Not signed'}</Text>

        <Text style={styles.sectionTitle}>Date</Text>
        <Text style={styles.value}>{new Date(record.createdAt).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  company: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#767c28',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cf2b24',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    margin: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#767c28',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#cf2b24',
    marginBottom: 2,
  },
  value: {
    color: '#333',
    fontWeight: 'normal',
  },
  bullet: {
    color: '#333',
    fontSize: 15,
    marginBottom: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
}); 