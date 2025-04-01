import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTransactions } from '../context/TransactionContext';

const Home = () => {
  const [activeTab, setActiveTab] = useState("Daily");
  const { transactions, balance, loading } = useTransactions();

  const getCategoryColor = (category) => {
    const colors = {
      "Food": "#FF6384",
      "Transport": "#36A2EB",
      "Shopping": "#FFCE56",
      "Bills": "#4BC0C0",
      "Entertainment": "#9966FF",
      "Salary": "#4CAF50",
      "Freelance": "#2196F3",
      "Investments": "#9C27B0",
      "Gifts": "#FF9800",
      "Other": "#607D8B"
    };
    return colors[category] || "#607D8B";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    return `${time} • ${day}`;
  };

  const calculateTotalExpenses = () => {
    return transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const calculateTotalIncome = () => {
    return transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00c89c" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/fin.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.welcomeText}>Hi, User</Text>
          <Text style={styles.greetingText}>Good Morning</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white"/>
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
            <Text style={styles.balanceAmount}>LKR {balance.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider}/>
          
          <View style={styles.summaryItem}>
            <View style={styles.labelContainer}>
              <View style={styles.checkboxIcon}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <Text style={styles.summaryLabel}>Total Expense</Text>
            </View>
            <Text style={styles.expenseAmount}>
              LKR {calculateTotalExpenses().toFixed(2)}
            </Text>
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

      {/* Transactions List */}
      <ScrollView
        style={styles.transactionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#00c89c" style={styles.loadingIndicator} />
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No transactions yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first transaction to get started</Text>
          </View>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transaction}>
              <View style={[
                styles.transactionIcon,
                { backgroundColor: getCategoryColor(transaction.category) }
              ]}>
                <Ionicons 
                  name={transaction.categoryIcon || "pricetag-outline"} 
                  size={24} 
                  color="#fff" 
                />
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionTime}>{formatDate(transaction.date)}</Text>
                {transaction.note && (
                  <Text style={styles.transactionNote}>{transaction.note}</Text>
                )}
              </View>
              
              <Text style={[
                styles.transactionAmount,
                transaction.amount < 0 ? styles.transactionExpense : styles.transactionIncome
              ]}>
                {transaction.amount < 0 
                  ? `-Rs${Math.abs(transaction.amount).toFixed(2)}` 
                  : `+Rs${transaction.amount.toFixed(2)}`}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Voice Input Floating Button */}
      <TouchableOpacity
        style={styles.voiceInputButton}
        onPress={() => console.log("Voice input")}
      >
        <MaterialIcons name="keyboard-voice" size={28} color="white"/>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
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
    color: "#F44336",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#eee",
    marginHorizontal: 8,
  },
  timeSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 6,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
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
  loadingIndicator: {
    marginTop: 40,
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
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  transactionNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionIncome: {
    color: '#4CAF50',
  },
  transactionExpense: {
    color: '#F44336',
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