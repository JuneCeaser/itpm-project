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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, name: "Food", emoji: "🍽️" },
    { id: 2, name: "Transport", emoji: "🚗" },
    { id: 3, name: "Entertainment", emoji: "🍿" },
    { id: 4, name: "Shopping", emoji: "🛍️" },
    { id: 5, name: "Bills", emoji: "💸" },
  ]);

  const [incomeCategories, setIncomeCategories] = useState([
    { id: 6, name: "Salary", emoji: "💰" },
    { id: 7, name: "Freelance", emoji: "🖥️" },
    { id: 8, name: "Investments", emoji: "📈" },
    { id: 9, name: "Gifts", emoji: "🎁" },
    { id: 10, name: "Other", emoji: "🔄" },
  ]);

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

  const handleAddCategory = () => {
    Alert.prompt(
      "New Category",
      "Enter category name:",
      (categoryName) => {
        if (!categoryName || categoryName.trim() === "") {
          Alert.alert("Error", "Category name cannot be empty");
          return;
        }

        if (categoryName.length > 15) {
          Alert.alert("Error", "Category name is too long (max 15 characters)");
          return;
        }

        const newCategory = {
          id: Date.now(),
          name: categoryName,
          emoji: "➕",
        };

        if (selectedType === "Expenses") {
          setExpenseCategories([...expenseCategories, newCategory]);
        } else {
          setIncomeCategories([...incomeCategories, newCategory]);
        }

        setSelectedCategory(newCategory.id);
      },
      "plain-text",
      "",
      ["Cancel", "Add"]
    );
  };

  const handleSave = () => {
    if (validateForm()) {
      // Here you would typically save to your database/state
      const transaction = {
        type: selectedType,
        category: categories.find(c => c.id === selectedCategory),
        amount: parseFloat(amount),
        note: note,
        date: new Date().toISOString(),
      };

      Alert.alert(
        "Success",
        `Transaction saved successfully!\n\n${transaction.type}: $${transaction.amount.toFixed(2)}\nCategory: ${transaction.category.name}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form after successful save
              setAmount("");
              setNote("");
              setSelectedCategory(null);
            },
          },
        ]
      );
    }
  };

  const formatAmount = (text) => {
    // Remove all non-digit characters except decimal point
    let cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalParts = cleanedText.split('.');
    if (decimalParts.length > 2) {
      cleanedText = decimalParts[0] + '.' + decimalParts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (decimalParts.length === 2 && decimalParts[1].length > 2) {
      cleanedText = decimalParts[0] + '.' + decimalParts[1].substring(0, 2);
    }
    
    setAmount(cleanedText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00c89c" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={styles.placeholder} />
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
        <Text style={styles.currencySymbol}>$</Text>
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
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
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
            onPress={handleAddCategory}
            disabled={keyboardVisible}
          >
            <Ionicons name="add-circle" size={36} color="#00c89c" />
            <Text style={styles.categoryText}>New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Note Input */}
      <View style={styles.noteContainer}>
        <Text style={styles.sectionTitle}>Note (Optional)</Text>
        <TextInput
          placeholder="Add a note..."
          placeholderTextColor="#999"
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          maxLength={50}
          multiline
        />
        <Text style={styles.charCount}>{note.length}/50</Text>
      </View>

      {/* Save Button - Only show when keyboard is not visible */}
      {!keyboardVisible && (
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Transaction</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
  addCategoryItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 15,
    minWidth: 80,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  noteContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    color: "#999",
    fontSize: 12,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
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
});

export default Add;