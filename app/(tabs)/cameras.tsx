// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   StatusBar,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const cameraWidth = (width - 36) / 2;

// interface Camera {
//   id: string;
//   status: 'active' | 'inactive';
//   detection: 'clear' | 'smoke' | 'heat';
//   alert: string;
//   location: string;
// }

// interface SensorData {
//   temperature: number;
//   gasConcentration: number;
//   flameIntensity: number;
//   timestamp?: string;
// }

// const API_URL = 'http://localhost:5000/api/sensor/latest';

// const FireDetectionApp = () => {
//   const [cameras, setCameras] = useState<Camera[]>([
//     { id: 'CAM-01', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 1 - Lobby' },
//     { id: 'CAM-02', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 2 - East Wing' },
//     { id: 'CAM-03', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 2 - West Wing' },
//     { id: 'CAM-04', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 3 - Server Room' },
//   ]);

//   const [sensors, setSensors] = useState<SensorData>({
//     temperature: 0,
//     gasConcentration: 0,
//     flameIntensity: 0,
//   });

//   const [selectedCamera, setSelectedCamera] = useState<Camera>(cameras[0]);
//   const [aiDetection, setAiDetection] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSensorData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(API_URL);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data: SensorData = await response.json();
      
//       setSensors({
//         temperature: data.temperature || 0,
//         gasConcentration: data.gasConcentration || 0,
//         flameIntensity: data.flameIntensity || 0,
//       });
      
//       updateCameraAlerts(data);
//       setError(null);
//     } catch (err) {
//       console.error('API Error:', err);
//       setError('Failed to load live data. Using simulated values.');
//       // Fallback to simulated data
//       setSensors(prev => ({
//         temperature: Math.max(0, prev.temperature + (Math.random() - 0.5) * 2),
//         gasConcentration: Math.max(0, prev.gasConcentration + (Math.random() - 0.5) * 5),
//         flameIntensity: Math.max(0, Math.min(10, prev.flameIntensity + (Math.random() - 0.5) * 0.5)),
//       }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCameraAlerts = (sensorData: SensorData) => {
//     setCameras(prevCameras => {
//       return prevCameras.map(cam => {
//         // Customize these thresholds based on your requirements
//         const highTemp = sensorData.temperature > 45;
//         const highGas = sensorData.gasConcentration > 60;
//         const highFlame = sensorData.flameIntensity > 3;

//         if (highGas && highFlame) {
//           return {
//             ...cam,
//             detection: 'smoke',
//             alert: `Fire Alert - ${Math.round(sensorData.gasConcentration)}%`
//           };
//         } else if (highTemp) {
//           return {
//             ...cam,
//             detection: 'heat',
//             alert: `High Temp - ${Math.round(sensorData.temperature)}°C`
//           };
//         } else if (highGas) {
//           return {
//             ...cam,
//             detection: 'smoke',
//             alert: `Smoke Detected - ${Math.round(sensorData.gasConcentration)}%`
//           };
//         }
        
//         return {
//           ...cam,
//           detection: 'clear',
//           alert: 'Clear'
//         };
//       });
//     });
//   };

//   useEffect(() => {
//     fetchSensorData();
    
//     const interval = setInterval(fetchSensorData, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const getDetectionColor = (detection: Camera['detection']): string => {
//     switch (detection) {
//       case 'smoke': return '#FF4444';
//       case 'heat': return '#FF8800';
//       case 'clear': return '#00AA44';
//       default: return '#00AA44';
//     }
//   };

//   const getCameraFrameColor = (camera: Camera): string => {
//     if (camera.detection === 'smoke' || camera.detection === 'heat') {
//       return '#FF4444';
//     }
//     return camera.id === selectedCamera.id ? '#ff5e00' : 'rgba(255, 94, 0, 0.3)';
//   };

//   const handleSnapshot = () => {
//     Alert.alert('Snapshot', `Capturing snapshot from ${selectedCamera.id}`);
//   };

