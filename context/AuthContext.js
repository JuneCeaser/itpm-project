// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPin, setHasPin] = useState(false);

  // Load stored auth data on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        const storedPin = await AsyncStorage.getItem('loginPin');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
        
        setHasPin(!!storedPin);
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
      await AsyncStorage.setItem('token', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const loginWithPin = async () => {
    try {
      // Get stored user data and token
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Set the user and token in context
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during PIN login:', error);
      return false;
    }
  };

  const setPin = async (pin) => {
    try {
      await AsyncStorage.setItem('loginPin', pin);
      setHasPin(true);
      return true;
    } catch (error) {
      console.error('Error saving PIN:', error);
      return false;
    }
  };

  const removePin = async () => {
    try {
      await AsyncStorage.removeItem('loginPin');
      setHasPin(false);
      return true;
    } catch (error) {
      console.error('Error removing PIN:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Don't remove the PIN when logging out
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading,
      hasPin,
      login,
      loginWithPin,
      setPin,
      removePin,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
