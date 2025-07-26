import React, { useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Dimensions 
} from 'react-native';

interface Incident {
  id: string;
  timestamp: Date;
  type: 'Fire' | 'Smoke' | 'Heat' | 'False Alarm';
  location: string;
  robotId: string;
  agentUsed: string;
  responseTime: number;
  success: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

const IncidentHistory = () => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const incidents: Incident[] = [
    {
      id: 'INC-001',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'Fire',
      location: 'Floor 2 - East Wing',
      robotId: 'RS-001',
      agentUsed: 'CO₂',
      responseTime: 43,
      success: true,
      severity: 'High'
    },
    {
      id: 'INC-002',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'Smoke',
      location: 'Floor 1 - Kitchen',
      robotId: 'RS-002',
      agentUsed: 'Water Mist',
      responseTime: 28,
      success: true,
      severity: 'Medium'
    },
    {
      id: 'INC-003',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'False Alarm',
      location: 'Floor 3 - Server Room',
      robotId: 'RS-004',
      agentUsed: 'None',
      responseTime: 15,
      success: true,
      severity: 'Low'
    },
    {
      id: 'INC-004',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: 'Heat',
      location: 'Floor 2 - West Wing',
      robotId: 'RS-005',
      agentUsed: 'Chemical Mist',
      responseTime: 67,
      success: false,
      severity: 'Critical'
    }
  ];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical': 
        return {
          textColor: '#ff3a30',
          borderColor: '#ff3a30',
          backgroundColor: 'rgba(255, 58, 48, 0.1)'
        };
      case 'High': 
        return {
          textColor: '#ffcc00',
          borderColor: '#ffcc00',
          backgroundColor: 'rgba(255, 204, 0, 0.1)'
        };
      case 'Medium': 
        return {
          textColor: '#3399ff',
          borderColor: '#3399ff',
          backgroundColor: 'rgba(51, 153, 255, 0.1)'
        };
      case 'Low': 
        return {
          textColor: '#00ff99',
          borderColor: '#00ff99',
          backgroundColor: 'rgba(0, 255, 153, 0.1)'
        };
      default: 
        return {
          textColor: '#888',
          borderColor: '#888',
          backgroundColor: 'rgba(136, 136, 136, 0.1)'
        };
    }
  };

  const filteredIncidents = filterType === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.type.toLowerCase() === filterType.toLowerCase());

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>INCIDENT HISTORY</Text>
          <Text style={styles.subtitle}>SUPPRESSION RECORDS</Text>
        </View>

        {/* Filter Controls */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>FILTER BY TYPE</Text>
          <View style={styles.filterContainer}>
            {['all', 'fire', 'smoke', 'heat'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setFilterType(type)}
                style={[
                  styles.filterButton,
                  filterType === type ? styles.filterButtonActive : styles.filterButtonInactive
                ]}
              >
                <Text style={[
                  styles.filterText,
                  filterType === type && styles.filterTextActive
                ]}>
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Incident List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>RECENT INCIDENTS</Text>
          
          <View style={styles.incidentList}>
            {filteredIncidents.map((incident) => {
              const severityStyle = getSeverityStyle(incident.severity);
              return (
                <TouchableOpacity
                  key={incident.id}
                  onPress={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}
                  style={[
                    styles.incidentCard,
                    {
                      borderColor: severityStyle.borderColor,
                      backgroundColor: severityStyle.backgroundColor
                    }
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.incidentHeader}>
                    <View>
                      <Text style={styles.incidentTitle}>
                        {incident.id} - {incident.type}
                      </Text>
                      <Text style={styles.incidentLocation}>
                        {incident.location}
                      </Text>
                    </View>
                    <View style={[
                      styles.severityBadge,
                      { borderColor: severityStyle.borderColor }
                    ]}>
                      <Text style={[
                        styles.badgeText,
                        { color: severityStyle.textColor }
                      ]}>
                        {incident.severity}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.incidentMeta}>
                    <Text style={styles.metaText}>
                      {incident.timestamp.toLocaleDateString()}
                    </Text>
                    <Text style={[
                      styles.statusText,
                      incident.success ? styles.success : styles.failed
                    ]}>
                      {incident.success ? '✓ SUCCESS' : '✗ FAILED'}
                    </Text>
                  </View>

                  {selectedIncident === incident.id && (
                    <View style={styles.incidentDetails}>
                      <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Robot: </Text>
                          <Text style={styles.detailValueOrange}>{incident.robotId}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Agent: </Text>
                          <Text style={styles.detailValueGreen}>{incident.agentUsed}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Response: </Text>
                          <Text style={styles.detailValueBlue}>{incident.responseTime}s</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Status: </Text>
                          <Text style={incident.success ? styles.detailValueGreen : styles.detailValueRed}>
                            {incident.success ? 'Contained' : 'Failed'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>VIEW REPORT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>EXPORT DATA</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>STATISTICS</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValueGreen}>
                {Math.round((incidents.filter(i => i.success).length / incidents.length) * 100)}%
              </Text>
              <Text style={styles.statLabel}>SUCCESS RATE</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValueBlue}>
                {Math.round(incidents.reduce((acc, i) => acc + i.responseTime, 0) / incidents.length) }
              </Text>
              <Text style={styles.statLabel}>AVG RESPONSE</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f12',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ff6600',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: 'monospace',
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderColor: 'rgba(255, 102, 0, 0.1)',
    borderWidth: 1,
  },
  sectionTitle: {
    color: '#ff6600',
    fontFamily: 'monospace',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: (width - 80) / 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    borderColor: '#ff6600',
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
  },
  filterButtonInactive: {
    borderColor: 'rgba(255, 102, 0, 0.3)',
  },
  filterText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ff6600',
  },
  incidentList: {
    gap: 12,
  },
  incidentCard: {
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentTitle: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#ff6600',
    fontSize: 14,
  },
  incidentLocation: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  badgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incidentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#888',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  success: {
    color: '#00ff99',
  },
  failed: {
    color: '#ff0033',
  },
  incidentDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 102, 0, 0.2)',
  },
  detailsGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#888',
  },
  detailValueOrange: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ff6600',
  },
  detailValueGreen: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#00ff99',
  },
  detailValueBlue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#3399ff',
  },
  detailValueRed: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ff0033',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
    borderColor: 'rgba(255, 102, 0, 0.3)',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ff6600',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValueGreen: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#00ff99',
  },
  statValueBlue: {
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#3399ff',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#888',
    marginTop: 4,
  },
});

export default IncidentHistory;