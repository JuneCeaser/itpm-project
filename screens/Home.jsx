import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { useTransactions } from '../context/TransactionContext';

const Home = () => {
  const [activeTab, setActiveTab] = useState("Daily");
  const { transactions, balance, loading } = useTransactions();

  const renderTransactionIcon = (icon) => {
    return (
      <View style={[styles.transactionIcon, { backgroundColor: getRandomColor() }]}>
        <Text style={styles.transactionIconText}>{icon}</Text>
      </View>
    );
  };

  const getRandomColor = () => {
    const colors = ["#e3f2fd", "#e115fe", "#e8ea6", "#f3e55f5", "#e0f7fa", "#f1f8e9", "#fff3e0"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleVoiceInput = () => {
    console.log("Voice input activated");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + 
           date.toLocaleDateString([], { day: 'numeric', month: 'short' });
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
              -LKR {transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2)}
            </Text>
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
        {loading ? (
          <Text>Loading transactions...</Text>
        ) : transactions.length === 0 ? (
          <Text>No transactions yet</Text>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transaction}>
              {renderTransactionIcon(transaction.category.charAt(0))}
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionTime}>{formatDate(transaction.date)}</Text>
              </View>
              
              <View style={styles.transactionCategory}>
                <Text style={styles.categoryText}>{transaction.category}</Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                transaction.amount < 0 && styles.transactionExpense
              ]}>
                {transaction.amount < 0 
                  ? `-Rs${Math.abs(transaction.amount).toFixed(2)}` 
                  : `Rs${transaction.amount.toFixed(2)}`}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Voice Input Floating Button */}
      <TouchableOpacity
        style={styles.voiceInputButton}
        onPress={handleVoiceInput}
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
    color: "#444336",
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