import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";

// Bar Chart component for Income & Expenses visualization
const BarChart = ({ period }) => {
  // Different data sets based on selected period
  const chartData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      income: [6000, 1500, 6500, 3000, 10000, 800, 5500],
      expense: [3000, 500, 2500, 500, 8000, 300, 1000],
    },
    weekly: {
      labels: ["W1", "W2", "W3", "W4"],
      income: [16000, 12500, 19500, 23000],
      expense: [9000, 7500, 11500, 13000],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      income: [40000, 38000, 45000, 42000, 48000, 52000],
      expense: [25000, 22000, 28000, 24000, 26000, 30000],
    },
    yearly: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      income: [280000, 310000, 350000, 380000, 420000],
      expense: [180000, 200000, 220000, 240000, 260000],
    },
  };

  // Get the appropriate data for the selected period
  const { labels, income, expense } = chartData[period];

  // Find max value to calculate relative heights
  const maxValue = Math.max(...income, ...expense);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.yAxis}>
        <Text style={styles.yAxisLabel}>15k</Text>
        <Text style={styles.yAxisLabel}>10k</Text>
        <Text style={styles.yAxisLabel}>5k</Text>
        <Text style={styles.yAxisLabel}>1k</Text>
      </View>

      <View style={styles.barContainer}>
        {labels.map((label, index) => (
          <View key={index} style={styles.dayColumn}>
            {/* Income bar */}
            <View
              style={[
                styles.bar,
                styles.incomeBar,
                { height: (income[index] / maxValue) * 150 },
              ]}
            />

            {/* Expense bar */}
            <View
              style={[
                styles.bar,
                styles.expenseBar,
                { height: (expense[index] / maxValue) * 150 },
              ]}
            />

            <Text style={styles.dayLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Main Analysis component
const Analysis = () => {
  // State to track the selected time period
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  // Summary data based on period
  const summaryData = {
    daily: { income: "$580.00", expense: "$187.40" },
    weekly: { income: "$3,120.00", expense: "$987.40" },
    monthly: { income: "$12,240.00", expense: "$4,187.40" },
    yearly: { income: "$145,120.00", expense: "$52,187.40" },
  };

  // Handler for time period selection
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#00cba0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Balance and Expense Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.balanceSection}>
            <View style={styles.summaryItem}>
              <View style={styles.labelContainer}>
                <View style={styles.checkboxIcon}>
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
                <Text style={styles.summaryLabel}>Total Balance</Text>
              </View>
              <Text style={styles.balanceAmount}>$7,783.00</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <View style={styles.labelContainer}>
                <View style={styles.checkboxIcon}>
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
                <Text style={styles.summaryLabel}>Total Expense</Text>
              </View>
              <Text style={styles.expenseAmount}>-$1,187.40</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: "30%" }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressPercentage}>30%</Text>
              <Text style={styles.progressMaxAmount}>$20,000.00</Text>
            </View>
          </View>

          {/* Progress Status */}
          <View style={styles.progressStatus}>
            <View style={styles.checkboxIcon}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <Text style={styles.progressStatusText}>
              30% Of Your Expenses, Looks Good.
            </Text>
          </View>
        </View>

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "daily" && styles.activeButton,
            ]}
            onPress={() => handlePeriodChange("daily")}
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
            onPress={() => handlePeriodChange("weekly")}
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
            onPress={() => handlePeriodChange("monthly")}
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
            onPress={() => handlePeriodChange("yearly")}
          >
            <Text
              style={
                selectedPeriod === "yearly"
                  ? styles.activePeriodText
                  : styles.periodText
              }
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Income & Expenses Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Income & Expenses</Text>
            <View style={styles.chartActions}>
              <TouchableOpacity style={styles.chartActionButton}>
                <Ionicons name="search" size={22} color="#00cba0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chartActionButton}>
                <Ionicons name="calendar-outline" size={22} color="#00cba0" />
              </TouchableOpacity>
            </View>
          </View>

          <BarChart period={selectedPeriod} />
        </View>

        {/* Income and Expense Summary */}
        <View style={styles.financialSummary}>
          <View style={styles.summaryBox}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={24}
              color="#00cba0"
            />
            <Text style={styles.summaryBoxTitle}>Income</Text>
            <Text style={styles.summaryBoxAmount}>
              {summaryData[selectedPeriod].income}
            </Text>
          </View>

          <View style={styles.summaryBox}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={24}
              color="#2196f3"
            />
            <Text style={styles.summaryBoxTitle}>Expense</Text>
            <Text style={styles.summaryBoxAmountBlue}>
              {summaryData[selectedPeriod].expense}
            </Text>
          </View>
        </View>

        {/* My Targets */}
        <View style={styles.targetsSection}>
          <Text style={styles.targetsTitle}>My Targets</Text>

          <View style={styles.targetsIcons}>
            <TouchableOpacity style={styles.targetIconButton}>
              <FontAwesome5 name="home" size={24} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.targetIconButton, styles.activeTargetButton]}
            >
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.targetIconButton}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={24}
                color="#777"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.targetIconButton}>
              <Feather name="layers" size={24} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.targetIconButton}>
              <FontAwesome5 name="user" size={24} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
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
  backButton: {
    padding: 8,
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
  balanceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00cba0",
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
    backgroundColor: "#00cba0",
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
  progressStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  progressStatusText: {
    fontSize: 14,
    color: "#444",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 30,
    margin: 16,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 30,
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
  chartSection: {
    backgroundColor: "#f0f8f5",
    margin: 16,
    borderRadius: 20,
    padding: 16,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  chartActions: {
    flexDirection: "row",
  },
  chartActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  chartContainer: {
    flexDirection: "row",
    height: 200,
    marginTop: 8,
  },
  yAxis: {
    width: 40,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 4,
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 12,
    color: "#aaa",
  },
  barContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  dayColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 30,
  },
  bar: {
    width: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  incomeBar: {
    backgroundColor: "#00cba0",
  },
  expenseBar: {
    backgroundColor: "#2196f3",
  },
  dayLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    position: "absolute",
    bottom: -20,
  },
  financialSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  summaryBoxTitle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  summaryBoxAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  summaryBoxAmountBlue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196f3",
  },
  targetsSection: {
    margin: 16,
    marginTop: 8,
  },
  targetsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 12,
  },
  targetsIcons: {
    flexDirection: "row",
    backgroundColor: "#f0f8f5",
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
  },
  targetIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTargetButton: {
    backgroundColor: "#00cba0",
  },
});

export default Analysis;
