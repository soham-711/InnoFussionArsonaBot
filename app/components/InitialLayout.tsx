import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function InitialLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
     
    const checkAuthState = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setIsAuthenticated(!!user);
        
        // Use setTimeout to ensure navigation happens after state update
        setTimeout(() => {
          if (user) {
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)/login");
          }
        }, 0);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/(auth)/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a'
      }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  // Return null or empty view while waiting for navigation to complete
 

  return <Stack screenOptions={{ headerShown: false }} />;
}