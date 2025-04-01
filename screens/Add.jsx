import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from '../context/TransactionContext';
import { useCategories } from '../context/CategoryContext';


const Add = () => {
  const [selectedType, setSelectedType] = useState("Expenses");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({
    amount: "",
    category: "",
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [nameError, setNameError] = useState("");
  const [iconError, setIconError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { addTransaction } = useTransactions();
  const { expenseCategories, incomeCategories, addCategory, loading: categoriesLoading } = useCategories();

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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const categories = selectedType === "Expenses" ? expenseCategories : incomeCategories;

  const validateForm = () => {
    let valid = true;
    const newErrors = { amount: "", category: "" };

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
      valid = false;
    }

    if (!selectedCategory) {
      newErrors.category = "Please select a category";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const openCategoryModal = () => {
    setIsCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalVisible(false);
    setCategoryName("");
    setSelectedIcon(null);
    setNameError("");
    setIconError("");
  };

  const handleSaveCategory = async () => {
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

    const newCategory = {
      id: Date.now().toString(),
      name: categoryName,
      emoji: "📝",
      icon: selectedIcon,
      type: selectedType === "Expenses" ? "expense" : "income"
    };

    const result = await addCategory(newCategory);
    if (result.success) {
      setSelectedCategory(newCategory.id);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        closeCategoryModal();
      }, 1500);
    }
  };

  const handleSaveTransaction = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const transaction = {
        id: Date.now().toString(),
        title: note || categories.find(c => c.id === selectedCategory)?.name || "Transaction",
        amount: parseFloat(amount) * (selectedType === "Expenses" ? -1 : 1),
        category: categories.find(c => c.id === selectedCategory)?.name || "Other",
        date: new Date().toISOString(),
        note: note || undefined,
      };

      const result = await addTransaction(transaction);
      if (result.success) {
        Alert.alert(
          "Success",
          `Transaction saved successfully!\n\n${selectedType}: Rs${amount}\nCategory: ${transaction.category}`,
          [{
            text: "OK",
            onPress: () => {
              setAmount("");
              setNote("");
              setSelectedCategory(null);
            },
          }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatAmount = (text) => {
    let cleanedText = text.replace(/[^0-9.]/g, '');
    const decimalParts = cleanedText.split('.');
    
    if (decimalParts.length > 2) {
      cleanedText = decimalParts[0] + '.' + decimalParts.slice(1).join('');
    }
    
    if (decimalParts.length === 2 && decimalParts[1].length > 2) {
      cleanedText = decimalParts[0] + '.' + decimalParts[1].substring(0, 2);
    }
    
    setAmount(cleanedText);
  };

  const renderCategoryIcon = (category) => {
    return (
      <View style={[
        styles.categoryIconContainer,
        selectedCategory === category.id && styles.selectedCategoryIcon
      ]}>
        <Ionicons 
          name={category.icon} 
          size={24} 
          color={selectedCategory === category.id ? "white" : "#00c89c"} 
        />
      </View>
    );
  };

  if (categoriesLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c89c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00c89c"/>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={styles.placeholder}/>
      </View>

      {/* Type Selector */}
      <View style={styles.typeSelectorContainer}>
        <TouchableOpacity
          style={[styles.typeSelector, selectedType === "Expenses" && styles.activeTypeSelector]}
          onPress={() => {
            setSelectedType("Expenses");
            setSelectedCategory(null);
            setErrors({...errors, category: ""});
          }}
        >
          <Text style={selectedType === "Expenses" ? styles.typeSelectorText : styles.typeSelectorTextInactive}>
            Expenses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeSelector, selectedType === "Income" && styles.activeTypeSelector]}
          onPress={() => {
            setSelectedType("Income");
            setSelectedCategory(null);
            setErrors({...errors, category: ""});
          }}
        >
          <Text style={selectedType === "Income" ? styles.typeSelectorText : styles.typeSelectorTextInactive}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>LKR</Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor="#666"
          style={styles.amountInput}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={formatAmount}
          onBlur={() => {
            if (amount && !isNaN(parseFloat(amount))) {
              setAmount(parseFloat(amount).toFixed(2));
            }
          }}
        />
      </View>
      {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Select Category</Text>
        {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                setErrors({...errors, category: ""});
              }}
            >
              {renderCategoryIcon(category)}
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Add New Category Button */}
          <TouchableOpacity
            style={styles.addCategoryItem}
            onPress={openCategoryModal}
            disabled={keyboardVisible}
          >
            <View style={styles.categoryIconContainer}>
              <Ionicons name="add-circle" size={24} color="#00c89c"/>
            </View>
            <Text style={styles.categoryText}>New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Note Input */}
      <View style={styles.noteContainer}>
        <Text style={styles.sectionTitle}>Note (Optional)</Text>
        <TextInput
          placeholder="Add a note..."
          placeholderTextColor="#888"
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      {/* Save Button */}
      {!keyboardVisible && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveTransaction}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Transaction</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Add Category Modal */}
      <Modal
        visible={isCategoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCategoryModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add New {selectedType === "Expenses" ? "Expense" : "Income"} Category
              </Text>
              <TouchableOpacity onPress={closeCategoryModal}>
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
                <View style={styles.iconGrid}>
                  {availableIcons.map((icon, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.iconOption,
                        selectedIcon === icon && styles.selectedIconOption,
                        selectedType === "Income" && selectedIcon === icon && styles.selectedIconOptionIncome
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Ionicons
                        name={icon}
                        size={24}
                        color={
                          selectedIcon === icon
                            ? "#fff"
                            : selectedType === "Expenses" ? "#00c89c" : "#4CAF50"
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {iconError ? <Text style={styles.errorText}>{iconError}</Text> : null}
              </View>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.modalSaveButton,
                selectedType === "Income" && styles.modalSaveButtonIncome
              ]}
              onPress={handleSaveCategory}
            >
              <Text style={styles.modalSaveButtonText}>
                Save {selectedType === "Expenses" ? "Expense" : "Income"} Category
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Message */}
      {showSuccess && (
        <View style={[
          styles.successMessage,
          selectedType === "Income" && styles.successMessageIncome
        ]}>
          <Ionicons name="checkmark-circle" size={24} color="#fff"/>
          <Text style={styles.successText}>Category saved successfully!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00c89c",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#00c89c",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  typeSelectorContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 6,
  },
  typeSelector: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTypeSelector: {
    backgroundColor: "#00c89c",
  },
  typeSelectorText: {
    color: "white",
    fontWeight: "bold",
  },
  typeSelectorTextInactive: {
    color: "#666",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  currencySymbol: {
    fontSize: 36,
    color: "white",
    marginRight: 10,
  },
  amountInput: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  noteContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoriesScrollView: {
    paddingVertical: 10,
  },
  categoriesScrollContent: {
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: "#00c89c",
  },
  selectedCategoryText: {
    color: "white",
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedCategoryIcon: {
    backgroundColor: "#00c89c",
  },
  addCategoryItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 15,
    minWidth: 80,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#00c89c",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20,
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
    backgroundColor: "#00c89c",
  },
  selectedIconOptionIncome: {
    backgroundColor: "#4CAF50",
  },
  modalSaveButton: {
    backgroundColor: "#00c89c",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  modalSaveButtonIncome: {
    backgroundColor: "#4CAF50",
  },
  modalSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  successMessage: {
    position: "absolute",
    top: "50%",
    left: "20%",
    right: "20%",
    backgroundColor: "#00c89c",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  successMessageIncome: {
    backgroundColor: "#4CAF50",
  },
  successText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Add;