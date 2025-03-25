import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hi,Hello</Text>
          <Text style={styles.greetingText}>Good Morning</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceSection}>
          <View style={styles.balanceBox}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>$7,783.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.balanceBox}>
            <Text style={styles.balanceLabel}>Total Expense</Text>
            <Text style={styles.expenseAmount}>-$1,187.40</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: "30%" }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressPercentage}>30%</Text>
            <Text style={styles.progressMax}>$20,000.00</Text>
          </View>
        </View>

        <View style={styles.expenseNote}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.expenseNoteText}>
            30% Of Your Expenses, Looks Good.
          </Text>
        </View>
      </View>

      {/* Time Period Selector */}
      <View style={styles.timeSelector}>
        <TouchableOpacity
          style={[
            styles.timeOption,
            selectedPeriod === "daily" && styles.activeTimeOption,
          ]}
          onPress={() => handlePeriodChange("daily")}
        >
          <Text
            style={
              selectedPeriod === "daily"
                ? styles.activeTimeOptionText
                : styles.timeOptionText
            }
          >
            Daily
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeOption,
            selectedPeriod === "weekly" && styles.activeTimeOption,
          ]}
          onPress={() => handlePeriodChange("weekly")}
        >
          <Text
            style={
              selectedPeriod === "weekly"
                ? styles.activeTimeOptionText
                : styles.timeOptionText
            }
          >
            Weekly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeOption,
            selectedPeriod === "monthly" && styles.activeTimeOption,
          ]}
          onPress={() => handlePeriodChange("monthly")}
        >
          <Text
            style={
              selectedPeriod === "monthly"
                ? styles.activeTimeOptionText
                : styles.timeOptionText
            }
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsContainer}>
        {/* Display transactions based on selected period */}
        {/* For now, we'll just show the same transactions for all periods */}
        {/* In a real app, you would filter transactions based on selectedPeriod */}

        {/* Salary Transaction */}
        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.salaryIcon]}>
            <Text>💵</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Salary</Text>
            <Text style={styles.transactionTime}>18:27 - April 30</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Monthly</Text>
          </View>
          <Text style={styles.transactionAmount}>$4,000,00</Text>
        </View>

        {/* Groceries Transaction */}
        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.groceryIcon]}>
            <Text>🛒</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Groceries</Text>
            <Text style={styles.transactionTime}>17:00 - April 24</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Pantry</Text>
          </View>
          <Text style={styles.transactionExpense}>-$100,00</Text>
        </View>

        {/* Rent Transaction */}
        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.rentIcon]}>
            <Text>🏠</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Rent</Text>
            <Text style={styles.transactionTime}>8:30 - April 15</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Rent</Text>
          </View>
          <Text style={styles.transactionExpense}>-$674,40</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navButton, styles.activeNavButton]}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>📊</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>💳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  greetingText: {
    fontSize: 14,
    color: "#333",
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  balanceSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  balanceBox: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f44336",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ffffff80",
    borderRadius: 5,
    marginBottom: 4,
  },
  progress: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressPercentage: {
    fontSize: 12,
    color: "#333",
  },
  progressMax: {
    fontSize: 12,
    color: "#333",
  },
  expenseNote: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    fontSize: 16,
    color: "#00796b",
    marginRight: 5,
  },
  expenseNoteText: {
    fontSize: 14,
    color: "#333",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
  },
  savingsGoal: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 20,
  },
  savingsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#4286f4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  carIcon: {
    fontSize: 24,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  goalText: {
    fontSize: 12,
    color: "#333",
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  summaryDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  summaryItem: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#333",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  summaryExpense: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f44336",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#ffffff80",
    marginVertical: 10,
  },
  timeSelector: {
    flexDirection: "row",
    backgroundColor: "#f0f7f4",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 6,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 15,
  },
  activeTimeOption: {
    backgroundColor: "#00c89c",
  },
  timeOptionText: {
    color: "#555",
  },
  activeTimeOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: "#f0f7f4",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  salaryIcon: {
    backgroundColor: "#90caf9",
  },
  groceryIcon: {
    backgroundColor: "#90caf9",
  },
  rentIcon: {
    backgroundColor: "#2979ff",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transactionTime: {
    fontSize: 12,
    color: "#888",
  },
  transactionCategory: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    color: "#555",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transactionExpense: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f44336",
  },
  bottomNav: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#f0f7f4",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
  },
  activeNavButton: {
    backgroundColor: "#00c89c",
    borderRadius: 20,
    paddingVertical: 8,
    margin: 5,
  },
  navIcon: {
    fontSize: 24,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00c89c",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  addIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Home;
