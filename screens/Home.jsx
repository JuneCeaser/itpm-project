import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00c89c" />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hi, John</Text>
          <Text style={styles.greetingText}>Good Morning</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
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
      </View>

      {/* Time Period Selector */}
      <View style={styles.timeSelector}>
        <TouchableOpacity style={[styles.timeOption, styles.activeTimeOption]}>
          <Text style={styles.activeTimeOptionText}>Daily</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeOption}>
          <Text style={styles.timeOptionText}>Weekly</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeOption}>
          <Text style={styles.timeOptionText}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      <ScrollView 
        style={styles.transactionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Salary Transaction */}
        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.salaryIcon]}>
            <Text style={styles.transactionIconText}>💵</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Salary</Text>
            <Text style={styles.transactionTime}>18:27 - April 30</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Monthly</Text>
          </View>
          <Text style={styles.transactionAmount}>$4,000.00</Text>
        </View>

        {/* Groceries Transaction */}
        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.groceryIcon]}>
            <Text style={styles.transactionIconText}>🛒</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Groceries</Text>
            <Text style={styles.transactionTime}>17:00 - April 24</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Pantry</Text>
          </View>
          <Text style={styles.transactionExpense}>-$100.00</Text>
        </View>

        {/* Rent Transaction */}
        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.rentIcon]}>
            <Text style={styles.transactionIconText}>🏠</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Rent</Text>
            <Text style={styles.transactionTime}>8:30 - April 15</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Rent</Text>
          </View>
          <Text style={styles.transactionExpense}>-$674.40</Text>
        </View>

        {/* Additional Transactions */}
        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.transportIcon]}>
            <Text style={styles.transactionIconText}>🚗</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Fuel</Text>
            <Text style={styles.transactionTime}>12:45 - April 10</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Transport</Text>
          </View>
          <Text style={styles.transactionExpense}>-$50.00</Text>
        </View>

        <View style={styles.transaction}>
          <View style={[styles.transactionIcon, styles.entertainmentIcon]}>
            <Text style={styles.transactionIconText}>🍿</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>Cinema</Text>
            <Text style={styles.transactionTime}>19:30 - April 5</Text>
          </View>
          <View style={styles.transactionCategory}>
            <Text style={styles.categoryText}>Entertainment</Text>
          </View>
          <Text style={styles.transactionExpense}>-$25.50</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navButton, styles.activeNavButton]}>
          <Ionicons name="home-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="credit-card" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Feather name="user" size={24} color="#666" />
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
    color: "white",
  },
  greetingText: {
    fontSize: 14,
    color: "white",
  },
  notificationButton: {
    padding: 8,
  },
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#00c89c",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
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
    color: "white",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "white",
    marginHorizontal: 10,
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    marginBottom: 4,
  },
  progress: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressPercentage: {
    fontSize: 12,
    color: "white",
  },
  progressMax: {
    fontSize: 12,
    color: "white",
  },
  timeSelector: {
    flexDirection: "row",
    backgroundColor: "white",
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
    color: "#666",
  },
  activeTimeOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionIconText: {
    fontSize: 24,
  },
  salaryIcon: {
    backgroundColor: "#e3f2fd",
  },
  groceryIcon: {
    backgroundColor: "#e3f2fd",
  },
  rentIcon: {
    backgroundColor: "#e1f5fe",
  },
  transportIcon: {
    backgroundColor: "#e8eaf6",
  },
  entertainmentIcon: {
    backgroundColor: "#f3e5f5",
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
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navButton: {
    flex: 1,
    alignItems: "center",
  },
  activeNavButton: {
    backgroundColor: "#00c89c",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
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
    color: "white",
    fontWeight: "bold",
  },
});

export default Home;