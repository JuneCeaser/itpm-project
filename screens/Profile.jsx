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
  BackHandler,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import { Ionicons } from "@expo/vector-icons";

// Import local avatar images
const avatar1 = require('../assets/avatars/avatar1.png');
const avatar2 = require('../assets/avatars/avatar2.png');
const avatar3 = require('../assets/avatars/avatar3.png');
const avatar4 = require('../assets/avatars/avatar4.png');
const avatar5 = require('../assets/avatars/avatar5.png');
const avatar6 = require('../assets/avatars/avatar6.png');
const avatar7 = require('../assets/avatars/avatar7.png');
const avatar8 = require('../assets/avatars/avatar8.png');
const avatar9 = require('../assets/avatars/avatar9.png');

// Avatar storage key
const AVATAR_STORAGE_KEY = "user_avatar";

const Profile = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const { token, logout, hasPin, removePin } = useContext(AuthContext);
  const { resetAllData } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Sample avatars using local images
  const sampleAvatars = [
    { id: 1, source: avatar1 },
    { id: 2, source: avatar2 },
    { id: 3, source: avatar3 },
    { id: 4, source: avatar4 },
    { id: 5, source: avatar5 },
    { id: 6, source: avatar6 },
    { id: 7, source: avatar7 },
    { id: 8, source: avatar8 },
    { id: 9, source: avatar9 },
  ];

  // Add BackHandler for hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isLoggingOut) {
          return true;
        }
        if (isEditing) {
          handleCancelEdit();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [isLoggingOut, isEditing]);

  const fetchUserDetails = async () => {
    try {
      // First try to get user data from API
      const response = await axios.get(
        "http://192.168.1.13:5000/api/users/me",
        { headers: { "x-auth-token": token } }
      );
      
      // Get locally stored avatar
      const savedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      
      // If we have a locally saved avatar, use it instead of the server one
      if (savedAvatar) {
        response.data.avatar = savedAvatar;
      }
      
      setUserDetails(response.data);
      setNewName(response.data.name || "");
    } catch (error) {
      console.error("Error fetching user details:", error);
      
      // Even if API fails, try to get saved user data and avatar from local storage
      try {
        const savedUserData = await AsyncStorage.getItem("user_data");
        const savedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
        
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          if (savedAvatar) {
            userData.avatar = savedAvatar;
          }
          setUserDetails(userData);
          setNewName(userData.name || "");
        }
      } catch (storageError) {
        console.error("Error retrieving from storage:", storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to update user's avatar - LOCAL ONLY VERSION
  const selectAvatar = async (avatarId) => {
    try {
      setLoading(true);
      
      const selectedAvatar = sampleAvatars.find(avatar => avatar.id === avatarId);
      if (!selectedAvatar) {
        throw new Error("Avatar not found");
      }

      const avatarKey = `avatar_${avatarId}`;
      
      // Save avatar to local storage only
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, avatarKey);

      // Update local state
      setUserDetails({
        ...userDetails,
        avatar: avatarKey
      });
      
      // Save full user data to local storage
      await AsyncStorage.setItem("user_data", JSON.stringify({
        ...userDetails,
        avatar: avatarKey
      }));
      
      setAvatarModalVisible(false);
      Alert.alert("Success", "Avatar updated Succesfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert("Error", "Failed to update avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get avatar source
  const getAvatarSource = (avatar) => {
    if (!avatar) return null;
    
    // If it's a stored avatar ID (avatar_1, etc.)
    if (typeof avatar === 'string' && avatar.startsWith('avatar_')) {
      const avatarId = parseInt(avatar.split('_')[1]);
      const foundAvatar = sampleAvatars.find(a => a.id === avatarId);
      return foundAvatar ? foundAvatar.source : null;
    }
    
    // If it's a URL (http)
    if (typeof avatar === 'string' && avatar.startsWith('http')) {
      return { uri: avatar };
    }
    
    // Default case (shouldn't normally happen)
    return null;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Don't clear avatar on logout
    // We'll keep AVATAR_STORAGE_KEY intact
    
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear all local storage including avatar
      await AsyncStorage.removeItem(AVATAR_STORAGE_KEY);
      await AsyncStorage.removeItem("user_data");
      
      try {
        const response = await axios.delete(
          "http://192.168.1.13:5000/api/users/delete",
          {
            headers: { "x-auth-token": token },
          }
        );
        Alert.alert("Success", response.data.msg);
      } catch (apiError) {
        console.error("Error deleting account on server:", apiError);
        // Continue with local deletion even if server fails
      }

      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      setIsLoggingOut(false);
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
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

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await axios.put(
        "http://192.168.1.13:5000/api/users/update",
        { name: newName },
        { headers: { "x-auth-token": token } }
      );

      // Update local state
      setUserDetails({
        ...userDetails,
        name: newName
      });

      // Update local storage
      await AsyncStorage.setItem("user_data", JSON.stringify({
        ...userDetails,
        name: newName
      }));

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditPress = () => {
    if (isEditing) {
      handleUpdateProfile();
    } else {
      setNewName(userDetails?.name || "");
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setNewName(userDetails?.name || "");
    setIsEditing(false);
  };

  useEffect(() => {
    const loadProfileData = async () => {
      // Check for locally saved avatar first
      try {
        const savedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
        if (savedAvatar && userDetails) {
          setUserDetails({
            ...userDetails,
            avatar: savedAvatar
          });
        }
      } catch (error) {
        console.error("Error loading saved avatar:", error);
      }
      
      // Fetch user details from server
      if (token) {
        fetchUserDetails();
      }
    };
    
    loadProfileData();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c89c" />
      </View>
    );
  }

  const avatarSource = getAvatarSource(userDetails?.avatar);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00D09E" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditPress}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons 
              name={isEditing ? "checkmark-outline" : "create-outline"} 
              size={22} 
              color="#fff" 
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentScroll}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {userDetails?.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.changeAvatarButton}
              onPress={() => setAvatarModalVisible(true)}
            >
              <Ionicons name="image-outline" size={18} color="#00D09E" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <View style={styles.editingContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus={true}
                  maxLength={50}
                  placeholder="Enter your name"
                />
                {isEditing && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.name}>{userDetails?.name || "User Name"}</Text>
            )}
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

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Account Management</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditPress}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#6366f1" style={styles.buttonIcon} />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#6366f1"
                  style={styles.buttonIcon}
                />
              )}
              <Text style={styles.actionButtonText}>
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Text>
              <Ionicons 
                name={isEditing ? "checkmark-outline" : "chevron-forward"} 
                size={20} 
                color={isEditing ? "#6366f1" : "#c7c7c7"} 
              />
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
              onPress={handleLogout}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={avatarModalVisible}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Avatar</Text>
            
            <FlatList
              data={sampleAvatars}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.avatarOption}
                  onPress={() => selectAvatar(item.id)}
                >
                  <Image source={item.source} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAvatarModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
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
    borderColor: "#f8fafc",
  },
  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D09E',
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  editingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  nameInput: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#00c89c",
    padding: 4,
    textAlign: "center",
    width: "80%",
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  avatarOption: {
    margin: 8,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  avatarOptionImage: {
    width: 70,
    height: 70,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
});

export default Profile;