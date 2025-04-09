import React, { useState } from "react";
import { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTransactions } from '../context/TransactionContext';
import { useCategories } from '../context/CategoryContext';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [activeTab, setActiveTab] = useState("Daily");
  const { transactions, balance, loading, updateTransaction, deleteTransaction } = useTransactions();
  const { expenseCategories, incomeCategories } = useCategories();
  const { user } = useContext(AuthContext);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(today.getDate() - 30);
    oneMonthAgo.setHours(0, 0, 0, 0);
    
    switch(activeTab) {
      case "Daily":
        // Filter transactions from today only
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= today;
        });
      
      case "Weekly":
        // Filter transactions from the last 7 days
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= oneWeekAgo;
        });
      
      case "Monthly":
        // Filter transactions from the last 30 days
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= oneMonthAgo;
        });
      
      default:
        return transactions;
    }
  };

  // Function to calculate balance based on filtered transactions
  const getFilteredBalance = () => {
    return getFilteredTransactions().reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate filtered expenses
  const calculateFilteredTotalExpenses = () => {
    return getFilteredTransactions()
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  // Calculate filtered income
  const calculateFilteredTotalIncome = () => {
    return getFilteredTransactions()
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  };

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

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(Math.abs(transaction.amount).toString());
    setEditNote(transaction.note || "");
    setIsEditModalVisible(true);
  };

  const handleUpdateTransaction = async () => {
    if (!editAmount || isNaN(parseFloat(editAmount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const updatedTransaction = {
      ...editingTransaction,
      amount: parseFloat(editAmount) * (editingTransaction.amount < 0 ? -1 : 1),
      note: editNote.trim() || undefined
    };

    const result = await updateTransaction(editingTransaction.id, updatedTransaction);
    if (result.success) {
      setIsEditModalVisible(false);
      Alert.alert("Success", "Transaction updated successfully");
    } else {
      Alert.alert("Error", "Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const result = await deleteTransaction(id);
            if (result.success) {
              Alert.alert("Success", "Transaction deleted successfully");
            } else {
              Alert.alert("Error", "Failed to delete transaction");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00c89c" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/fin.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.welcomeText}>Hi, {user?.name || 'User'}</Text>
          <Text style={styles.greetingText}>
            {new Date().getHours() < 12 ? 'Good Morning' : 
             new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
          </Text>
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
            <Text style={styles.summaryLabel}>
              {activeTab === "Daily" ? "Today's Expense" : 
               activeTab === "Weekly" ? "Weekly Expense" : "Monthly Expense"}
            </Text>
          </View>
          <Text style={styles.expenseAmount}>
            LKR {calculateFilteredTotalExpenses().toFixed(2)}
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
        ) : getFilteredTransactions().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No transactions for this period</Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === "Daily" ? "No transactions today" : 
               activeTab === "Weekly" ? "No transactions in the last 7 days" : 
               "No transactions in the last 30 days"}
            </Text>
          </View>
        ) : (
          getFilteredTransactions().map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transaction}
              onPress={() => handleEditTransaction(transaction)}
              onLongPress={() => handleDeleteTransaction(transaction.id)}
            >
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
                <Text style={styles.transactionTitle}>{transaction.category}</Text>
                {transaction.note && (
                  <Text style={styles.transactionNote}>{transaction.note}</Text>
                )}
                <Text style={styles.transactionTime}>{formatDate(transaction.date)}</Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                transaction.amount < 0 ? styles.transactionExpense : styles.transactionIncome
              ]}>
                {transaction.amount < 0 
                  ? `-Rs${Math.abs(transaction.amount).toFixed(2)}` 
                  : `+Rs${transaction.amount.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Edit Transaction Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Transaction</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={editAmount}
                onChangeText={setEditAmount}
                placeholder="Enter amount"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={editNote}
                onChangeText={setEditNote}
                placeholder="Add a note"
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateTransaction}
            >
              <Text style={styles.saveButtonText}>Update Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    marginRight: -110,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  noteInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#00c89c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Home;