import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "./components/InitialLayout";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
   if (!fontsLoaded) {
    return null; // or a splash screen
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f12" }}>
        <InitialLayout/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
