import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";// For storing and retrieving data locally

const VerifyOTP = ({ navigation }) => {
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {// Function to handle OTP verification
    try {
      const email = await AsyncStorage.getItem("email"); // Retrieve stored email

      if (!email) {// If email is not found in local storage
        Alert.alert("Error", "Email not found. Please sign up again.");// Show error alert
        return;
      }

      if (!otp || otp.length !== 6 || isNaN(otp)) {// Validate OTP format (must be 6 digits)
        Alert.alert("Error", "Please enter a valid 6-digit OTP.");// Show error alert for invalid OTP
        return;
      }

      const response = await axios.post(// Send OTP and email to backend for verificationchan
        "https://mobile-backend-news.vercel.app/api/users/verify",
        { email, otp }
      );

      await AsyncStorage.removeItem("email");

      Alert.alert("Success", response.data.msg);

      // Use "Auth" instead of "AuthScreen"
      navigation.replace("Auth");
    } catch (err) {
      Alert.alert(
        "Verification Failed",
        err.response ? err.response.data.error : "Invalid OTP"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        autoCapitalize="none"
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00D09E",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VerifyOTP;
