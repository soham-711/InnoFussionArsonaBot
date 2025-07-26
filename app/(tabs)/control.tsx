import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

const RobotControl = () => {
  const [selectedAgent, setSelectedAgent] = useState('CO₂');
  const [suppressionActive, setSuppressionActive] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  // Single building sentinel
  const robot = {
    id: 'RS-001',
    name: 'Sentinel Alpha',
    battery: 87,
    status: 'Patrolling',
    location: 'Floor 2 - East Wing'
  };

  const locations = [
    'Floor 1 - Lobby',
    'Floor 1 - Kitchen',
    'Floor 2 - East Wing',
    'Floor 2 - West Wing',
    'Floor 3 - Server Room',
    'Floor 3 - Meeting Room',
    'Dock Station 1',
    'Dock Station 2'
  ];

  const agents = ['CO₂', 'Water Mist', 'Chemical Mist'];

  const handleMovement = (direction: string) => {
    console.log(`Moving ${robot.name} ${direction}`);
  };

  const handleSuppression = () => {
    setSuppressionActive(!suppressionActive);
    console.log(`${suppressionActive ? 'Stopping' : 'Starting'} suppression with ${selectedAgent}`);
  };

  const handleNavigate = () => {
    if (!selectedLocation) return;
    console.log(`Navigating to ${selectedLocation}`);
    setLocationModalVisible(false);
  };

  const handleReturnToDock = () => {
    console.log('Returning to dock');
  };

  const selectLocation = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SENTINEL CONTROL</Text>
          <Text style={styles.subtitle}>BUILDING AUTONOMOUS SYSTEM</Text>
        </View>

        {/* Robot Status Display */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SENTINEL STATUS</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.robotName}>{robot.name}</Text>
                <Text style={styles.robotLocation}>{robot.location}</Text>
              </View>
              <View style={styles.statusRight}>
                <Text style={styles.batteryText}>{robot.battery}%</Text>
                <Text style={styles.statusText}>{robot.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Movement Controls */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>MOVEMENT CONTROL</Text>
          <View style={styles.movementGrid}>
            <View style={styles.movementRow}>
              <View style={styles.emptyCell} />
              <TouchableOpacity
                style={styles.movementButton}
                onPress={() => handleMovement('forward')}
              >
                <Text style={styles.movementIcon}>↑</Text>
              </TouchableOpacity>
              <View style={styles.emptyCell} />
            </View>
            
            <View style={styles.movementRow}>
              <TouchableOpacity
                style={styles.movementButton}
                onPress={() => handleMovement('left')}
              >
                <Text style={styles.movementIcon}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={() => handleMovement('stop')}
              >
                <Text style={styles.stopButtonText}>STOP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.movementButton}
                onPress={() => handleMovement('right')}
              >
                <Text style={styles.movementIcon}>→</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.movementRow}>
              <View style={styles.emptyCell} />
              <TouchableOpacity
                style={styles.movementButton}
                onPress={() => handleMovement('backward')}
              >
                <Text style={styles.movementIcon}>↓</Text>
              </TouchableOpacity>
              <View style={styles.emptyCell} />
            </View>
          </View>
        </View>

        {/* Location Control */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SEND TO LOCATION</Text>
          <TouchableOpacity 
            style={styles.locationSelector}
            onPress={() => setLocationModalVisible(true)}
          >
            <Text style={selectedLocation ? styles.locationSelectedText : styles.locationPlaceholder}>
              {selectedLocation || 'Select destination...'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, !selectedLocation && styles.disabledButton]} 
            onPress={handleNavigate}
            disabled={!selectedLocation}
          >
            <Text style={styles.buttonText}>NAVIGATE TO LOCATION</Text>
          </TouchableOpacity>
        </View>

        {/* Suppression Control */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>SUPPRESSION SYSTEM</Text>
          
          <View style={styles.agentSelection}>
            <Text style={styles.agentLabel}>AGENT SELECTION:</Text>
            <View style={styles.agentGrid}>
              {agents.map((agent) => (
                <TouchableOpacity
                  key={agent}
                  style={[
                    styles.agentButton,
                    selectedAgent === agent && styles.agentButtonActive
                  ]}
                  onPress={() => setSelectedAgent(agent)}
                >
                  <Text style={[
                    styles.agentButtonText,
                    selectedAgent === agent && styles.agentButtonTextActive
                  ]}>
                    {agent}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.suppressionButton,
              suppressionActive && styles.suppressionButtonActive
            ]}
            onPress={handleSuppression}
            onLongPress={() => {
              setSuppressionActive(true);
              console.log('Suppression hold started');
            }}
            onPressOut={() => {
              setSuppressionActive(false);
              console.log('Suppression hold ended');
            }}
          >
            <Text style={styles.suppressionButtonText}>
              {suppressionActive ? 'SUPPRESSING...' : 'HOLD TO SUPPRESS'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleReturnToDock}>
            <Text style={styles.buttonText}>RETURN TO DOCK</Text>
          </TouchableOpacity>
        </View>

        {/* Location Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={locationModalVisible}
          onRequestClose={() => setLocationModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setLocationModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Destination</Text>
              
              <ScrollView style={styles.modalScrollView}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.locationItem,
                      selectedLocation === location && styles.locationItemSelected
                    ]}
                    onPress={() => selectLocation(location)}
                  >
                    <Text style={[
                      styles.locationItemText,
                      selectedLocation === location && styles.locationItemTextSelected
                    ]}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => setLocationModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleNavigate}
                  disabled={!selectedLocation}
                >
                  <Text style={styles.modalButtonPrimaryText}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');

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
  statusCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 8,
    padding: 16,
    borderColor: 'rgba(255, 102, 0, 0.2)',
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  robotName: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#ff6600',
    fontSize: 18,
  },
  robotLocation: {
    fontFamily: 'monospace',
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  statusRight: {
    alignItems: 'flex-end',
  },
  batteryText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#00ff99',
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
  },
  movementGrid: {
    width: 180,
    alignSelf: 'center',
  },
  movementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  movementButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
    borderColor: 'rgba(255, 102, 0, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
  },
  movementIcon: {
    fontSize: 24,
    color: '#ff6600',
  },
  emptyCell: {
    width: 56,
    height: 56,
  },
  stopButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 51, 0.2)',
    borderColor: '#ff0033',
    borderWidth: 1,
    borderRadius: 8,
  },
  stopButtonText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ff0033',
    fontSize: 12,
  },
  locationSelector: {
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 0, 0.3)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
  },
  locationPlaceholder: {
    fontFamily: 'monospace',
    color: '#888',
  },
  locationSelectedText: {
    fontFamily: 'monospace',
    color: '#ccc',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
    borderColor: 'rgba(255, 102, 0, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'monospace',
    color: '#ff6600',
    fontWeight: '600',
  },
  agentSelection: {
    marginBottom: 16,
  },
  agentLabel: {
    fontFamily: 'monospace',
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  agentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  agentButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 0, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
  },
  agentButtonActive: {
    borderColor: '#ff6600',
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
  },
  agentButtonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
  },
  agentButtonTextActive: {
    color: '#ff6600',
  },
  suppressionButton: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6600',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
    marginBottom: 12,
  },
  suppressionButtonActive: {
    borderColor: '#ff0033',
    backgroundColor: 'rgba(255, 0, 51, 0.2)',
  },
  suppressionButtonText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ff6600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: height * 0.6,
  },
  modalTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScrollView: {
    marginBottom: 16,
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 102, 0, 0.1)',
  },
  locationItemSelected: {
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
  },
  locationItemText: {
    fontFamily: 'monospace',
    color: '#ccc',
  },
  locationItemTextSelected: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 0, 0.3)',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  modalButtonPrimary: {
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
  },
  modalButtonText: {
    fontFamily: 'monospace',
    color: '#888',
  },
  modalButtonPrimaryText: {
    fontFamily: 'monospace',
    color: '#ff6600',
    fontWeight: 'bold',
  },
});

export default RobotControl;