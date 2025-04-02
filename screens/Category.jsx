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
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from '../context/CategoryContext';

const Category = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nameError, setNameError] = useState("");
  const [iconError, setIconError] = useState("");
  const [activeTab, setActiveTab] = useState("expense");
  const [editingCategory, setEditingCategory] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const { 
    expenseCategories, 
    incomeCategories, 
    addCategory,
    deleteCategory,
    refresh: refreshCategories 
  } = useCategories();

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

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setSelectedIcon(category.icon);
      // Set the active tab to match the category type
      setActiveTab(category.type);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setSelectedIcon(null);
      // Tab remains as is for new categories
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCategoryName("");
    setSelectedIcon(null);
    setNameError("");
    setIconError("");
    setEditingCategory(null);
  };

  const handleSave = async () => {
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

    const categoryData = {
      id: editingCategory ? editingCategory.id : null, // Pass null for new categories
      name: categoryName,
      emoji: editingCategory?.emoji || "📝",
      icon: selectedIcon,
      // Use the original category type when editing, otherwise use active tab
      type: editingCategory ? editingCategory.type : activeTab,
    };

    await addCategory(categoryData);
    await refreshCategories();

    // Show success message with animation
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowSuccess(false);
      closeModal();
      fadeAnim.setValue(0);
    });
  };

  const handleDelete = (category) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await deleteCategory(category.id);
            await refreshCategories();
            showSuccessMessage();
          }
        }
      ]
    );
  };

  const renderIcon = (iconName) => {
    return <Ionicons name={iconName} size={24} color="#fff" />;
  };

  const categories = activeTab === "expense" ? expenseCategories : incomeCategories;


  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 3) {
    groupedCategories.push(categories.slice(i, i + 3));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00C49A" barStyle="light-content"/>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff"/>
        </TouchableOpacity>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "expense" && styles.activeTab]}
          onPress={() => setActiveTab("expense")}
        >
          <Text style={[styles.tabText, activeTab === "expense" && styles.activeTabText]}>
            Expenses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "income" && styles.activeTab]}
          onPress={() => setActiveTab("income")}
        >
          <Text style={[styles.tabText, activeTab === "income" && styles.activeTabText]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories Container */}
      <View style={styles.categoriesContainer}>
        {/* Add Category Button */}
        <TouchableOpacity
          style={[styles.addButton, activeTab === "income" && styles.addButtonIncome]}
          onPress={() => openModal()}
        >
          <Ionicons 
            name="add" 
            size={24} 
            color={activeTab === "expense" ? "#00C49A" : "#00C49A"} 
          />
          <Text style={[styles.addButtonText, activeTab === "income" && styles.addButtonTextIncome]}>
            Add {activeTab === "expense" ? "Expense" : "Income"} Category
          </Text>
        </TouchableOpacity>

        {/* Categories Grid */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {groupedCategories.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.categoriesRow}>
              {row.map((category, index) => (
                <TouchableOpacity 
                  key={category.id} // Use category.id for better key uniqueness
                  style={styles.categoryItem}
                  onPress={() => openModal(category)}
                  onLongPress={() => handleDelete(category)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: '#00c89c' }]}>
                    <Ionicons name={category.icon} size={24} color="#fff"/>
                  </View>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Add/Edit Category Modal */}
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
              <Text style={styles.modalTitle}>
                {editingCategory ? "Edit" : "Add New"} {activeTab === "expense" ? "Expense" : "Income"} Category
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666"/>
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
                
                {/* Selected Icon Preview */}
                {selectedIcon && (
                  <View style={styles.selectedIconPreview}>
                    <View style={styles.previewIconContainer}>
                      <Ionicons name={selectedIcon} size={30} color="#fff" />
                    </View>
                    <Text style={styles.selectedIconText}>Selected Icon</Text>
                  </View>
                )}
                
                {/* Icon Grid */}
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
            <TouchableOpacity
              style={[styles.saveButton, activeTab === "income" && styles.saveButtonIncome]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {editingCategory ? "Update" : "Save"} {activeTab === "expense" ? "Expense" : "Income"} Category
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modern Success Message */}
      {showSuccess && (
        <Animated.View 
          style={[
            styles.successMessage,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.successContent}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.successText}>
              Category {editingCategory ? "updated" : "saved"} successfully!
            </Text>
          </View>
        </Animated.View>
      )}
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#00C49A",
  },
  tabText: {
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
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
    backgroundColor: '#00c89c', 
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
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
  addButtonIncome: {
    borderColor: "#00C49A",
  },
  addButtonText: {
    color: "#00C49A",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  addButtonTextIncome: {
    color: "#00C49A",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
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
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  
  selectedIconPreview: {
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
  },
  previewIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#00C49A",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedIconText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconOption: {
    margin: 8,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedIconOption: {
    backgroundColor: "#00C49A",
    borderColor: "#00C49A",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#00C49A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonIncome: {
    backgroundColor: "#00C49A",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
 
  successMessage: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 1000,
  },
  successContent: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  successText: {
    color: "#00C49A",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Category;