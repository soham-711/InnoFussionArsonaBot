import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
 import RobotStatusGrid from '../components/RobotStatusGrid';
import FireRiskScore from '../components/FireRiskScore';
 import AgentLevels from '../components/AgentLevels';
 import EmergencyStop from '../components/EmergencyStop';
 import RecentAlerts from '../components/RecentAlerts';

const Index = () => {
  const [fireRiskScore, setFireRiskScore] = useState(23);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setFireRiskScore((prev) =>
        Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10))
      );
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.neonText}>ARSONA SENTINEL</Text>
        <Text style={styles.subheading}>COMMAND CENTER v2.1.3</Text>
        <Text style={styles.lastUpdate}>
          Last Update: {lastUpdate.toLocaleTimeString()}
        </Text>
      </View>

      {/* Fire Risk Score */}
      <FireRiskScore score={fireRiskScore} />

      {/* Robot Status Grid */}
      <RobotStatusGrid />

      {/* Agent Levels */}
      <AgentLevels />

      {/* Emergency Stop */}
      <EmergencyStop />

      {/* Recent Alerts */}
      <RecentAlerts />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#0f0f12",
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  neonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4500", // neon orange
    fontFamily: "monospace",
    textShadowColor: "#FF4500",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15, // mimic 5px, 10px, 15px glow
  },
  subheading: {
    fontSize: 14,
    color: "#aaa",
    fontFamily: "monospace",
    marginTop: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: "#777",
    fontFamily: "monospace",
    marginTop: 2,
  },
});

export default Index;
