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
  
  const { addTransaction } = useTransactions();
  const { expenseCategories, incomeCategories, addCategory } = useCategories();

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
          emoji: "📝",
          icon: selectedType === "Expenses" ? "receipt-outline" : "cash-outline",
          type: selectedType === "Expenses" ? "expense" : "income"
        };

        addCategory(newCategory);
        setSelectedCategory(newCategory.id);
      },
      "plain-text",
      "",
      ["Cancel","Add"] 
    );
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const transaction = {
      id: Date.now(),
      title: note || categories.find(c => c.id === selectedCategory)?.name || "Transaction",
      amount: parseFloat(amount) * (selectedType === "Expenses" ? -1 : 1),
      category: categories.find(c => c.id === selectedCategory)?.name || "Other",
      date: new Date().toISOString(),
    };

    const result = await addTransaction(transaction);
    if (result.success) {
      Alert.alert(
        "Success",
        `Transaction saved successfully!\n\n${selectedType}: Rs${amount}\nCategory: ${transaction.category}`,
        {
          text: "OK",
          onPress: () => {
            setAmount("");
            setNote("");
            setSelectedCategory(null);
          },
        }
      );
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
            onPress={handleAddCategory}
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
        />
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
});

export default Add;