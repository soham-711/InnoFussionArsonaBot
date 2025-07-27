// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet
// } from 'react-native';

// interface Alert {
//   id: string;
//   timestamp: Date;
//   type: 'Fire Detected' | 'Smoke Alert' | 'System Normal' | 'Robot Offline' | 'Agent Low';
//   location: string;
//   severity: 'critical' | 'warning' | 'info';
//   acknowledged: boolean;
// }

// const RecentAlerts = () => {
//   const [alerts, setAlerts] = useState<Alert[]>([
//     {
//       id: '1',
//       timestamp: new Date(Date.now() - 2 * 60 * 1000),
//       type: 'System Normal',
//       location: 'Floor 2 - East Wing',
//       severity: 'info',
//       acknowledged: true
//     },
//     {
//       id: '2',
//       timestamp: new Date(Date.now() - 15 * 60 * 1000),
//       type: 'Agent Low',
//       location: 'Chemical Tank 3',
//       severity: 'warning',
//       acknowledged: false
//     },
//     {
//       id: '3',
//       timestamp: new Date(Date.now() - 32 * 60 * 1000),
//       type: 'Smoke Alert',
//       location: 'Floor 1 - Kitchen',
//       severity: 'warning',
//       acknowledged: true
//     },
//     {
//       id: '4',
//       timestamp: new Date(Date.now() - 45 * 60 * 1000),
//       type: 'Robot Offline',
//       location: 'RS-003 Dock',
//       severity: 'warning',
//       acknowledged: true
//     },
//     {
//       id: '5',
//       timestamp: new Date(Date.now() - 67 * 60 * 1000),
//       type: 'System Normal',
//       location: 'All Zones',
//       severity: 'info',
//       acknowledged: true
//     }
//   ]);

//   const getSeverityStyle = (severity: string) => {
//     switch (severity) {
//       case 'critical':
//         return {
//           container: styles.alertCritical,
//           text: styles.textCritical
//         };
//       case 'warning':
//         return {
//           container: styles.alertWarning,
//           text: styles.textWarning
//         };
//       case 'info':
//       default:
//         return {
//           container: styles.alertSuccess,
//           text: styles.textSuccess
//         };
//     }
//   };

//   const getSeverityIcon = (severity: string) => {
//     switch (severity) {
//       case 'critical': return '🚨';
//       case 'warning': return '⚠️';
//       case 'info': return '✅';
//       default: return 'ℹ️';
//     }
//   };

