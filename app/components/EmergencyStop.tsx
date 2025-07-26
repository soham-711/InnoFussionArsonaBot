import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Animated,
  Easing
} from 'react-native';

const EmergencyStop = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const pulseAnim = new Animated.Value(0);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const handleEmergencyStop = () => {
    if (!isPressed) {
      setShowConfirm(true);
    }
  };

  const confirmStop = () => {
    setIsPressed(true);
    setShowConfirm(false);
    startPulseAnimation();
    console.log('EMERGENCY STOP ACTIVATED');
    // In a real app, this would send stop commands to all robots
    setTimeout(() => {
      setIsPressed(false);
      pulseAnim.stopAnimation();
    }, 5000);
  };

  const cancelStop = () => {
    setShowConfirm(false);
  };

  const pulseGlow = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 0, 0, 0.3)', 'rgba(255, 0, 0, 0.6)']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EMERGENCY CONTROLS</Text>
      
      <TouchableOpacity
        onPress={handleEmergencyStop}
        disabled={isPressed}
        style={[
          styles.stopButton,
          isPressed ? styles.stopButtonPressed : styles.stopButtonNormal
        ]}
        activeOpacity={0.7}
      >
        <Animated.View style={[
          styles.stopButtonInner,
          isPressed && { backgroundColor: pulseGlow }
        ]}>
          <Text style={styles.stopButtonText}>
            {isPressed ? 'STOPPED' : 'EMERGENCY\nSTOP'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
      
      {isPressed && (
        <Text style={styles.alertText}>🚨 ALL ROBOTS STOPPED</Text>
      )}

      <Modal
        visible={showConfirm}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationBox}>
            <Text style={styles.confirmationTitle}>CONFIRM EMERGENCY STOP</Text>
            <Text style={styles.confirmationMessage}>
              This will immediately stop all robots and disable automatic fire suppression.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={confirmStop}
                style={[styles.confirmButton, styles.confirmButtonRed]}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>CONFIRM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelStop}
                style={[styles.confirmButton, styles.confirmButtonGray]}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.2)',
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#FFA500',
    marginBottom: 16,
    textAlign: 'center',
  },
  stopButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stopButtonNormal: {
    borderColor: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  stopButtonPressed: {
    borderColor: '#FF0000',
  },
  stopButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  alertText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#FF0000',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationBox: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FF0000',
    width: '100%',
    maxWidth: 400,
  },
  confirmationTitle: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationMessage: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#AAAAAA',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonRed: {
    backgroundColor: '#FF0000',
  },
  confirmButtonGray: {
    backgroundColor: '#666666',
  },
  buttonText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default EmergencyStop;