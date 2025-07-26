import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f0f12",
          height: 70, // fixed height
          paddingBottom: 10,
          paddingTop: 5,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: -1 },
          shadowRadius: 4,
          elevation: 8, // for Android
        },
        tabBarActiveTintColor: "#ff4500",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "monospace",
          textTransform: "uppercase",
        },
        tabBarItemStyle: {
          width: 80, // fixed width for each tab
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cameras"
        options={{
          title: "Cameras",
          tabBarIcon: ({ color }) => (
            <Ionicons name="videocam-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="control"
        options={{
          title: "Control",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="gamepad-variant-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "BOT AI",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
