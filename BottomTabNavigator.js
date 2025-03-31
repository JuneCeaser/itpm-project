import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Analysis from "./screens/Analysis";
import Add from "./screens/Add";
import Category from "./screens/Category";
import { Ionicons } from "@expo/vector-icons";
                                                                          
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {     
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Analysis") {
            iconName = focused ? "analytics" : "analytics-outline";
          } else if (route.name === "Add") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Category") {
            iconName = focused ? "list" : "list-outline";
          }

          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );                                                           
        },
        tabBarActiveTintColor: "#00c89c",
        tabBarInactiveTintColor: "#95a5a6",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 70,
          paddingTop: 5,
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          bottom: 0,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            },
            android: {
              elevation: 10,
            },
          }),
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={Analysis}
        options={{
          tabBarLabel: "Analysis",
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.addButtonContainer,
                focused && styles.activeAddButton,
              ]}
            >
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={32}
                color={focused ? "white" : "#00D09E"}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Category"
        component={Category}
        options={{
          tabBarLabel: "Category",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: "rgba(239, 247, 251, 0.1)",
    padding: 8,
    borderRadius: 12,
    marginTop: -5,
    margin: -5,
  },
  addButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  activeAddButton: {
    backgroundColor: "#00D09E",
  },
});

export default BottomTabNavigator;