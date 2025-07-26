import React from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Robot {
  id: string;
  name: string;
  battery: number;
  status: "Patrolling" | "Charging" | "Suppressing" | "Maintenance" | "Idle";
  location: string;
}

const robots: Robot[] = [
  {
    id: "RS-001",
    name: "Sentinel Alpha",
    battery: 20,
    status: "Charging",
    location: "Floor 2 - East Wing",
  },
  {
    id: "RS-002",
    name: "Sentinel Beta",
    battery: 75,
    status: "Patrolling",
    location: "Floor 1 - Lobby",
  },
  {
    id: "RS-003",
    name: "Sentinel Gamma",
    battery: 50,
    status: "Idle",
    location: "Dock Bay",
  },
];

const RobotStatusGrid = () => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Patrolling":
        return { container: styles.statusGreen, text: styles.statusTextGreen };
      case "Charging":
        return { container: styles.statusYellow, text: styles.statusTextYellow };
      case "Suppressing":
        return { container: styles.statusRed, text: styles.statusTextRed };
      case "Maintenance":
        return { container: styles.statusBlue, text: styles.statusTextBlue };
      case "Idle":
      default:
        return { container: styles.statusGray, text: styles.statusTextGray };
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return styles.batteryGreen;
    if (battery > 30) return styles.batteryYellow;
    return styles.batteryRed;
  };

  const renderRobotCard = (robot: Robot) => {
    const strokeDashoffset = circumference * (1 - robot.battery / 100);

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.robotName}>{robot.name}</Text>
          <Text style={styles.robotId}>{robot.id}</Text>
        </View>

        <View style={styles.batteryContainer}>
          <Svg width={80} height={80} style={{ transform: [{ rotate: "-90deg" }] }}>
            <Circle cx={40} cy={40} r={30} stroke="#333" strokeWidth={4} fill="none" opacity={0.3} />
            <Circle
              cx={40}
              cy={40}
              r={30}
              stroke={getBatteryColor(robot.battery).color}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </Svg>
          <View style={styles.batteryTextContainer}>
            <Text style={[styles.batteryText, getBatteryColor(robot.battery)]}>
              {robot.battery}%
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, getStatusColor(robot.status).container]}>
          <Text style={[styles.statusText, getStatusColor(robot.status).text]}>
            {robot.status}
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>CURRENT LOCATION</Text>
          <Text style={styles.locationValue}>{robot.location}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BUILDING SENTINEL STATUS</Text>
      <FlatList
        data={robots}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <View style={{ marginRight: 16 }}>{renderRobotCard(item)}</View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.2)',
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#FFA500",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 0.5,
    borderColor: "#FFA50020",
    borderRadius: 12,
    padding: 20,
    width: Dimensions.get("window").width * 0.75,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  robotName: {
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#FFA500",
  },
  robotId: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#888",
  },
  batteryContainer: {
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  batteryTextContainer: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  batteryText: {
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  batteryGreen: {
    color: "#00FF00",
  },
  batteryYellow: {
    color: "#FFFF00",
  },
  batteryRed: {
    color: "#FF0000",
  },
  statusBadge: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusTextGreen: { color: "#00FF99" },
  statusTextYellow: { color: "#FFFF00" },
  statusTextRed: { color: "#FF0000" },
  statusTextBlue: { color: "#0080FF" },
  statusTextGray: { color: "#888" },
  statusText: {
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  statusGreen: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    borderColor: "#00FF00",
    borderWidth: 1,
  },
  statusYellow: {
    backgroundColor: "rgba(255, 255, 0, 0.1)",
    borderColor: "#FFFF00",
    borderWidth: 1,
  },
  statusRed: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderColor: "#FF0000",
    borderWidth: 1,
  },
  statusBlue: {
    backgroundColor: "rgba(0, 128, 255, 0.1)",
    borderColor: "#0080FF",
    borderWidth: 1,
  },
  statusGray: {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderColor: "#808080",
    borderWidth: 1,
  },
  locationContainer: {
    alignItems: "center",
  },
  locationLabel: {
    fontSize: 10,
    color: "#888",
    fontFamily: "monospace",
  },
  locationValue: {
    fontSize: 13,
    color: "#ccc",
    marginTop: 4,
    fontFamily: "monospace",
  },
});

export default RobotStatusGrid;
