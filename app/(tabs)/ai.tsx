import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  sender: "user" | "arsona";
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I am Arsona AI, the brain of your Sentinel fire suppression robot. I am here to guide you through emergencies, provide system status, and help with any questions about fire safety. How can I assist you today?",
      sender: "arsona",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateArsonaResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (/fire|emergency|help/i.test(lowerMessage)) {
      return "🚨 Emergency detected. I'm analyzing the situation. If there's an active fire, please evacuate immediately via the nearest safe exit. I'm deploying Sentinel Alpha to assess and respond. Stay calm and follow my guidance.";
    }

    if (/exit|escape|way out/i.test(lowerMessage)) {
      return "📍 The nearest safe exit is Stairwell C, approximately 20 meters to your left. Avoid elevators during emergencies. Stay low if there's smoke, and proceed calmly to the assembly point outside.";
    }

    if (/type of fire|what fire/i.test(lowerMessage)) {
      return "🔍 Based on sensor analysis: Electrical fire detected in Server Room. I'm selecting CO₂ suppression to safely extinguish without damaging equipment. Estimated suppression time: 45 seconds.";
    }

    if (/stay|room|safe/i.test(lowerMessage)) {
      return "⚠️ For your safety, I recommend immediate evacuation. Current air quality shows elevated CO levels. Please exit via the designated route - I'll guide you step by step.";
    }

    if (/help on the way|assistance/i.test(lowerMessage)) {
      return "🚒 Emergency services have been automatically notified. ETA: 6 minutes. I'm maintaining suppression efforts and monitoring all escape routes. You are not alone - I'm here to guide you.";
    }

    if (/robot|sentinel|location/i.test(lowerMessage)) {
      return "🤖 Sentinel Alpha is currently patrolling Floor 2 - East Wing. Battery: 87%, all systems operational. I can redirect it to any zone if needed. Suppression agents fully loaded: CO₂ 95%, Water Mist 89%, Chemical Foam 92%.";
    }

    if (/pause|stop|human detected/i.test(lowerMessage)) {
      return "⏸️ Understood. Pausing autonomous suppression protocol. Human safety is my top priority. I'll wait for your signal or clear evacuation before resuming fire suppression operations.";
    }

    if (/verify|blockchain|log/i.test(lowerMessage)) {
      return "🔗 All actions are logged on Solana blockchain for verification. Latest entry: Fire Detection - Floor 2, 14:23:45, Hash: 0x7f4a9b... This creates an immutable record for insurance and safety audits.";
    }

    if (/status|system|health/i.test(lowerMessage)) {
      return "✅ All systems operational. Fire risk score: 23/100 (Low). Sensor network: 100% online. Agent levels optimal. Last maintenance: 2 days ago. Next calibration: Tomorrow 02:00.";
    }

    if (/hello|hi/i.test(lowerMessage)) {
      return "Hello! I'm Arsona AI, your building's intelligent fire suppression system. I'm constantly monitoring for threats and ready to protect you. Is there anything specific you'd like to know about our safety systems?";
    }

    return "I understand your concern. As your AI safety guardian, I'm designed to protect life first, then property. Could you provide more details about your situation? I'm here to offer clear, actionable guidance to keep you safe.";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setTimeout(() => {
      const arsonaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateArsonaResponse(inputText),
        sender: "arsona",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, arsonaResponse]);
    }, 1000);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    console.log("Voice input toggled:", !isListening);
  };

  const handleQuickAction = (text: string) => {
    setInputText(text);
    handleSendMessage();
  };

  const handleKeyboardShow = () => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ARSONA AI</Text>
          <Text style={styles.subtitle}>INTELLIGENT FIRE SAFETY ASSISTANT</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>ONLINE & MONITORING</Text>
          </View>
        </View>

        {/* Messages Container */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "padding"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.select({
            ios: 100,
            android: 50,
          })}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.sender === "user"
                    ? styles.userWrapper
                    : styles.arsonaWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === "user"
                      ? styles.userBubble
                      : styles.arsonaBubble,
                  ]}
                >
                  {message.sender === "arsona" && (
                    <View style={styles.arsonaHeader}>
                      <View style={styles.arsonaIndicator} />
                      <Text style={styles.arsonaHeaderText}>ARSONA AI</Text>
                    </View>
                  )}
                  <Text style={styles.messageText}>{message.text}</Text>
                  <Text style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {[
              "Where is the nearest exit?",
              "Show robot status",
              "What type of fire is it?",
              "Is help on the way?",
            ].map((action) => (
              <TouchableOpacity
                key={action}
                style={styles.quickActionButton}
                onPress={() => handleQuickAction(action)}
              >
                <Text style={styles.quickActionText}>
                  {action.includes("exit")
                    ? "Nearest Exit"
                    : action.includes("robot")
                    ? "Robot Status"
                    : action.includes("type")
                    ? "Fire Type"
                    : "Help Status"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={textInputRef}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask Arsona AI anything about fire safety..."
                placeholderTextColor="#888"
                style={styles.textInput}
                multiline
                blurOnSubmit={false}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.voiceButton,
                isListening && styles.voiceButtonActive,
              ]}
              onPress={toggleVoiceInput}
            >
              {isListening ? (
                <MaterialIcons name="mic-off" size={20} color="#ff0033" />
              ) : (
                <MaterialIcons name="mic" size={20} color="#ff6600" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <MaterialIcons name="send" size={20} color="#ff6600" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#0f0f12",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 102, 0, 0.3)",
  },
  title: {
    fontSize: 24,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#ff6600",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontFamily: "monospace",
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#00ff99",
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#00ff99",
  },
  messagesContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userWrapper: {
    alignItems: "flex-end",
  },
  arsonaWrapper: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: "rgba(255, 102, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 102, 0, 0.3)",
  },
  arsonaBubble: {
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(51, 153, 255, 0.3)",
  },
  arsonaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  arsonaIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#3399ff",
    borderRadius: 4,
    marginRight: 8,
  },
  arsonaHeaderText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#3399ff",
    fontWeight: "bold",
  },
  messageText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#888",
    marginTop: 8,
    textAlign: "right",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  quickActionButton: {
    width: (width - 48) / 2,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 102, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 102, 0, 0.3)",
    borderRadius: 6,
    alignItems: "center",
  },
  quickActionText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#ff6600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: Platform.select({ ios: 16, android: 8 }),
    gap: 8,
  },
  textInputContainer: {
    flex: 1,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255, 102, 0, 0.3)",
    borderRadius: 12,
    padding: 12,
    fontFamily: "monospace",
    color: "#ccc",
    textAlignVertical: "top",
    minHeight: 50,
    maxHeight: 100,
  },
  voiceButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 102, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 102, 0, 0.3)",
    borderRadius: 12,
  },
  voiceButtonActive: {
    backgroundColor: "rgba(255, 0, 51, 0.2)",
    borderColor: "rgba(255, 0, 51, 0.3)",
  },
  sendButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 102, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 102, 0, 0.3)",
    borderRadius: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatBot;
