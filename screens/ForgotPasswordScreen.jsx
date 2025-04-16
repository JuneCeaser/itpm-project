import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.8.100:5000/api/users/forgot-password",
        { email }
      );

      Alert.alert("Success", response.data.msg);
      navigation.navigate("ResetPassword", { email });
    } catch (err) {
      Alert.alert(
        "Error",
        err.response ? err.response.data.error : "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address to receive a password reset OTP
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00c89c",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backToLogin: {
    marginTop: 20,
    alignSelf: "center",
  },
  backToLoginText: {
    color: "#00c89c",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ForgotPasswordScreen;