//   const formatTime = (timestamp: Date) => {
//     const now = new Date();
//     const diffMs = now.getTime() - timestamp.getTime();
//     const diffMins = Math.floor(diffMs / 60000);

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins}m ago`;
//     const diffHours = Math.floor(diffMins / 60);
//     if (diffHours < 24) return `${diffHours}h ago`;
//     return timestamp.toLocaleDateString();
//   };

//   const acknowledgeAlert = (alertId: string) => {
//     setAlerts(prev => prev.map(alert =>
//       alert.id === alertId
//         ? { ...alert, acknowledged: true }
//         : alert
//     ));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>RECENT ALERTS</Text>

//       <ScrollView
//         style={styles.alertsContainer}
//         contentContainerStyle={styles.alertsContent}
//       >
//         {alerts.map((alert) => {
//           const severityStyle = getSeverityStyle(alert.severity);
//           const alertStyle = alert.acknowledged
//             ? styles.alertAcknowledged
//             : severityStyle.container;

//           return (
//             <View
//               key={alert.id}
//               style={[styles.alertItem, alertStyle]}
//             >
//               <View style={styles.alertContent}>
//                 <View style={styles.alertHeader}>
//                   <Text style={styles.alertIcon}>
//                     {getSeverityIcon(alert.severity)}
//                   </Text>
//                   <Text style={[styles.alertType, severityStyle.text]}>
//                     {alert.type}
//                   </Text>
//                 </View>
//                 <Text style={styles.alertLocation}>
//                   {alert.location}
//                 </Text>
//                 <Text style={styles.alertTime}>
//                   {formatTime(alert.timestamp)}
//                 </Text>
//               </View>

//               {!alert.acknowledged && (
//                 <TouchableOpacity
//                   onPress={() => acknowledgeAlert(alert.id)}
//                   style={styles.ackButton}
//                 >
//                   <Text style={styles.ackButtonText}>ACK</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           );
//         })}
//       </ScrollView>

//       <TouchableOpacity style={styles.viewAllButton}>
//         <Text style={styles.viewAllText}>VIEW ALL ALERTS →</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 165, 0, 0.2)',
//     marginVertical: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontFamily: 'monospace',
//     fontWeight: '600',
//     color: '#FFA500',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   alertsContainer: {
//     maxHeight: 250,
//   },
//   alertsContent: {
//     paddingBottom: 8,
//   },
//   alertItem: {
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   alertAcknowledged: {
//     borderColor: 'rgba(255, 165, 0, 0.1)',
//     backgroundColor: 'rgba(30, 30, 36, 0.7)',
//     opacity: 0.7,
//   },
//   alertCritical: {
//     borderColor: '#FF3333',
//     backgroundColor: 'rgba(255, 51, 51, 0.1)',
//   },
//   alertWarning: {
//     borderColor: '#FFCC00',
//     backgroundColor: 'rgba(255, 204, 0, 0.1)',
//   },
//   alertSuccess: {
//     borderColor: '#00FF99',
//     backgroundColor: 'rgba(0, 255, 153, 0.1)',
//   },
//   alertContent: {
//     flex: 1,
//   },
//   alertHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   alertIcon: {
//     marginRight: 8,
//   },
//   alertType: {
//     fontFamily: 'monospace',
//     fontWeight: '500',
//     fontSize: 14,
//   },
//   textCritical: {
//     color: '#FF3333',
//   },
//   textWarning: {
//     color: '#FFCC00',
//   },
//   textSuccess: {
//     color: '#00FF99',
//   },
//   alertLocation: {
//     fontFamily: 'monospace',
//     fontSize: 12,
//     color: '#AAAAAA',
//     marginBottom: 2,
//   },
//   alertTime: {
//     fontFamily: 'monospace',
//     fontSize: 11,
//     color: 'rgba(170, 170, 170, 0.7)',
//   },
//   ackButton: {
//     marginLeft: 12,
//   },
//   ackButtonText: {
//     fontFamily: 'monospace',
//     fontSize: 12,
//     color: '#FFA500',
//   },
//   viewAllButton: {
//     marginTop: 12,
//     alignSelf: 'center',
//   },
//   viewAllText: {
//     fontFamily: 'monospace',
//     fontSize: 14,
//     color: '#FFA500',
//   },
// });

// export default RecentAlerts;

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_LATEST = "https://arsonabackend.onrender.com/api/notifications/latest";
const API_ALL = "https://arsonabackend.onrender.com/api/notifications/all";

interface Alert {
  _id: string;
  message: string;
  botId: string;
  gas: number;
  flame: number;
  temperature: number;
  flag: string;
  timestamp: string;
  acknowledged?: boolean;
}

const RecentAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(showAll ? API_ALL : API_LATEST);

      let alertsData = response.data;

      if (response.data && response.data.data) {
        alertsData = response.data.data;
      } else if (!Array.isArray(alertsData)) {
        alertsData = [alertsData];
      }

      const processedAlerts = alertsData.map((alert: Alert) => ({
        ...alert,
        acknowledged: false,
      }));

      setAlerts(processedAlerts);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Failed to load alerts. Please try again.");
      setAlerts([
        {
          _id: "1",
          message: "🚨 Alert: gas detected!",
          botId: "arsona-001",
          gas: 1315,
          flame: 0,
          temperature: 30,
          flag: "gas",
          timestamp: new Date().toISOString(),
          acknowledged: false,
        },
        {
          _id: "2",
          message: "⚠️ Warning: flame detected",
          botId: "arsona-002",
          gas: 450,
          flame: 1,
          temperature: 42,
          flag: "flame",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          acknowledged: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(); // Fetch initially

    const interval = setInterval(() => {
      fetchAlerts();
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [showAll]);

  const getSeverityStyle = (flag: string) => {
    switch (flag) {
      case "gas":
      case "flame":
        return {
          container: styles.alertCritical,
          text: styles.textCritical,
        };
      case "high_temp":
        return {
          container: styles.alertWarning,
          text: styles.textWarning,
        };
      case "system_normal":
      default:
        return {
          container: styles.alertSuccess,
          text: styles.textSuccess,
        };
    }
  };

  const getSeverityIcon = (flag: string) => {
    switch (flag) {
      case "gas":
      case "flame":
        return "🚨";
      case "high_temp":
        return "⚠️";
      case "system_normal":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return alertTime.toLocaleDateString();
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (err) {
      console.error("Error acknowledging alert:", err);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const getAlertType = (flag: string) => {
    switch (flag) {
      case "gas":
        return "Gas Alert";
      case "flame":
        return "Flame Alert";
      case "high_temp":
        return "High Temperature";
      case "system_normal":
        return "System Normal";
      default:
        return "System Notification";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {showAll ? "ALL ALERTS" : "RECENT ALERTS"}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchAlerts}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={[
              styles.alertsContainer,
              showAll && { maxHeight: Dimensions.get("window").height * 0.6 },
            ]}
            contentContainerStyle={styles.alertsContent}
          >
            {alerts.length > 0 ? (
              alerts.map((alert) => {
                const severityStyle = getSeverityStyle(alert.flag);
                const alertStyle = alert.acknowledged
                  ? styles.alertAcknowledged
                  : severityStyle.container;

                return (
                  <View key={alert._id} style={[styles.alertItem, alertStyle]}>
                    <View style={styles.alertContent}>
                      <View style={styles.alertHeader}>
                        <Text style={styles.alertIcon}>
                          {getSeverityIcon(alert.flag)}
                        </Text>
                        <Text style={[styles.alertType, severityStyle.text]}>
                          {getAlertType(alert.flag)}
                        </Text>
                      </View>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <Text style={styles.alertDetails}>
                        {alert.botId} • Gas: {alert.gas}ppm • Temp:{" "}
                        {alert.temperature}°C
                      </Text>
                      <Text style={styles.alertTime}>
                        {formatTime(alert.timestamp)}
                      </Text>
                    </View>

                    {!alert.acknowledged && (
                      <TouchableOpacity
                        onPress={() => acknowledgeAlert(alert._id)}
                        style={styles.ackButton}
                      >
                        <Text style={styles.ackButtonText}>ACK</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.noAlertsText}>No alerts found</Text>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={toggleShowAll}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>
              {showAll ? "SHOW RECENT ALERTS" : "VIEW ALL ALERTS →"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.2)",
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#FFA500",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#FF3333",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  retryText: {
    color: "#FFA500",
    fontFamily: "monospace",
  },
  alertsContainer: {
    maxHeight: 250,
  },
  alertsContent: {
    paddingBottom: 8,
  },
  noAlertsText: {
    color: "#AAAAAA",
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 20,
  },
  alertItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertAcknowledged: {
    borderColor: "rgba(255, 165, 0, 0.1)",
    backgroundColor: "rgba(30, 30, 36, 0.7)",
    opacity: 0.7,
  },
  alertCritical: {
    borderColor: "#FF3333",
    backgroundColor: "rgba(255, 51, 51, 0.1)",
  },
  alertWarning: {
    borderColor: "#FFCC00",
    backgroundColor: "rgba(255, 204, 0, 0.1)",
  },
  alertSuccess: {
    borderColor: "#00FF99",
    backgroundColor: "rgba(0, 255, 153, 0.1)",
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  alertIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  alertType: {
    fontFamily: "monospace",
    fontWeight: "500",
    fontSize: 14,
  },
  textCritical: {
    color: "#FF3333",
  },
  textWarning: {
    color: "#FFCC00",
  },
  textSuccess: {
    color: "#00FF99",
  },
  alertMessage: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#CCCCCC",
    marginBottom: 2,
  },
  alertDetails: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#AAAAAA",
    marginBottom: 2,
  },
  alertTime: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "rgba(170, 170, 170, 0.7)",
  },
  ackButton: {
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 12,
  },
  ackButtonText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#FFA500",
  },
  viewAllButton: {
    marginTop: 12,
    alignSelf: "center",
    padding: 8,
  },
  viewAllText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#FFA500",
  },
});

export default RecentAlerts;
