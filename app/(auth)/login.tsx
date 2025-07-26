import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native"; // Add this import
import { auth } from "../../utils/firebase"; // adjust path if needed

import {
  Animated,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type AuthStackParamList = {
  Dashboard: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export default function ArsonaLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const buttonScale = new Animated.Value(1);
  const router = useRouter();

  const handleFocus = (field: any) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: any) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await AsyncStorage.setItem("user", JSON.stringify(user));
      console.log("User signed in:", user.email);

      // Navigate to Dashboard after successful login
      router.replace("/(tabs)"); // or "/(tabs)/dashboard" if using nested routes
    } catch (error: any) {
      console.error("Login failed:", error);
      let message = "Login failed. Please try again.";
      if (error.code === "auth/invalid-email")
        message = "Invalid email address.";
      else if (error.code === "auth/user-not-found")
        message = "User not found.";
      else if (error.code === "auth/wrong-password")
        message = "Incorrect password.";
      alert(message);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <ImageBackground
      // Replace with your actual background image
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent
            />

            {/* Animated Background Overlay */}
            <Animated.View style={styles.overlay} />

            {/* Loading Modal */}
            <Modal
              transparent={true}
              animationType="fade"
              visible={isLoading}
              onRequestClose={() => {}}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <ActivityIndicator size="large" color="#FF6B35" />
                  <Text style={styles.loadingText}>Authenticating...</Text>
                </View>
              </View>
            </Modal>

            <View style={styles.content}>
              {/* Logo/Title Section */}
              <View style={styles.header}>
                <Ionicons
                  name="shield-checkmark"
                  size={48}
                  color="#FF6B35"
                  style={styles.logo}
                />
                <Text style={styles.title}>ARSONA{"\n"}SENTINEL</Text>
                <Text style={styles.subtitle}>
                  Secure Authentication Portal
                </Text>
              </View>

              {/* Auth Toggle */}
              <View style={styles.authToggle}>
                <TouchableOpacity
                  style={[styles.toggleButton, styles.toggleActive]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.toggleButtonTextActive}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toggleButton}
                  activeOpacity={0.8}
                >
                  <Link href={"/(auth)/signup"} style={styles.toggleButtonText}>
                    SIGN UP
                  </Link>
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    isFocused.email && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={isFocused.email ? "#FF6B35" : "#6b7280"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                  />
                </View>

                <View
                  style={[
                    styles.inputWrapper,
                    isFocused.password && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={isFocused.password ? "#FF6B35" : "#6b7280"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#6b7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotLink}>
                  <Text style={styles.forgotText}>Forgot Credentials?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <Animated.View
                style={[
                  styles.accessButton,
                  { transform: [{ scale: buttonScale }] },
                ]}
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={0.7}
                  style={styles.buttonInner}
                  disabled={isLoading} // Disable button during loading
                >
                  <Text style={styles.accessButtonText}>
                    ACCESS CONTROL GRID
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </Animated.View>

              {/* QR Code Authentication */}
              <View style={styles.qrSection}>
                <Text style={styles.qrText}>
                  Or authenticate using your access QR
                </Text>
                <TouchableOpacity style={styles.qrButton}>
                  <Ionicons name="qr-code-outline" size={28} color="#FF6B35" />
                  <Text style={styles.qrButtonText}>Scan QR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.85)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    marginBottom: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FF6B35",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 40,
    marginBottom: 8,
    textShadowColor: "rgba(255, 107, 53, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    letterSpacing: 1,
  },
  authToggle: {
    flexDirection: "row",
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
  },
  toggleButtonText: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  toggleButtonTextActive: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    backgroundColor: "rgba(30, 30, 36, 0.6)",
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  inputFocused: {
    borderColor: "#FF6B35",
    backgroundColor: "rgba(30, 30, 36, 0.8)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 16,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 8,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  forgotText: {
    color: "#9ca3af",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  accessButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 25,
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  accessButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1.2,
    marginRight: 10,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    textShadowColor: "rgba(255, 107, 53, 0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  socialLogin: {
    alignItems: "center",
    marginTop: 30,
  },
  socialText: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  qrSection: {
    alignItems: "center",
    marginTop: 30,
  },
  qrText: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 15,
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: "#FF6B35",
    borderWidth: 1,
    borderRadius: 8,
  },
  qrButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "500",
  },
  // Add these new styles for the loading modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#1e1e24",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
  },
});
