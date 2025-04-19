import React, { useContext, useEffect, useState, useRef } from "react";
import { AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import VerifyOTP from "./screens/VerifyOTP";
import PinLoginScreen from "./screens/PinLoginScreen";
import SetPinScreen from "./screens/SetPinScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { CategoryProvider } from "./context/CategoryContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

const Stack = createStackNavigator();

function AppContent() {
  const { token, hasPin, isLoading } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState("Auth");
  const navigationRef = useRef();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedPin = await AsyncStorage.getItem('userPin');
        
        if (storedToken) {
          if (storedPin) {
            setInitialRoute("PinLogin");
          } else {
            setInitialRoute("HomeTabs");
          }
        } else {
          setInitialRoute("Auth");
        }
      } catch (error) {
        console.error('Error checking initial route:', error);
        setInitialRoute("Auth");
      }
    };

    checkInitialRoute();
  }, []);

  // Monitor app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        checkPinStatus();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkPinStatus = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    const storedPin = await AsyncStorage.getItem('userPin');
    
    if (storedToken && storedPin && navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'PinLogin' }],
      });
    }
  };

  if (isLoading) {
    return null; 
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRoute}>
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
          name="PinLogin"
          component={PinLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SetPin"
          component={SetPinScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <CategoryProvider>
          <AppContent />
        </CategoryProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}