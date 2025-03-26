import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

const Category = () => {
  // Categories data
  const categories = [
    [
      { name: "Food", icon: "restaurant-outline", color: "#FF6B6B" },
      { name: "Transport", icon: "car-outline", color: "#4ECDC4" },
      { name: "Shopping", icon: "cart-outline", color: "#FFD166" }
    ],
    [
      { name: "Bills", icon: "receipt-outline", color: "#06D6A0" },
      { name: "Entertainment", icon: "film-outline", color: "#118AB2" },
      { name: "Health", icon: "medkit-outline", color: "#EF476F" }
    ],
    [
      { name: "Education", icon: "school-outline", color: "#7209B7" },
      { name: "Gifts", icon: "gift-outline", color: "#F15BB5" },
      { name: "Investments", icon: "trending-up-outline", color: "#00BBF9" }
    ],
    [
      { name: "Travel", icon: "airplane-outline", color: "#9B5DE5" },
      { name: "Personal", icon: "person-outline", color: "#00F5D4" },
      { name: "Others", icon: "ellipsis-horizontal", color: "#FEE440" }
    ]
  ];

  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'car-outline':
        return <Ionicons name={iconName} size={24} color="#fff" />;
      case 'cart-outline':
        return <Ionicons name={iconName} size={24} color="#fff" />;
      case 'trending-up-outline':
        return <Ionicons name={iconName} size={24} color="#fff" />;
      case 'airplane-outline':
        return <Ionicons name={iconName} size={24} color="#fff" />;
      case 'ellipsis-horizontal':
        return <Ionicons name={iconName} size={24} color="#fff" />;
      default:
        return <Ionicons name={iconName} size={24} color="#fff" />;
    }
  };

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
        {categories.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.categoriesRow}>
            {row.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  {renderIcon(category.icon)}
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="credit-card" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Feather name="grid" size={24} color="#fff" />
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
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
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