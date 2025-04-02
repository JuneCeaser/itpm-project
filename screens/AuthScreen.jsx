import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import axios from "axios";
import { AntDesign, Feather } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthScreen = ({ navigation }) => {
  // State for both login and signup
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Signup specific states
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://mobile-backend-news.vercel.app/api/users/login",
        { email, password }
      );

      login(response.data.user, response.data.token);
      Alert.alert("Login Successful", "You have logged in successfully!");
      navigation.navigate("HomeTabs");
    } catch (err) {
      Alert.alert(
        "Login Failed",
        err.response ? err.response.data.error : "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      if (!acceptTerms) {
        Alert.alert("Error", "You must agree to the Terms of Service");
        return;
      }

      const response = await axios.post(
        "https://mobile-backend-news.vercel.app/api/users/signup",
        { name, email, password }
      );

      await AsyncStorage.setItem("email", email);

      Alert.alert("Success", response.data.msg);
      navigation.navigate("VerifyOTP");
    } catch (err) {
      Alert.alert(
        "Error",
        err.response ? err.response.data.error : "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleForgotPassword = () => {
    // Placeholder function - does nothing when pressed
    console.log("Forgot password pressed");
  };

  const renderLoginForm = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.forgotPassword} 
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing in..." : "Sign in"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.dividerText}>Or continue with</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="facebook-square" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="windows" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderSignupForm = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={toggleConfirmPasswordVisibility}
          style={styles.eyeIcon}
        >
          <Feather
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.checkBox}
          onPress={() => setAcceptTerms(!acceptTerms)}
        >
          {acceptTerms && <View style={styles.checkmark} />}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.linkText}>Terms of Service</Text>{" "}
          and <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating account..." : "Create account"}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00c89c" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "login" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("login")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "login" && styles.activeTabText,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "signup" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("signup")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "signup" && styles.activeTabText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "login" ? renderLoginForm() : renderSignupForm()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00c89c",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 30,
    width: "100%",
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#00c89c",
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 16,
  },
  activeTabText: {
    color: "white",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 15,
    fontSize: 16,
    height: 50,
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 15,
    alignItems: "center",
    height: 50,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeIcon: {
    paddingRight: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#00c89c",
    fontSize: 14,
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#00c89c",
    borderRadius: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  linkText: {
    color: "#00c89c",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#00c89c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerText: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  socialButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#00c89c",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthScreen;