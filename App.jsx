import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import VerifyOTP from "./screens/VerifyOTP";
import BottomTabNavigator from "./BottomTabNavigator";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { CategoryProvider } from "./context/CategoryContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <CategoryProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="VerifyOTP"
                component={VerifyOTP}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HomeTabs"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </CategoryProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}