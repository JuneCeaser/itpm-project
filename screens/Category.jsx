import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Category = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00C49A" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <View style={styles.balanceIconContainer}>
              <Ionicons name="checkbox-outline" size={16} color="#00C49A" />
            </View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>$7,783.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.balanceItem}>
            <View style={styles.balanceIconContainer}>
              <Ionicons name="checkbox-outline" size={16} color="#00C49A" />
            </View>
            <Text style={styles.balanceLabel}>Total Expense</Text>
            <Text style={[styles.balanceValue, styles.expenseValue]}>
              -$1,187.40
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>30%</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.maxAmount}>$20,000.00</Text>
        </View>

        {/* Status Message */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIconContainer}>
            <Ionicons name="checkbox-outline" size={16} color="#00C49A" />
          </View>
          <Text style={styles.statusText}>
            30% Of Your Expenses, Looks Good.
          </Text>
        </View>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesRow}>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.foodIcon]}>
              <Ionicons name="restaurant-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Food</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.transportIcon]}>
              <Ionicons name="-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Transport</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.medicineIcon]}>
              <Ionicons name="medkit-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Medicine</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesRow}>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.groceriesIcon]}>
              <Ionicons name="basket-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Groceries</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.rentIcon]}>
              <Ionicons name="key-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Rent</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.giftsIcon]}>
              <Ionicons name="gift-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Gifts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesRow}>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.savingsIcon]}>
              <Ionicons name="cash-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Savings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.entertainmentIcon]}>
              <Ionicons name="film-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>Entertainment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryItem}>
            <View style={[styles.categoryIcon, styles.moreIcon]}>
              <Ionicons name="add" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>More</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="swap-horizontal-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="layers-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00C49A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  balanceContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceItem: {
    flex: 1,
  },
  balanceIconContainer: {
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  expenseValue: {
    color: "#FF4F4F",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ffffff40",
  },
  progressContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 12,
    marginRight: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#ffffff40",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  maxAmount: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  statusIconContainer: {
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
  },
  categoriesContainer: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    width: "30%",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  foodIcon: {
    backgroundColor: "#2F7CF6",
  },
  transportIcon: {
    backgroundColor: "#90CAF9",
  },
  medicineIcon: {
    backgroundColor: "#90CAF9",
  },
  groceriesIcon: {
    backgroundColor: "#90CAF9",
  },
  rentIcon: {
    backgroundColor: "#90CAF9",
  },
  giftsIcon: {
    backgroundColor: "#90CAF9",
  },
  savingsIcon: {
    backgroundColor: "#90CAF9",
  },
  entertainmentIcon: {
    backgroundColor: "#90CAF9",
  },
  moreIcon: {
    backgroundColor: "#90CAF9",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EAEFF5",
    paddingVertical: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: "#00C49A",
  },
});

export default Category;
