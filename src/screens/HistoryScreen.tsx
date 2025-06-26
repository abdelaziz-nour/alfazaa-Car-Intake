import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import DatabaseService from '../services/DatabaseService';
import { IntakeRecord } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function getReportTitle(type: string) {
  if (type === 'today') return 'Today Report';
  if (type === 'week') return 'Past Week Report';
  return 'Full Report';
}

export default function HistoryScreen() {
  const [records, setRecords] = useState<IntakeRecord[]>([]);
  const [filtered, setFiltered] = useState<IntakeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchRecords = async () => {
        try {
          setLoading(true);
          const data = await DatabaseService.getAllRecords();
          if (isActive) {
            setRecords(data);
            setFiltered(data);
          }
        } catch (error) {
          if (isActive) {
            setRecords([]);
            setFiltered([]);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchRecords();
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    let data = [...records];
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(r =>
        r.driverName.toLowerCase().includes(s) ||
        r.customerName.toLowerCase().includes(s) ||
        r.vehiclePlate.toLowerCase().includes(s) ||
        r.vehicleColor.toLowerCase().includes(s) ||
        r.vehicleType.toLowerCase().includes(s) ||
        (r.damageNotes && r.damageNotes.some(d => d.part.toLowerCase().includes(s) || d.damage.toLowerCase().includes(s)))
      );
    }
    if (fromDate) {
      data = data.filter(r => new Date(r.createdAt) >= fromDate);
    }
    if (toDate) {
      data = data.filter(r => new Date(r.createdAt) <= toDate);
    }
    setFiltered(data);
  }, [search, fromDate, toDate, records]);

  function handleShowModal() {
    setShowModal(true);
  }

  async function handleGeneratePDF(type: 'today' | 'week' | 'full') {
    setShowModal(false);
    setGenerating(true);
    let data: IntakeRecord[] = [...records];
    const now = new Date();
    if (type === 'today') {
      const todayStr = formatDate(now);
      data = data.filter(r => r.createdAt.startsWith(todayStr));
    } else if (type === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      data = data.filter(r => new Date(r.createdAt) >= weekAgo);
    }
    if (!data.length) {
      setGenerating(false);
      Alert.alert('No records', 'No records found for this report.');
      return;
    }
    const logoPath = Platform.OS === 'android' ? 'file:///android_asset/logo.png' : `${RNHTMLtoPDF.getDocumentsDirectory()}/logo.png`;
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #222; }
            .header { text-align: center; margin-bottom: 16px; }
            .logo { width: 120px; margin: 0 auto 8px auto; }
            .company { font-size: 22px; font-weight: bold; color: #767c28; }
            .report-title { font-size: 18px; font-weight: bold; margin: 8px 0 16px 0; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
            .table th, .table td { border: 1px solid #767c28; padding: 6px 8px; font-size: 13px; }
            .table th { background: #f5f5f5; color: #767c28; }
            .section { margin-bottom: 18px; }
            .footer { text-align: center; font-size: 12px; color: #888; margin-top: 24px; }
            .damages { margin: 0; padding-left: 18px; }
            .damages li { margin-bottom: 2px; }
            .damage-type { font-weight: bold; color: #cf2b24; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoPath}" class="logo" />
            <div class="company">AL-FAZAA</div>
            <div class="report-title">${getReportTitle(type)}</div>
          </div>
          <table class="table">
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>Customer</th>
              <th>Plate</th>
              <th>Date</th>
              <th>Damages</th>
            </tr>
            ${data.map((rec, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${rec.driverName}</td>
                <td>${rec.customerName}</td>
                <td>${rec.vehiclePlate}</td>
                <td>${new Date(rec.createdAt).toLocaleString()}</td>
                <td>
                  <ul class="damages">
                    ${rec.damageNotes && rec.damageNotes.length ? rec.damageNotes.map(d => `<li>${d.part}: <span class='damage-type'>${d.damage}</span></li>`).join('') : '<li>None</li>'}
                  </ul>
                </td>
              </tr>
            `).join('')}
          </table>
          <div class="footer">
            AL-FAZAA Company &bull; 800-8080<br/>
            Report generated: ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;
    try {
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: `alfazaa_report_${type}_${Date.now()}`,
        base64: false,
        directory: 'Documents',
      });
      setGenerating(false);
      await Share.open({ url: Platform.OS === 'android' ? `file://${file.filePath}` : file.filePath });
    } catch (e) {
      setGenerating(false);
      // Alert.alert('Error', 'Failed to generate PDF.');
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#767c28" /></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intake History</Text>
      <View style={styles.filterRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by any field..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
      <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>From: {fromDate ? formatDate(fromDate) : 'Any'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>To: {toDate ? formatDate(toDate) : 'Any'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pdfBtn} onPress={handleShowModal}>
          <Text style={styles.pdfBtnText}>Download PDF Report</Text>
        </TouchableOpacity>
        </ScrollView>
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Report Type</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleGeneratePDF('today')}>
              <Text style={styles.modalBtnText}>Today Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleGeneratePDF('week')}>
              <Text style={styles.modalBtnText}>Past Week Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleGeneratePDF('full')}>
              <Text style={styles.modalBtnText}>Full Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#eee' }]} onPress={() => setShowModal(false)}>
              <Text style={[styles.modalBtnText, { color: '#888' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {generating && (
        <View style={styles.generatingOverlay}>
          <ActivityIndicator size="large" color="#767c28" />
          <Text style={{ color: '#767c28', marginTop: 10 }}>Generating PDF...</Text>
        </View>
      )}
      <ScrollView>
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No intake records found.</Text>
        )}
        {filtered.map((rec, idx) => {
          const damages = rec.damageNotes || [];
          const isExpanded = expanded[rec.id] || false;
          const showDamages = isExpanded ? damages : damages.slice(0, 3);
          return (
            <TouchableOpacity
              key={rec.id || idx}
              style={styles.card}
              onPress={() => navigation.navigate('IntakeDetails', { record: rec })}
            >
              <View style={styles.row}><Text style={styles.label}>Driver:</Text><Text style={styles.value}>{rec.driverName}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Customer:</Text><Text style={styles.value}>{rec.customerName}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Plate:</Text><Text style={styles.value}>{rec.vehiclePlate}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{new Date(rec.createdAt).toLocaleString()}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Damages:</Text></View>
              <View style={{ marginLeft: 16, marginBottom: 4 }}>
                {showDamages.length ? (
                  showDamages.map((d, i) => (
                    <Text key={i} style={styles.bullet}>
                      • {d.part}: <Text style={styles.damageType}>{d.damage}</Text>
                    </Text>
                  ))
                ) : (
                  <Text style={styles.value}>None</Text>
                )}
                {damages.length > 3 && (
                  <TouchableOpacity onPress={() => setExpanded(e => ({ ...e, [rec.id]: !isExpanded }))}>
                    <Text style={styles.showMore}>{isExpanded ? 'Show less' : `Show more (${damages.length - 3})`}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#767c28',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  dateBtn: {
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  dateBtnText: {
    color: '#767c28',
    fontWeight: 'bold',
    fontSize:10
  },
  pdfBtn: {
    backgroundColor: '#cf2b24',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    fontSize:10

  },
  pdfBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#cf2b24',
    width: 90,
  },
  value: {
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  bullet: {
    color: '#333',
    fontSize: 14,
    marginBottom: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 280,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#767c28',
    marginBottom: 18,
  },
  modalBtn: {
    backgroundColor: '#d2de24',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#767c28',
    fontWeight: 'bold',
    fontSize: 16,
  },
  generatingOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  damageType: {
    fontWeight: 'bold',
    color: '#cf2b24',
  },
  showMore: {
    color: '#767c28',
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 2,
  },
}); 