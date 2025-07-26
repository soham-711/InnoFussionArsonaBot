import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../utils/firebase";

const SystemStatus = () => {
  const [selectedRobot, setSelectedRobot] = useState("RS-001");
  const router = useRouter();

  const systemStats = {
    networkStatus: "Online",
    uptime: "247 days, 18:34:22",
    totalIncidents: 47,
    successRate: 94.7,
    lastMaintenance: "2024-06-15",
    nextMaintenance: "2024-07-15",
  };

  const robotDiagnostics = [
    {
      id: "RS-001",
      name: "Alpha",
      health: 94,
      batteryHealth: 87,
      sensors: "Normal",
      firmware: "2.1.3",
    },
    {
      id: "RS-002",
      name: "Beta",
      health: 98,
      batteryHealth: 91,
      sensors: "Normal",
      firmware: "2.1.3",
    },
    {
      id: "RS-003",
      name: "Gamma",
      health: 76,
      batteryHealth: 65,
      sensors: "Calibrating",
      firmware: "2.1.2",
    },
    {
      id: "RS-004",
      name: "Delta",
      health: 89,
      batteryHealth: 82,
      sensors: "Normal",
      firmware: "2.1.3",
    },
  ];

  const getHealthColor = (health: number) => {
    if (health >= 90) return styles.healthGreen;
    if (health >= 70) return styles.healthYellow;
    return styles.healthRed;
  };

  const currentRobot = robotDiagnostics.find((r) => r.id === selectedRobot);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              await AsyncStorage.removeItem("user");
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout failed:", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SYSTEM STATUS</Text>
          <Text style={styles.subtitle}>DIAGNOSTICS & MAINTENANCE</Text>
        </View>

        {/* System Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SYSTEM OVERVIEW</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Network Status:</Text>
              <Text style={styles.statValueGreen}>
                {systemStats.networkStatus}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>System Uptime:</Text>
              <Text style={styles.statValueBlue}>{systemStats.uptime}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Success Rate:</Text>
              <Text style={styles.statValueGreen}>
                {systemStats.successRate}%
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Incidents:</Text>
              <Text style={styles.statValueOrange}>
                {systemStats.totalIncidents}
              </Text>
            </View>
          </View>
        </View>

        {/* Robot Diagnostics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ROBOT DIAGNOSTICS</Text>

          <View style={styles.robotGrid}>
            {robotDiagnostics.map((robot) => (
              <TouchableOpacity
                key={robot.id}
                onPress={() => setSelectedRobot(robot.id)}
                style={[
                  styles.robotButton,
                  selectedRobot === robot.id
                    ? styles.robotButtonActive
                    : styles.robotButtonInactive,
                ]}
              >
                <View style={styles.robotButtonContent}>
                  <Text style={styles.robotName}>{robot.name}</Text>
                  <Text
                    style={[styles.robotHealth, getHealthColor(robot.health)]}
                  >
                    {robot.health}%
                  </Text>
                  <Text style={styles.robotHealthLabel}>Health Score</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {currentRobot && (
            <View style={styles.robotDetailCard}>
              <Text style={styles.robotDetailTitle}>
                {currentRobot.name} ({currentRobot.id}) - Detailed Status
              </Text>

              <View style={styles.robotDetails}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Overall Health:</Text>
                  <Text
                    style={[
                      styles.statValue,
                      getHealthColor(currentRobot.health),
                    ]}
                  >
                    {currentRobot.health}%
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Battery Health:</Text>
                  <Text
                    style={[
                      styles.statValue,
                      getHealthColor(currentRobot.batteryHealth),
                    ]}
                  >
                    {currentRobot.batteryHealth}%
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Sensors:</Text>
                  <Text
                    style={[
                      styles.statValue,
                      currentRobot.sensors === "Normal"
                        ? styles.healthGreen
                        : styles.healthYellow,
                    ]}
                  >
                    {currentRobot.sensors}
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Firmware:</Text>
                  <Text style={styles.statValueBlue}>
                    v{currentRobot.firmware}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Maintenance Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MAINTENANCE SCHEDULE</Text>

          <View style={styles.maintenanceContainer}>
            <View style={[styles.maintenanceCard, styles.maintenanceCompleted]}>
              <View style={styles.maintenanceHeader}>
                <Text style={styles.maintenanceTitleGreen}>
                  Last Maintenance
                </Text>
                <Text style={styles.maintenanceStatus}>Completed</Text>
              </View>
              <Text style={styles.maintenanceDate}>
                {new Date(systemStats.lastMaintenance).toLocaleDateString()}
              </Text>
            </View>

            <View style={[styles.maintenanceCard, styles.maintenanceScheduled]}>
              <View style={styles.maintenanceHeader}>
                <Text style={styles.maintenanceTitleYellow}>
                  Next Maintenance
                </Text>
                <Text style={styles.maintenanceStatusYellow}>Scheduled</Text>
              </View>
              <Text style={styles.maintenanceDate}>
                {new Date(systemStats.nextMaintenance).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cyberButton}>
            <Text style={styles.buttonText}>SCHEDULE MAINTENANCE</Text>
          </TouchableOpacity>
        </View>

        {/* Firmware Updates */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FIRMWARE STATUS</Text>

          <View style={styles.firmwareContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Current Version:</Text>
              <Text style={styles.statValueGreen}>v2.1.3</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Available Update:</Text>
              <Text style={styles.statValueBlue}>v2.1.4</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Robots Up-to-date:</Text>
              <Text style={styles.statValueYellow}>3/4</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cyberButton}>
            <Text style={styles.buttonText}>UPDATE ALL ROBOTS</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.cyberButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f12",
  },
  scrollContent: {
    paddingBottom: 40, // Add padding at the bottom for the logout button
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#ff6600",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontFamily: "monospace",
    color: "#999",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "#ff660030",
    borderWidth: 1,
  },
  cardTitle: {
    color: "#ff6600",
    fontFamily: "monospace",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
  statsContainer: {
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#888",
  },
  statValue: {
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  statValueGreen: {
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#00ff99",
  },
  statValueBlue: {
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#3399ff",
  },
  statValueOrange: {
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#ff6600",
  },
  statValueYellow: {
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#ffcc00",
  },
  robotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  robotButton: {
    width: "48%",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  robotButtonActive: {
    borderColor: "#ff6600",
    backgroundColor: "#ff660010",
  },
  robotButtonInactive: {
    borderColor: "#ff660020",
  },
  robotButtonContent: {
    alignItems: "center",
  },
  robotName: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#ff6600",
    fontSize: 12,
  },
  robotHealth: {
    fontSize: 20,
    fontFamily: "monospace",
    fontWeight: "bold",
    marginTop: 4,
  },
  robotHealthLabel: {
    fontSize: 10,
    color: "#888",
    fontFamily: "monospace",
  },
  healthGreen: {
    color: "#00ff99",
  },
  healthYellow: {
    color: "#ffcc00",
  },
  healthRed: {
    color: "#ff0033",
  },
  robotDetailCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    borderColor: "#ff660020",
    borderWidth: 1,
  },
  robotDetailTitle: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#ff6600",
    fontSize: 14,
    marginBottom: 8,
  },
  robotDetails: {
    gap: 8,
  },
  maintenanceContainer: {
    gap: 8,
    marginBottom: 12,
  },
  maintenanceCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  maintenanceCompleted: {
    borderColor: "#00ff9920",
  },
  maintenanceScheduled: {
    borderColor: "#ffcc0020",
  },
  maintenanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  maintenanceTitleGreen: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#00ff99",
    fontSize: 12,
  },
  maintenanceTitleYellow: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#ffcc00",
    fontSize: 12,
  },
  maintenanceStatus: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#888",
  },
  maintenanceStatusYellow: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#ffcc00",
  },
  maintenanceDate: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#888",
  },
  firmwareContainer: {
    gap: 8,
    marginBottom: 12,
  },
  cyberButton: {
    backgroundColor: "#ff660020",
    borderColor: "#ff6600",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#ff6600",
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#ff000020",
    borderColor: "#ff0033",
  },
});

export default SystemStatus;
