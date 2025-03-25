import React from "react";
import {
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  StatusBar
} from "react-native";
import {
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";

const Add = () => {
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
        <TouchableOpacity style={[styles.typeSelector, styles.activeTyeSelector]}>
          <Text style={styles.typeSelectorText}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.typeSelector}>
          <Text style={styles.typeSelectorTextInactive}>Income</Text>
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
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <TouchableOpacity style={styles.newCategoryButton}>
            <Ionicons name="add" size={20} color="#00c89c" />
            <Text style={styles.newCategoryText}>New</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
        >
          {/* Food Category */}
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.foodIcon]}>
              <Text style={styles.categoryIconText}>🍽️</Text>
            </View>
            <Text style={styles.categoryText}>Food</Text>
          </TouchableOpacity>

          {/* Transport Category */}
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.transportIcon]}>
              <Text style={styles.categoryIconText}>🚗</Text>
            </View>
            <Text style={styles.categoryText}>Transport</Text>
          </TouchableOpacity>

          {/* Entertainment Category */}
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.entertainmentIcon]}>
              <Text style={styles.categoryIconText}>🍿</Text>
            </View>
            <Text style={styles.categoryText}>Entertainment</Text>
          </TouchableOpacity>

          {/* Shopping Category */}
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.shoppingIcon]}>
              <Text style={styles.categoryIconText}>🛍️</Text>
            </View>
            <Text style={styles.categoryText}>Shopping</Text>
          </TouchableOpacity>

          {/* Bills Category */}
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.billsIcon]}>
              <Text style={styles.categoryIconText}>💸</Text>
            </View>
            <Text style={styles.categoryText}>Bills</Text>
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
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 6,
  },
  typeSelector: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 15,
  },
  activeTyeSelector: {
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
    borderRadius:20,
    paddingVertical: 20,
    margin: 5,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  newCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  newCategoryText: {
    color: "#00c89c",
    marginLeft: 5,
    fontWeight: "bold",
  },
  categoriesScrollView: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
  },
  foodIcon: {
    backgroundColor: "#e3f2fd",
  },
  transportIcon: {
    backgroundColor: "#e8eaf6",
  },
  entertainmentIcon: {
    backgroundColor: "#f3e5f5",
  },
  shoppingIcon: {
    backgroundColor: "#f1f8e9",
  },
  billsIcon: {
    backgroundColor: "#fff3e0",
  },
  saveButton: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#00c89c",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Add;