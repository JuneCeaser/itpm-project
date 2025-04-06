import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import { Ionicons } from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const { token, logout, hasPin, removePin } = useContext(AuthContext);
  const { resetAllData } = useTransactions();

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        "https://mobile-backend-news.vercel.app/api/users/me",
        {
          headers: { "x-auth-token": token },
        }
      );
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      console.log("Token being sent:", token);
      const response = await axios.delete(
        "https://mobile-backend-news.vercel.app/api/users/delete",
        {
          headers: { "x-auth-token": token },
        }
      );

      Alert.alert("Success", response.data.msg);
      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Session Expired", "Please log in again.");
        logout();
        navigation.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        });
      } else {
        console.error("Error deleting account:", error);
        Alert.alert("Error", "Failed to delete account. Please try again.");
      }
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: handleDeleteAccount,
          style: "destructive",
        },
      ]
    );
  };

  const handleReset = async () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to reset all transaction data? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          onPress: async () => {
            setResetting(true);
            const result = await resetAllData();
            setResetting(false);
            if (result.success) {
              Alert.alert("Success", "All transaction data has been reset.");
            } else {
              Alert.alert("Error", "Failed to reset data. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleRemovePin = async () => {
    Alert.alert(
      "Remove PIN",
      "Are you sure you want to remove your login PIN?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: async () => {
            const success = await removePin();
            if (success) {
              Alert.alert("Success", "Your PIN has been removed successfully.");
            } else {
              Alert.alert("Error", "Failed to remove PIN. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

// In Profile.jsx
useEffect(() => {
  console.log("Current token:", token);
  console.log("Current user:", userDetails);
  
  if (token) {
    fetchUserDetails();
  }
}, [token]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00D09E" />

      {/* Header with gradient effect */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => console.log("Edit profile")}
        >
          <Ionicons name="create-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.contentScroll}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {userDetails?.avatar ? (
            <Image source={{ uri: userDetails.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {userDetails?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          )}

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userDetails?.name || "User Name"}</Text>
            <View style={styles.emailContainer}>
              <Ionicons
                name="mail-outline"
                size={16}
                color="#64748b"
                style={styles.emailIcon}
              />
              <Text style={styles.email}>
                {userDetails?.email || "user@example.com"}
              </Text>
            </View>
          </View>

          {userDetails?.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioLabel}>About me</Text>
              <Text style={styles.bio}>{userDetails.bio}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Account Management</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log("Edit profile")}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color="#6366f1"
                style={styles.buttonIcon}
              />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#c7c7c7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={hasPin ? handleRemovePin : () => navigation.navigate('SetPin')}
            >
              <Ionicons
                name={hasPin ? "lock-open-outline" : "lock-closed-outline"}
                size={22}
                color="#6366f1"
                style={styles.buttonIcon}
              />
              <Text style={styles.actionButtonText}>
                {hasPin ? "Remove Login PIN" : "Set Login PIN"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#c7c7c7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleReset}
            >
              {resetting ? (
                <ActivityIndicator size="small" color="#6366f1" style={styles.buttonIcon} />
              ) : (
                <Ionicons
                  name="refresh-outline"
                  size={22}
                  color="#6366f1"
                  style={styles.buttonIcon}
                />
              )}
              <Text style={styles.actionButtonText}>
                {resetting ? "Resetting..." : "Reset All Data"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#c7c7c7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                logout();
                navigation.navigate("Auth");
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#3498db"
                style={styles.buttonIcon}
              />
              <Text style={[styles.actionButtonText, { color: "#3498db" }]}>
                Logout
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#c7c7c7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteAccount]}
              onPress={confirmDeleteAccount}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color="#e74c3c"
                style={styles.buttonIcon}
              />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentScroll: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#00c89c",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#f8fafc",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#00c89c",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#00c89c",
  },
  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  emailIcon: {
    marginRight: 4,
  },
  email: {
    fontSize: 15,
    color: "#64748b",
  },
  bioContainer: {
    marginTop: 20,
    width: "100%",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
  },
  actionSection: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  buttonContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  buttonIcon: {
    marginRight: 14,
    width: 22,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
  },
  deleteAccount: {
    borderBottomWidth: 0,
  },
  deleteButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "500",
  },
});

export default Profile;
