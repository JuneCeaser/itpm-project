import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

const Category = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nameError, setNameError] = useState("");
  const [iconError, setIconError] = useState("");

  // Icons for selection
  const availableIcons = [
    "restaurant-outline",
    "car-outline",
    "cart-outline",
    "receipt-outline",
    "film-outline",
    "medkit-outline",
    "school-outline",
    "gift-outline",
    "trending-up-outline",
    "airplane-outline",
    "person-outline",
    "home-outline",
    "wifi-outline",
    "cafe-outline",
    "fitness-outline",
    "musical-notes-outline",
    "book-outline",
    "paw-outline",
    "beer-outline",
    "color-palette-outline"
  ];

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCategoryName("");
    setSelectedIcon(null);
    setNameError("");
    setIconError("");
  };

  const handleSave = () => {
    // Validation
    let isValid = true;
    
    if (!categoryName.trim()) {
      setNameError("Category name is required");
      isValid = false;
    } else {
      setNameError("");
    }
    
    if (!selectedIcon) {
      setIconError("Please select an icon");
      isValid = false;
    } else {
      setIconError("");
    }
    
    if (!isValid) return;
    
    // Show success message (UI only)
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeModal();
    }, 1500);
  };

  const renderIcon = (iconName) => {
    return <Ionicons name={iconName} size={24} color="#fff" />;
  };

  // Categories data
  const categories = [
    [
      { name: "Food", icon: "restaurant-outline", color: "#FF6B6B" },
      { name: "Transport", icon: "car-outline", color: "#4ECDC4" },
      { name: "Shopping", icon: "cart-outline", color: "#FFD166" }
    ],
    [
      { name: "Bills", icon: "receipt-outline", color: "#06D6A0" },
      { name: "Entertainment", icon: "film-outline", color: "#118AB2" },
      { name: "Health", icon: "medkit-outline", color: "#EF476F" }
    ],
    [
      { name: "Education", icon: "school-outline", color: "#7209B7" },
      { name: "Gifts", icon: "gift-outline", color: "#F15BB5" },
      { name: "Investments", icon: "trending-up-outline", color: "#00BBF9" }
    ],
    [
      { name: "Travel", icon: "airplane-outline", color: "#9B5DE5" },
      { name: "Personal", icon: "person-outline", color: "#00F5D4" },
      { name: "Others", icon: "ellipsis-horizontal", color: "#FEE440" }
    ]
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00C49A" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <View style={styles.balanceIconContainer}>
              <Ionicons name="checkbox-outline" size={16} color="#00C49A" />
            </View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>$7,783.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.balanceItem}>
            <View style={styles.balanceIconContainer}>
              <Ionicons name="checkbox-outline" size={16} color="#00C49A" />
            </View>
            <Text style={styles.balanceLabel}>Total Expense</Text>
            <Text style={[styles.balanceValue, styles.expenseValue]}>
              -$1,187.40
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>30%</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.maxAmount}>$20,000.00</Text>
        </View>

        {/* Status Message */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIconContainer}>
            <Ionicons name="checkbox-outline" size={16} color="#00C49A" />
          </View>
          <Text style={styles.statusText}>
            30% Of Your Expenses, Looks Good.
          </Text>
        </View>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesContainer}>
        {/* Add Category Button */}
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Ionicons name="add" size={24} color="#00C49A" />
          <Text style={styles.addButtonText}>Add Category</Text>
        </TouchableOpacity>

        {categories.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.categoriesRow}>
            {row.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  {renderIcon(category.icon)}
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Add Category Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Category Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter category name"
                  value={categoryName}
                  onChangeText={setCategoryName}
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>

              {/* Icon Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Icon</Text>
                <View style={styles.iconGrid}>
                  {availableIcons.map((icon, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.iconOption,
                        selectedIcon === icon && styles.selectedIconOption
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Ionicons
                        name={icon}
                        size={24}
                        color={selectedIcon === icon ? "#fff" : "#00C49A"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {iconError ? <Text style={styles.errorText}>{iconError}</Text> : null}
              </View>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Category</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Message */}
      {showSuccess && (
        <View style={styles.successMessage}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.successText}>Category saved successfully!</Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="credit-card" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Feather name="grid" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00C49A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  balanceContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceItem: {
    flex: 1,
  },
  balanceIconContainer: {
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  expenseValue: {
    color: "#FF4F4F",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ffffff40",
  },
  progressContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 12,
    marginRight: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#ffffff40",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  maxAmount: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  statusIconContainer: {
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
  },
  categoriesContainer: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    width: "30%",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EAEFF5",
    paddingVertical: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: "#00C49A",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#00C49A",
  },
  addButtonText: {
    color: "#00C49A",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedIconOption: {
    backgroundColor: "#00C49A",
  },
  saveButton: {
    backgroundColor: "#00C49A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF4F4F",
    fontSize: 12,
    marginTop: 4,
  },
  successMessage: {
    position: "absolute",
    top: "50%",
    left: "20%",
    right: "20%",
    backgroundColor: "#00C49A",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  successText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Category;