//   const CameraFeed: React.FC<{
//     camera: Camera;
//     isSelected: boolean;
//     onSelect: (camera: Camera) => void;
//   }> = ({ camera, isSelected, onSelect }) => (
//     <TouchableOpacity
//       style={[
//         styles.cameraContainer,
//         { 
//           borderColor: getCameraFrameColor(camera),
//           borderWidth: isSelected ? 3 : 2,
//         }
//       ]}
//       onPress={() => onSelect(camera)}
//     >
//       <View style={styles.cameraFeed}>
//         <View style={styles.videoBorder} />
        
//         {aiDetection && camera.detection !== 'clear' && (
//           <View style={styles.detectionOverlay}>
//             <View style={[styles.detectionBadge, { backgroundColor: getDetectionColor(camera.detection) }]}>
//               <Text style={styles.detectionText}>🔥 {camera.alert}</Text>
//             </View>
//             <View style={[styles.boundingBox, { borderColor: getDetectionColor(camera.detection) }]} />
//           </View>
//         )}
        
//         <Text style={styles.cameraName}>{camera.id}</Text>
//         <View style={styles.recordingDot} />
//       </View>
//     </TouchableOpacity>
//   );

//   const SensorCard: React.FC<{
//     icon: keyof typeof Ionicons.glyphMap;
//     label: string;
//     value: number;
//     unit: string;
//     color: string;
//   }> = ({ icon, label, value, unit, color }) => (
//     <View style={styles.sensorCard}>
//       <View style={styles.sensorHeader}>
//         <Ionicons name={icon} size={20} color={color} />
//         <Text style={styles.sensorLabel}>{label}</Text>
//       </View>
//       <View style={[styles.sensorBar, { backgroundColor: color + '20' }]}>
//         <View style={[styles.sensorFill, { 
//           backgroundColor: color, 
//           width: `${Math.min(100, value * 10)}%` 
//         }]} />
//       </View>
//       <Text style={[styles.sensorValue, { color }]}>
//         {value.toFixed(1)} {unit}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar barStyle="light-content" backgroundColor="#0f0f12" />
//       <ScrollView 
//         style={styles.container}
//         contentContainerStyle={{ paddingBottom: 40 }}
//       >
//         <View style={styles.header}>
//           <Text style={styles.title}>CAMERA FEEDS</Text>
//           <Text style={styles.subtitle}>AI FIRE DETECTION SYSTEM</Text>
//           {error && <Text style={styles.errorText}>{error}</Text>}
//         </View>

//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#ff5e00" />
//             <Text style={styles.loadingText}>Connecting to sensors...</Text>
//           </View>
//         ) : (
//           <>
//             <View style={styles.grid}>
//               {cameras.map((camera) => (
//                 <CameraFeed
//                   key={camera.id}
//                   camera={camera}
//                   isSelected={camera.id === selectedCamera.id}
//                   onSelect={setSelectedCamera}
//                 />
//               ))}
//             </View>

//             <View style={styles.sensorPanel}>
//               <SensorCard
//                 icon="thermometer"
//                 label="TEMPERATURE"
//                 value={sensors.temperature}
//                 unit="°C"
//                 color="#00AA44"
//               />
//               <SensorCard
//                 icon="cloud"
//                 label="GAS CONCENTRATION"
//                 value={sensors.gasConcentration}
//                 unit="ppm"
//                 color="#00AAFF"
//               />
//               <SensorCard
//                 icon="flame"
//                 label="FLAME INTENSITY"
//                 value={sensors.flameIntensity}
//                 unit="level"
//                 color="#FF8800"
//               />
//             </View>

