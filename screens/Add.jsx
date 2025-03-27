import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Add = () => {
  const [selectedType, setSelectedType] = useState("Expenses");
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const categories = selectedType === "Expenses" ? expenseCategories : incomeCategories;

  const handleAddCategory = () => {
    Alert.prompt(
      "New Category",
      "Enter category name:",
      (categoryName) => {
        if (!categoryName) return;
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
      }
    );
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
          onPress={() => setSelectedType("Expenses")}
        >
          <Text style={selectedType === "Expenses" ? styles.typeSelectorText : styles.typeSelectorTextInactive}>
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeSelector, selectedType === "Income" && styles.activeTypeSelector]}
          onPress={() => setSelectedType("Income")}
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
          keyboardType="numeric"
        />
      </View>

      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Select Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScrollView}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
          {/* Add New Category Button */}
          <TouchableOpacity style={styles.addCategoryItem} onPress={handleAddCategory}>
            <Ionicons name="add-circle" size={36} color="#00c89c" />
            <Text style={styles.categoryText}>New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </TouchableOpacity>
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
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
  },
  selectedCategory: {
    backgroundColor: "#00c89c",
  },
  addCategoryItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 15,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#00c89c",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Add;
