import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Platform, 
  Modal, 
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import DatabaseService from '../services/DatabaseService';
import { IntakeRecord } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { theme } from '../styles/theme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';

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
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const navigation = useNavigation();

  const fetchRecords = async () => {
    try {
      const data = await DatabaseService.getAllRecords();
      setRecords(data);
      setFiltered(data);
    } catch (error) {
      setRecords([]);
      setFiltered([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecords();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadRecords = async () => {
        try {
          setLoading(true);
          await fetchRecords();
        } finally {
          if (isActive) setLoading(false);
        }
      };
      loadRecords();
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

  const clearFilters = () => {
    setSearch('');
    setFromDate(null);
    setToDate(null);
  };

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
            .table th { background: #f7f9f0; color: #767c28; }
            .section { margin-bottom: 18px; }
            .footer { text-align: center; font-size: 12px; color: #888; margin-top: 24px; }
            .damages { margin: 0; padding-left: 18px; }
            .damages li { margin-bottom: 2px; }
            .damage-type { font-weight: bold; color: #ef4444; }
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
    }
  }

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={styles.loadingText}>Loading records...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary[500]} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Intake History</Text>
        <Text style={styles.subtitle}>
          {filtered.length} of {records.length} records
        </Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Search by any field..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Icon name="search" size="md" color={theme.colors.neutral[400]} />}
          containerStyle={styles.searchInput}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateBtn}>
            <Icon name="calendar" size="sm" color={theme.colors.neutral[600]} />
            <Text style={styles.dateBtnText}>
              From: {fromDate ? formatDate(fromDate) : 'Any'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateBtn}>
            <Icon name="calendar" size="sm" color={theme.colors.neutral[600]} />
            <Text style={styles.dateBtnText}>
              To: {toDate ? formatDate(toDate) : 'Any'}
            </Text>
          </TouchableOpacity>
          
          {(search || fromDate || toDate) && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
              <Icon name="close" size="sm" color={theme.colors.error[500]} />
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.pdfBtn} onPress={() => setShowModal(true)}>
            <Icon name="download" size="sm" color="#ffffff" />
            <Text style={styles.pdfBtnText}>Reports</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Records List */}
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {filtered.length === 0 && (
            <Card style={styles.emptyCard}>
              <Icon name="search" size="xl" color={theme.colors.neutral[300]} />
              <Text style={styles.emptyTitle}>No records found</Text>
              <Text style={styles.emptyText}>
                {records.length === 0 
                  ? "No intake records have been created yet." 
                  : "Try adjusting your search or filter criteria."
                }
              </Text>
            </Card>
          )}
          
          {filtered.map((rec, idx) => {
            const damages = rec.damageNotes || [];
            const isExpanded = expanded[rec.id] || false;
            const showDamages = isExpanded ? damages : damages.slice(0, 2);
            
            return (
              <Card key={rec.id || idx} style={styles.recordCard}>
                                 <TouchableOpacity 
                   onPress={() => (navigation as any).navigate('IntakeDetails', { record: rec })}
                   activeOpacity={0.7}
                 >
                  {/* Record Header */}
                  <View style={styles.recordHeader}>
                    <View style={styles.recordHeaderLeft}>
                      <Text style={styles.plateNumber}>{rec.vehiclePlate}</Text>
                      <Text style={styles.vehicleInfo}>
                        {rec.vehicleType} • {rec.vehicleColor}
                      </Text>
                    </View>
                    <View style={styles.recordHeaderRight}>
                      <Text style={styles.dateText}>
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </Text>
                      <Text style={styles.timeText}>
                        {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>

                  {/* Record Details */}
                  <View style={styles.recordDetails}>
                    <View style={styles.detailRow}>
                      <Icon name="user" size="sm" color={theme.colors.neutral[400]} />
                      <Text style={styles.detailLabel}>Driver:</Text>
                      <Text style={styles.detailValue}>{rec.driverName}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Icon name="user" size="sm" color={theme.colors.neutral[400]} />
                      <Text style={styles.detailLabel}>Customer:</Text>
                      <Text style={styles.detailValue}>{rec.customerName}</Text>
                    </View>
                  </View>

                  {/* Damages Section */}
                  {damages.length > 0 && (
                    <View style={styles.damagesSection}>
                      <View style={styles.damagesHeader}>
                        <Icon name="warning" size="sm" color={theme.colors.error[500]} />
                        <Text style={styles.damagesTitle}>
                          Damages ({damages.length})
                        </Text>
                      </View>
                      
                      <View style={styles.damagesList}>
                        {showDamages.map((d, i) => (
                          <View key={i} style={styles.damageItem}>
                            <Text style={styles.damagePart}>{d.part}</Text>
                            <Text style={styles.damageType}>{d.damage}</Text>
                          </View>
                        ))}
                        
                        {damages.length > 2 && (
                          <TouchableOpacity 
                            onPress={() => toggleExpanded(rec.id)}
                            style={styles.showMoreBtn}
                          >
                            <Text style={styles.showMoreText}>
                              {isExpanded ? 'Show less' : `Show ${damages.length - 2} more`}
                            </Text>
                            <Icon 
                              name={isExpanded ? 'collapse' : 'expand'} 
                              size="sm" 
                              color={theme.colors.primary[500]} 
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </Card>
            );
          })}
          
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Date Pickers */}
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

      {/* Report Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Generate Report</Text>
            <Text style={styles.modalSubtitle}>Choose the type of report to generate</Text>
            
            <Button
              title="Today's Report"
              variant="secondary"
              onPress={() => handleGeneratePDF('today')}
              style={styles.modalBtn}
              leftIcon={<Icon name="calendar" size="md" color={theme.colors.neutral[700]} />}
            />
            
            <Button
              title="Past Week Report"
              variant="secondary"
              onPress={() => handleGeneratePDF('week')}
              style={styles.modalBtn}
              leftIcon={<Icon name="calendar" size="md" color={theme.colors.neutral[700]} />}
            />
            
            <Button
              title="Full Report"
              variant="secondary"
              onPress={() => handleGeneratePDF('full')}
              style={styles.modalBtn}
              leftIcon={<Icon name="download" size="md" color={theme.colors.neutral[700]} />}
            />
            
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setShowModal(false)}
              style={styles.modalCancelBtn}
            />
          </Card>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {generating && (
        <View style={styles.generatingOverlay}>
          <Card style={styles.generatingCard}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
            <Text style={styles.generatingText}>Generating PDF...</Text>
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[600],
  },
  
  header: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['2xl'],
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
  },
  
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700' as const,
    color: '#ffffff',
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  
  filtersContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  
  searchInput: {
    marginBottom: theme.spacing.md,
  },
  
  filterRow: {
    flexDirection: 'row',
  },
  
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  
  dateBtnText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[700],
    fontWeight: '500' as const,
  },
  
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error[50],
    borderWidth: 1,
    borderColor: theme.colors.error[200],
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  
  clearBtnText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[600],
    fontWeight: '500' as const,
  },
  
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  
  pdfBtnText: {
    fontSize: theme.typography.fontSize.sm,
    color: '#ffffff',
    fontWeight: '600' as const,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: theme.spacing.lg,
  },
  
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.neutral[700],
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
  },
  
  recordCard: {
    marginBottom: theme.spacing.lg,
  },
  
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  
  recordHeaderLeft: {
    flex: 1,
  },
  
  plateNumber: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700' as const,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.xs,
  },
  
  vehicleInfo: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: '500' as const,
  },
  
  recordHeaderRight: {
    alignItems: 'flex-end',
  },
  
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: theme.colors.primary[600],
  },
  
  timeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
  
  recordDetails: {
    marginBottom: theme.spacing.lg,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500' as const,
    color: theme.colors.neutral[600],
    minWidth: 70,
  },
  
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[900],
    flex: 1,
  },
  
  damagesSection: {
    backgroundColor: theme.colors.error[50],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error[500],
  },
  
  damagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  
  damagesTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: theme.colors.error[700],
  },
  
  damagesList: {
    gap: theme.spacing.sm,
  },
  
  damageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  
  damagePart: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[700],
    flex: 1,
  },
  
  damageType: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: theme.colors.error[600],
  },
  
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  
  showMoreText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500' as const,
    color: theme.colors.primary[600],
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
  
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700' as const,
    color: theme.colors.neutral[900],
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  modalSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  modalBtn: {
    marginBottom: theme.spacing.md,
  },
  
  modalCancelBtn: {
    marginTop: theme.spacing.sm,
  },
  
  generatingOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  generatingCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing['3xl'],
  },
  
  generatingText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary[600],
    marginTop: theme.spacing.lg,
    fontWeight: '500' as const,
  },
  
  bottomPadding: {
    height: theme.spacing['2xl'],
  },
}); 