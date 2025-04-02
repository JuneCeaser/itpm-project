import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from '../context/TransactionContext';
import { useCategories } from '../context/CategoryContext';
import {
  BarChart,
  PieChart,
  ProgressChart
} from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Color generator for pie chart segments
const getRandomColor = () => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#E57373',
    '#64B5F6', '#81C784', '#FFD54F', '#BA68C8', '#4DB6AC'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
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

  // Calculate totals
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
    }).filter(cat => cat.total > 0);
  };

  const expenseCategoryTotals = getCategoryTotals('expense');
  const incomeCategoryTotals = getCategoryTotals('income');

  // Prepare chart data
  const prepareBarChartData = () => {
    const days = [];
    const incomeData = [];
    const expenseData = [];
    
    const now = new Date();
    
    switch (selectedPeriod) {
      case "daily":
        for (let i = 0; i <= 23; i++) {
          days.push(i.toString());
          const hourTransactions = filteredTransactions.filter(
            t => new Date(t.date).getHours() === i
          );
          incomeData.push(
            hourTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
          );
          expenseData.push(
            hourTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
          );
        }
        break;
      default:
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
          
          const dayTransactions = filteredTransactions.filter(
            t => new Date(t.date).toDateString() === date.toDateString()
          );
          
          incomeData.push(
            dayTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
          );
          expenseData.push(
            dayTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
          );
        }
    }
    
    return { days, incomeData, expenseData };
  };

  const { days, incomeData, expenseData } = prepareBarChartData();

  const preparePieChartData = (categoryTotals) => {
    return categoryTotals.map(category => ({
      name: category.name,
      amount: category.total,
      color: category.color || getRandomColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }));
  };

  const expensePieData = preparePieChartData(expenseCategoryTotals);
  const incomePieData = preparePieChartData(incomeCategoryTotals);

  // Chart configuration
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 203, 160, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

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
        {["daily", "weekly", "monthly", "yearly"].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activeButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={
                selectedPeriod === period
                  ? styles.activePeriodText
                  : styles.periodText
              }
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Income vs Expenses Bar Chart
        {filteredTransactions.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Income vs Expenses</Text>
            <BarChart
              data={{
                labels: days,
                datasets: [
                  {
                    data: incomeData,
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  },
                  {
                    data: expenseData,
                    color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
                  }
                ]
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
              style={styles.chart}
            />
          </View>
        )} */}

        {/* Savings Progress Chart
        {totalIncome > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Savings Rate</Text>
            <ProgressChart
              data={{
                labels: ["Savings"],
                data: [(totalIncome - totalExpenses) / totalIncome]
              }}
              width={screenWidth - 32}
              height={160}
              chartConfig={chartConfig}
              style={styles.chart}
            />
            <Text style={styles.savingsText}>
              {((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}% of income saved
            </Text>
          </View>
        )} */}

          {/* Category Lists */}
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

        {incomeCategoryTotals.length === 0 && expenseCategoryTotals.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No transactions for this period</Text>
          </View>
        )}


        {/* Expense Breakdown Pie Chart */}
        {expensePieData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Expense Breakdown</Text>
            <PieChart
              data={expensePieData}
              width={screenWidth - 32}
              height={200}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          </View>
        )}

        {/* Income Breakdown Pie Chart */}
        {incomePieData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Income Breakdown</Text>
            <PieChart
              data={incomePieData}
              width={screenWidth - 32}
              height={200}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          </View>
        )}

      
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
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chart: {
    borderRadius: 16,
  },
  savingsText: {
    marginTop: 8,
    color: '#00cba0',
    fontWeight: 'bold',
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