//             <View style={styles.detailsCard}>
//               <Text style={styles.detailsTitle}>
//                 {selectedCamera.id} - {selectedCamera.location}
//               </Text>
//               <View style={styles.detailsGrid}>
//                 <View style={styles.detailItem}>
//                   <Text style={styles.detailLabel}>Status: </Text>
//                   <Text style={styles.statusActive}>
//                     {selectedCamera.status.toUpperCase()}
//                   </Text>
//                 </View>
//                 <View style={styles.detailItem}>
//                   <Text style={styles.detailLabel}>Detection: </Text>
//                   <Text style={[
//                     styles.detectionText,
//                     { color: getDetectionColor(selectedCamera.detection) }
//                   ]}>
//                     {selectedCamera.alert}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.controls}>
//               <View style={styles.toggleContainer}>
//                 <Text style={styles.toggleLabel}>AI Detection:</Text>
//                 <TouchableOpacity
//                   onPress={() => setAiDetection(!aiDetection)}
//                   style={[
//                     styles.toggleTrack,
//                     aiDetection ? styles.toggleOn : styles.toggleOff
//                   ]}
//                 >
//                   <View style={[
//                     styles.toggleThumb,
//                     aiDetection ? styles.thumbOn : styles.thumbOff
//                   ]} />
//                 </TouchableOpacity>
//               </View>
              
