import React, { useState } from "react";
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
  MaterialIcons,
} from "@expo/vector-icons";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Daily");

  // Transaction data for different time periods
  const transactionData = {
    Daily: [
      { id: 1, title: "Coffee", amount: -400.50, category: "Food", time: "08:15 - Today", icon: "☕" },
      { id: 2, title: "Lunch", amount: -1200.75, category: "Food", time: "12:30 - Today", icon: "🍔" },
      { id: 3, title: "Gas", amount: -3500.20, category: "Transport", time: "17:45 - Today", icon: "⛽" },
      { id: 4, title: "Grocery", amount: -2800.90, category: "Shopping", time: "18:20 - Today", icon: "🛒" },
      { id: 5, title: "Movie", amount: -1500.00, category: "Entertainment", time: "20:00 - Today", icon: "🎬" },
      { id: 6, title: "Freelance", amount: 12000.00, category: "Income", time: "09:00 - Today", icon: "💻" },
      { id: 7, title: "Parking", amount: -800.00, category: "Transport", time: "10:15 - Today", icon: "🅿️" },
      { id: 8, title: "Snacks", amount: -500.25, category: "Food", time: "15:30 - Today", icon: "🍫" },
      { id: 9, title: "Book", amount: -2200.40, category: "Education", time: "16:45 - Today", icon: "📚" },
      { id: 10, title: "Donation", amount: -1000.00, category: "Other", time: "19:00 - Today", icon: "❤️" }
    ],
    Weekly: [
      { id: 1, title: "Weekly Grocery", amount: -8500.60, category: "Shopping", time: "Mon - 10:30", icon: "🛒" },
      { id: 2, title: "Electric Bill", amount: -4500.75, category: "Utilities", time: "Tue - 08:00", icon: "💡" },
      { id: 3, title: "Salary", amount: 120000.00, category: "Income", time: "Wed - 09:00", icon: "💰" },
      { id: 4, title: "Dinner Out", amount: -3200.50, category: "Food", time: "Wed - 19:30", icon: "🍽️" },
      { id: 5, title: "Gym Membership", amount: -2500.00, category: "Health", time: "Thu - 07:00", icon: "🏋️" },
      { id: 6, title: "Uber Rides", amount: -4200.30, category: "Transport", time: "Thu - 18:15", icon: "🚖" },
      { id: 7, title: "Phone Bill", amount: -3500.99, category: "Utilities", time: "Fri - 10:00", icon: "📱" },
      { id: 8, title: "Weekend Trip", amount: -15000.00, category: "Travel", time: "Sat - 08:00", icon: "✈️" },
      { id: 9, title: "Gifts", amount: -4500.25, category: "Shopping", time: "Sun - 14:00", icon: "🎁" },
      { id: 10, title: "Freelance Work", amount: 35000.00, category: "Income", time: "Sun - 20:00", icon: "💼" }
    ],
    Monthly: [
      { id: 1, title: "Rent", amount: -120000.00, category: "Housing", time: "1st - 00:00", icon: "🏠" },
      { id: 2, title: "Salary", amount: 450000.00, category: "Income", time: "1st - 09:00", icon: "💰" },
      { id: 3, title: "Car Payment", amount: -35000.00, category: "Transport", time: "5th - 00:00", icon: "🚗" },
      { id: 4, title: "Internet", amount: -6500.99, category: "Utilities", time: "10th - 00:00", icon: "🌐" },
      { id: 5, title: "Health Insurance", amount: -28000.00, category: "Health", time: "15th - 00:00", icon: "🏥" },
      { id: 6, title: "Credit Card", amount: -42000.50, category: "Finance", time: "20th - 00:00", icon: "💳" },
      { id: 7, title: "Investment", amount: -50000.00, category: "Savings", time: "22nd - 10:00", icon: "📈" },
      { id: 8, title: "Side Project", amount: 80000.00, category: "Income", time: "25th - 15:00", icon: "🛠️" },
      { id: 9, title: "Student Loan", amount: -30000.00, category: "Education", time: "28th - 00:00", icon: "🎓" },
      { id: 10, title: "Savings Deposit", amount: -100000.00, category: "Savings", time: "30th - 00:00", icon: "💰" }
    ]
  };

  const renderTransactionIcon = (icon) => (
    <View style={[styles.transactionIcon, { backgroundColor: getRandomColor() }]}>
      <Text style={styles.transactionIconText}>{icon}</Text>
    </View>
  );

  const getRandomColor = () => {
    const colors = ["#e3f2fd", "#e1f5fe", "#e8eaf6", "#f3e5f5", "#e0f7fa", "#f1f8e9", "#fff3e0"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleVoiceInput = () => {
    // Placeholder for voice input functionality
    console.log("Voice input activated");
    // You would typically integrate a voice recognition service here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00c89c" />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hi, June</Text>
          <Text style={styles.greetingText}>Good Morning</Text>
        </View>
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
              <Text style={styles.summaryLabel}>Total Balance</Text>
            </View>
            <Text style={styles.balanceAmount}>LKR 158,130.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.labelContainer}>
              <View style={styles.checkboxIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <Text style={styles.summaryLabel}>Total Expense</Text>
            </View>
            <Text style={styles.expenseAmount}>-LKR 41,870.00</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: "20%" }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressPercentage}>20.93%</Text>
            <Text style={styles.progressMaxAmount}>Rs 200 000.00</Text>
          </View>
        </View>
      </View>

      {/* Time Period Selector */}
      <View style={styles.timeSelector}>
        <TouchableOpacity 
          style={[
            styles.timeOption, 
            activeTab === "Daily" && styles.activeTimeOption
          ]}
          onPress={() => setActiveTab("Daily")}
        >
          <Text style={[
            styles.timeOptionText,
            activeTab === "Daily" && styles.activeTimeOptionText
          ]}>
            Daily
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.timeOption, 
            activeTab === "Weekly" && styles.activeTimeOption
          ]}
          onPress={() => setActiveTab("Weekly")}
        >
          <Text style={[
            styles.timeOptionText,
            activeTab === "Weekly" && styles.activeTimeOptionText
          ]}>
            Weekly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.timeOption, 
            activeTab === "Monthly" && styles.activeTimeOption
          ]}
          onPress={() => setActiveTab("Monthly")}
        >
          <Text style={[
            styles.timeOptionText,
            activeTab === "Monthly" && styles.activeTimeOptionText
          ]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      <ScrollView 
        style={styles.transactionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {transactionData[activeTab].map((transaction) => (
          <View key={transaction.id} style={styles.transaction}>
            {renderTransactionIcon(transaction.icon)}
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionTime}>{transaction.time}</Text>
            </View>
            <View style={styles.transactionCategory}>
              <Text style={styles.categoryText}>{transaction.category}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              transaction.amount < 0 && styles.transactionExpense
            ]}>
              {transaction.amount < 0 ? `-Rs${Math.abs(transaction.amount).toFixed(2)}` : `Rs${transaction.amount.toFixed(2)}`}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Voice Input Floating Button */}
      <TouchableOpacity 
        style={styles.voiceInputButton} 
        onPress={handleVoiceInput}
      >
        <MaterialIcons name="keyboard-voice" size={28} color="white" />
      </TouchableOpacity>

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
    backgroundColor: "#00c89c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00c89c",
  },
  expenseAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2196f3",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#eee",
    marginHorizontal: 8,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#00c89c",
    borderRadius: 10,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: "#666",
  },
  progressMaxAmount: {
    fontSize: 12,
    color: "#666",
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
  voiceInputButton: {
    position: 'absolute',
    bottom: 90, 
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00c89c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default Home;