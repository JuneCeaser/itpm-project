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
  ActivityIndicator
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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    expenseCategories, 
    incomeCategories, 
    addCategory,
    updateCategory,
    deleteCategory,
    loading: categoriesLoading 
  } = useCategories();

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
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setSelectedIcon(null);
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

    setIsProcessing(true);

    const categoryData = {
      id: editingCategory ? editingCategory.id : Date.now(),
      name: categoryName,
      emoji: "📝",
      icon: selectedIcon,
      type: activeTab,
    };

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(categoryData);
      } else {
        result = await addCategory(categoryData);
      }

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          closeModal();
        }, 1500);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save category. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
            setIsProcessing(true);
            try {
              const result = await deleteCategory(category.id);
              if (!result.success) {
                Alert.alert("Error", "Failed to delete category");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete category");
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const categories = activeTab === "expense" ? expenseCategories : incomeCategories;

  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 3) {
    groupedCategories.push(categories.slice(i, i + 3));
  }

  if (categoriesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00C49A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00C49A" barStyle="light-content"/>
      
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff"/>
        </TouchableOpacity>
      </View>

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

      <View style={styles.categoriesContainer}>
        <TouchableOpacity
          style={[styles.addButton, activeTab === "income" && styles.addButtonIncome]}
          onPress={() => openModal()}
        >
          <Ionicons 
            name="add" 
            size={24} 
            color="#00C49A" 
          />
          <Text style={styles.addButtonText}>
            Add {activeTab === "expense" ? "Expense" : "Income"} Category
          </Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {groupedCategories.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.categoriesRow}>
              {row.map((category, index) => (
                <TouchableOpacity 
                  key={index} 
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Icon</Text>
                <View style={styles.iconGrid}>
                  {availableIcons.map((icon, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.iconOption,
                        selectedIcon === icon && styles.selectedIconOption,
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

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingCategory ? "Update" : "Save"} Category
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {showSuccess && (
        <View style={styles.successMessage}>
          <Ionicons name="checkmark-circle" size={24} color="#fff"/>
          <Text style={styles.successText}>
            Category {editingCategory ? "updated" : "saved"} successfully!
          </Text>
        </View>
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