//               <TouchableOpacity 
//                 style={styles.snapshotButton} 
//                 onPress={handleSnapshot}
//               >
//                 <Text style={styles.snapshotText}>📸 SNAPSHOT</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f0f12',
//     paddingHorizontal: 12,
//     paddingTop: 24,
//   },
//   header: {
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ff5e00',
//     textShadowColor: 'rgba(255, 94, 0, 0.5)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//     fontFamily: 'monospace',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#aaaaaa',
//     fontFamily: 'monospace',
//   },
//   errorText: {
//     color: '#FF4444',
//     fontSize: 12,
//     marginTop: 8,
//     fontFamily: 'monospace',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 200,
//   },
//   loadingText: {
//     color: '#ff5e00',
//     marginTop: 10,
//     fontFamily: 'monospace',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   cameraContainer: {
//     width: cameraWidth,
//     aspectRatio: 16/9,
//     borderRadius: 8,
//     marginBottom: 12,
//     overflow: 'hidden',
//   },
//   cameraFeed: {
//     flex: 1,
//     backgroundColor: 'rgba(15, 15, 18, 0.8)',
//     position: 'relative',
//   },
//   videoBorder: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     right: 8,
//     bottom: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 94, 0, 0.3)',
//     borderRadius: 4,
//   },
//   detectionOverlay: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     right: 8,
//   },
//   detectionBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     alignSelf: 'flex-start',
//   },
//   detectionText: {
//     fontSize: 14,
//     fontFamily: 'monospace',
//     fontWeight: 'bold',
//   },
//   boundingBox: {
//     position: 'absolute',
//     top: 32,
//     left: 16,
//     width: 64,
//     height: 48,
//     borderWidth: 2,
//   },
//   cameraName: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     fontSize: 12,
//     fontFamily: 'monospace',
//     color: '#00ff00',
//   },
//   recordingDot: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     width: 8,
//     height: 8,
//     backgroundColor: 'red',
//     borderRadius: 4,
//   },
//   sensorPanel: {
//     backgroundColor: 'rgba(30, 30, 36, 0.7)',
//     borderRadius: 8,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 94, 0, 0.2)',
//     marginBottom: 20,
//   },
//   sensorCard: {
//     marginBottom: 15,
//   },
//   sensorHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   sensorLabel: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 8,
//     fontFamily: 'monospace',
//   },
//   sensorBar: {
//     height: 8,
//     borderRadius: 4,
//     marginBottom: 5,
//     overflow: 'hidden',
//   },
//   sensorFill: {
//     height: '100%',
//     borderRadius: 4,
//   },
//   sensorValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     fontFamily: 'monospace',
//   },
//   detailsCard: {
//     backgroundColor: 'rgba(30, 30, 36, 0.7)',
//     borderRadius: 8,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 94, 0, 0.2)',
//     marginBottom: 20,
//   },
//   detailsTitle: {
//     color: '#ff5e00',
//     fontFamily: 'monospace',
//     fontWeight: '600',
//     fontSize: 16,
//     marginBottom: 12,
//   },
//   detailsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   detailLabel: {
//     color: '#888888',
//     fontSize: 14,
//     fontFamily: 'monospace',
//   },
//   statusActive: {
//     color: '#00ff00',
//     fontSize: 14,
//     fontFamily: 'monospace',
//     fontWeight: 'bold',
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//     marginBottom: 30,
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   toggleLabel: {
//     color: '#888888',
//     fontSize: 14,
//     fontFamily: 'monospace',
//     marginRight: 8,
//   },
//   toggleTrack: {
//     width: 48,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     paddingHorizontal: 2,
//   },
//   toggleOn: {
//     backgroundColor: '#00aa00',
//   },
//   toggleOff: {
//     backgroundColor: '#444444',
//   },
//   toggleThumb: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: 'white',
//   },
//   thumbOn: {
//     alignSelf: 'flex-end',
//   },
//   thumbOff: {
//     alignSelf: 'flex-start',
//   },
//   snapshotButton: {
//     backgroundColor: '#ff5e00',
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   snapshotText: {
//     color: 'black',
//     fontSize: 14,
//     fontWeight: 'bold',
//     fontFamily: 'monospace',
//   },
// });

// export default FireDetectionApp;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSensorSocket } from '../../utils/socket';

const { width } = Dimensions.get('window');
const cameraWidth = (width - 36) / 2;

interface Camera {
  id: string;
  status: 'active' | 'inactive';
  detection: 'clear' | 'smoke' | 'heat';
  alert: string;
  location: string;
}

interface SensorData {
  temperature: number;
  gas: number;
  flame: number;
  botId?: string;
  timestamp?: string;
}

const FireDetectionApp = () => {
  // Socket connection for real-time sensor data
  const socketData = useSensorSocket() as SensorData | null;
  
  const [cameras, setCameras] = useState<Camera[]>([
    { id: 'CAM-01', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 1 - Lobby' },
    { id: 'CAM-02', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 2 - East Wing' },
    { id: 'CAM-03', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 2 - West Wing' },
    { id: 'CAM-04', status: 'active', detection: 'clear', alert: 'Clear', location: 'Floor 3 - Server Room' },
  ]);

  const [sensors, setSensors] = useState<SensorData>({
    temperature: 0,
    gas: 0,
    flame: 0,
  });

  const [selectedCamera, setSelectedCamera] = useState<Camera>(cameras[0]);
  const [aiDetection, setAiDetection] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced fire risk calculation with 1200 ppm threshold
  const calculateFireRisk = (gas: number, flame: number, temperature: number): { 
    score: number; 
    danger: string;
    level: number;
  } => {
    const GAS_THRESHOLD = 1200; // Your specific threshold
    const FLAME_THRESHOLD = 0.1;
    const TEMP_THRESHOLD = 60;

    // Critical combination - gas at threshold AND flame detected
    if (gas >= GAS_THRESHOLD && flame > FLAME_THRESHOLD) {
      return {
        score: 100,
        danger: '🚨 CRITICAL: Fire Detected (Gas at Threshold)',
        level: 4
      };
    }

    // High risk scenarios
    if (flame > FLAME_THRESHOLD) {
      return {
        score: 80 + (gas / GAS_THRESHOLD * 20),
        danger: '🔥 HIGH RISK: Flame Detected',
        level: 3
      };
    }

    if (gas >= GAS_THRESHOLD) {
      return {
        score: 70 + (temperature > TEMP_THRESHOLD ? 10 : 0),
        danger: '⚠️ WARNING: Gas at Threshold Level',
        level: 2
      };
    }

    // Elevated risk
    if (gas > GAS_THRESHOLD * 0.7) { // >70% of threshold
      return {
        score: 40 + (gas / GAS_THRESHOLD * 30),
        danger: '⚠️ CAUTION: High Gas Level',
        level: 1
      };
    }

    // Normal conditions
    return {
      score: Math.min(40, (gas / GAS_THRESHOLD * 40)),
      danger: '✅ Normal',
      level: 0
    };
  };

  // Update sensor data when socket receives new data
  useEffect(() => {
    if (socketData) {
      setSensors({
        temperature: socketData.temperature || 0,
        gas: socketData.gas || 0,
        flame: socketData.flame || 0,
      });
      updateCameraAlerts(socketData);
      setLoading(false);
      setError(null);
    } else {
      setError('Waiting for sensor connection...');
      setLoading(true);
    }
  }, [socketData]);

  // Update camera alerts based on sensor data
  const updateCameraAlerts = (sensorData: SensorData) => {
    const { danger, level } = calculateFireRisk(
      sensorData.gas, 
      sensorData.flame,
      sensorData.temperature
    );
    
    setCameras(prevCameras => {
      return prevCameras.map(cam => {
        let detection: 'clear' | 'smoke' | 'heat' = 'clear';
        let alert = danger;

        if (level >= 4) detection = 'smoke'; // Critical
        else if (level >= 3) detection = 'heat'; // High risk
        else if (level >= 2) detection = 'smoke'; // Warning
        
        return {
          ...cam,
          detection,
          alert
        };
      });
    });
  };

  const getDetectionColor = (detection: Camera['detection']): string => {
    switch (detection) {
      case 'smoke': return '#FF4444';
      case 'heat': return '#FF8800';
      case 'clear': return '#00AA44';
      default: return '#00AA44';
    }
  };

  const getCameraFrameColor = (camera: Camera): string => {
    if (camera.detection === 'smoke' || camera.detection === 'heat') {
      return '#FF4444';
    }
    return camera.id === selectedCamera.id ? '#ff5e00' : 'rgba(255, 94, 0, 0.3)';
  };

  const handleSnapshot = () => {
    Alert.alert('Snapshot', `Capturing snapshot from ${selectedCamera.id}`);
  };

  const CameraFeed: React.FC<{
    camera: Camera;
    isSelected: boolean;
    onSelect: (camera: Camera) => void;
  }> = ({ camera, isSelected, onSelect }) => (
    <TouchableOpacity
      style={[
        styles.cameraContainer,
        { 
          borderColor: getCameraFrameColor(camera),
          borderWidth: isSelected ? 3 : 2,
        }
      ]}
      onPress={() => onSelect(camera)}
    >
      <View style={styles.cameraFeed}>
        <View style={styles.videoBorder} />
        
        {aiDetection && camera.detection !== 'clear' && (
          <View style={styles.detectionOverlay}>
            <View style={[styles.detectionBadge, { backgroundColor: getDetectionColor(camera.detection) }]}>
              <Text style={styles.detectionText}>🔥 {camera.alert}</Text>
            </View>
            <View style={[styles.boundingBox, { borderColor: getDetectionColor(camera.detection) }]} />
          </View>
        )}
        
        <Text style={styles.cameraName}>{camera.id}</Text>
        <View style={styles.recordingDot} />
      </View>
    </TouchableOpacity>
  );

  const SensorCard: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: number;
    unit: string;
    color: string;
  }> = ({ icon, label, value, unit, color }) => (
    <View style={styles.valueBox}>
      <View style={styles.sensorHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.sensorLabel}>{label}</Text>
      </View>
      <View style={[styles.sensorBar, { backgroundColor: color + '20' }]}>
        <View style={[styles.sensorFill, { 
          backgroundColor: color, 
          width: `${Math.min(100, value)}%` 
        }]} />
      </View>
      <Text style={[styles.sensorValue, { color }]}>
        {value.toFixed(1)} {unit}
      </Text>
    </View>
  );

  const { score, danger, level } = calculateFireRisk(
    sensors.gas, 
    sensors.flame,
    sensors.temperature
  );

  // Get color based on danger level
  const getDangerColor = (level: number) => {
    return [
      '#4CAF50', // Normal (green)
      '#FFEB3B', // Caution (yellow)
      '#FF9800', // Warning (orange)
      '#F44336', // High Risk (red)
      '#D32F2F'  // Critical (dark red)
    ][level];
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f12" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🔥 FIRE SAFETY MONITORING</Text>
          <Text style={styles.subtitle}>REAL-TIME DETECTION SYSTEM</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5e00" />
            <Text style={styles.loadingText}>Connecting to sensors...</Text>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {cameras.map((camera) => (
                <CameraFeed
                  key={camera.id}
                  camera={camera}
                  isSelected={camera.id === selectedCamera.id}
                  onSelect={setSelectedCamera}
                />
              ))}
            </View>

            <View style={styles.sensorPanel}>
              <SensorCard
                icon="thermometer"
                label="TEMPERATURE"
                value={sensors.temperature}
                unit="°C"
                color="#00AA44"
              />
              <SensorCard
                icon="cloud"
                label="GAS LEVEL"
                value={sensors.gas}
                unit="ppm"
                color="#00AAFF"
              />
              <SensorCard
                icon="flame"
                label="FLAME"
                value={sensors.flame * 100}
                unit="level"
                color="#FF8800"
              />
              
              {/* Enhanced Fire Risk Assessment */}
              <View style={[styles.valueBox, { 
                backgroundColor: getDangerColor(level),
                borderWidth: level >= 3 ? 2 : 0,
                borderColor: '#FFFFFF'
              }]}>
                <Text style={[styles.sensorValue, { color: '#FFFFFF' }]}>
                  {danger}
                </Text>
                <View style={styles.detailsGrid}>
                  <Text style={[styles.label, { color: '#FFFFFF' }]}>Risk Score:</Text>
                  <Text style={[styles.sensorValue, { color: '#FFFFFF' }]}>
                    {score.toFixed(0)}/100
                  </Text>
                </View>
                {level >= 3 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Ionicons name="warning" size={20} color="white" />
                    <Text style={[styles.label, { color: '#FFFFFF', marginLeft: 5 }]}>
                      Immediate action required
                    </Text>
                  </View>
                )}
              </View>
              
              {socketData?.timestamp && (
                <View style={styles.valueBox}>
                  <Text style={styles.label}>LAST UPDATED</Text>
                  <Text style={styles.sensorValue}>
                    {new Date(socketData.timestamp).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>
                {selectedCamera.id} - {selectedCamera.location}
              </Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Status: </Text>
                  <Text style={styles.statusActive}>
                    {selectedCamera.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Detection: </Text>
                  <Text style={[
                    styles.detectionText,
                    { color: getDetectionColor(selectedCamera.detection) }
                  ]}>
                    {selectedCamera.alert}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.controls}>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>AI Detection:</Text>
                <TouchableOpacity
                  onPress={() => setAiDetection(!aiDetection)}
                  style={[
                    styles.toggleTrack,
                    aiDetection ? styles.toggleOn : styles.toggleOff
                  ]}
                >
                  <View style={[
                    styles.toggleThumb,
                    aiDetection ? styles.thumbOn : styles.thumbOff
                  ]} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.snapshotButton} 
                onPress={handleSnapshot}
              >
                <Text style={styles.snapshotText}>📸 SNAPSHOT</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// ... (keep your existing styles unchanged)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f12',
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5e00',
    textShadowColor: 'rgba(255, 94, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  loadingText: {
    color: '#ff5e00',
    marginTop: 10,
    fontFamily: 'monospace',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cameraContainer: {
    width: cameraWidth,
    aspectRatio: 16/9,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cameraFeed: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 18, 0.8)',
    position: 'relative',
  },
  videoBorder: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 94, 0, 0.3)',
    borderRadius: 4,
  },
  detectionOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
  },
  detectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  detectionText: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  boundingBox: {
    position: 'absolute',
    top: 32,
    left: 16,
    width: 64,
    height: 48,
    borderWidth: 2,
  },
  cameraName: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#00ff00',
  },
  recordingDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  sensorPanel: {
    backgroundColor: 'rgba(30, 30, 36, 0.7)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 94, 0, 0.2)',
    marginBottom: 20,
  },
  valueBox: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
  },
  sensorLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  sensorBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  sensorFill: {
    height: '100%',
    borderRadius: 4,
  },
  sensorValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsCard: {
    backgroundColor: 'rgba(30, 30, 36, 0.7)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 94, 0, 0.2)',
    marginBottom: 20,
  },
  detailsTitle: {
    color: '#ff5e00',
    fontFamily: 'monospace',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  statusActive: {
    color: '#00ff00',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'monospace',
    marginRight: 8,
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: '#00aa00',
  },
  toggleOff: {
    backgroundColor: '#444444',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
  snapshotButton: {
    backgroundColor: '#ff5e00',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  snapshotText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});

export default FireDetectionApp;