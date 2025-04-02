import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from '../context/TransactionContext';
import { useCategories } from '../context/CategoryContext';

const Analysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const { transactions } = useTransactions();
  const { expenseCategories, incomeCategories } = useCategories();

  // Filter transactions based on selected period
  const filterTransactions = (period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case "daily":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "weekly":
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const filteredTransactions = filterTransactions(selectedPeriod);

  // Calculate total income and expenses
  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Calculate category totals
  const getCategoryTotals = (type) => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    return categories.map(category => {
      const total = filteredTransactions
        .filter(t => t.category === category.name && 
                   ((type === 'expense' && t.amount < 0) || (type === 'income' && t.amount > 0)))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        ...category,
        total: parseFloat(total.toFixed(2))
      };
    }).filter(cat => cat.total > 0); // Only show categories with transactions
  };

  const expenseCategoryTotals = getCategoryTotals('expense');
  const incomeCategoryTotals = getCategoryTotals('income');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#00cba0" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analysis</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Container */}
      <View style={styles.summaryContainer}>
        <View style={styles.balanceSection}>
          <View style={styles.summaryItem}>
            <View style={styles.labelContainer}>
              <View style={styles.checkboxIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <Text style={styles.summaryLabel}>Total Income</Text>
            </View>
            <Text style={styles.incomeAmount}>LKR {totalIncome.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.labelContainer}>
              <View style={styles.checkboxIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <Text style={styles.summaryLabel}>Total Expense</Text>
            </View>
            <Text style={styles.expenseAmount}>LKR {totalExpenses.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "daily" && styles.activeButton,
          ]}
          onPress={() => setSelectedPeriod("daily")}
        >
          <Text
            style={
              selectedPeriod === "daily"
                ? styles.activePeriodText
                : styles.periodText
            }
          >
            Daily
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "weekly" && styles.activeButton,
          ]}
          onPress={() => setSelectedPeriod("weekly")}
        >
          <Text
            style={
              selectedPeriod === "weekly"
                ? styles.activePeriodText
                : styles.periodText
            }
          >
            Weekly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "monthly" && styles.activeButton,
          ]}
          onPress={() => setSelectedPeriod("monthly")}
        >
          <Text
            style={
              selectedPeriod === "monthly"
                ? styles.activePeriodText
                : styles.periodText
            }
          >
            Monthly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "yearly" && styles.activeButton,
          ]}
          onPress={() => setSelectedPeriod("yearly")}
        >
          <Text
            style={
              selectedPeriod === "yearly"
                ? styles.activePeriodText
                : styles.periodText
            }
          >
            Yearly
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Income Categories */}
        {incomeCategoryTotals.length > 0 && (
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Income Categories</Text>
            {incomeCategoryTotals.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryIcon, { backgroundColor: '#e3f2fd' }]}>
                    <Ionicons name={category.icon} size={20} color="#2196F3" />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>LKR {category.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Expense Categories */}
        {expenseCategoryTotals.length > 0 && (
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Expense Categories</Text>
            {expenseCategoryTotals.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryIcon, { backgroundColor: '#e8f5e9' }]}>
                    <Ionicons name={category.icon} size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>LKR {category.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty state */}
        {incomeCategoryTotals.length === 0 && expenseCategoryTotals.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No transactions for this period</Text>
          </View>
        )}

        {/* Empty space for bottom navigation */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00cba0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    padding: 16,
  },
  balanceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#00cba0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  incomeAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  expenseAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F44336",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#eee",
    marginHorizontal: 8,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 16,
    padding: 7,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: "#00cba0",
  },
  periodText: {
    color: "#666",
    fontWeight: "500",
  },
  activePeriodText: {
    color: "white",
    fontWeight: "bold",
  },
  categorySection: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: "#333",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  bottomSpace: {
    height: 40,
  },
});

export default Analysis;