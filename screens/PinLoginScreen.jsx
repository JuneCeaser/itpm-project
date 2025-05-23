import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

const PinLogin = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithPin } = useContext(AuthContext);

  useEffect(() => {
    const getSavedPin = async () => {
      try {
        const storedPin = await AsyncStorage.getItem('loginPin');
        if (storedPin) {
          setSavedPin(storedPin);
        } else {
        
          navigation.replace('Auth');
        }
      } catch (error) {
        console.error('Error getting saved PIN:', error);
        navigation.replace('Auth');
      }
    };

    getSavedPin();
  }, []);

  const handlePinInput = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    setPin('');
  };

  useEffect(() => {
    if (pin.length === 4) {
      verifyPin();
    }
  }, [pin]);

 // In PinLogin.jsx
 const verifyPin = async () => {
  setLoading(true);
  
  try {
    if (pin === savedPin) {
      const success = await loginWithPin();
      
      if (success) {
        // Give a small delay to ensure context updates propagate
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeTabs' }],
          });
        }, 100);
      } else {
        Alert.alert('Login Failed', 'Could not retrieve your account data. Please login with email and password.');
        navigation.replace('Auth');
      }
    } else {
      Alert.alert('Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
      setPin('');
    }
  } catch (error) {
    console.error('Error during PIN verification:', error);
    Alert.alert('Error', 'An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const navigateToEmailLogin = () => {
    navigation.navigate('Auth');
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            pin.length > i && styles.pinDotFilled
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <SafeAreaView style={[styles.container, { borderRadius: 10 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Enter PIN</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image
              source={require('../assets/icon.png')}
              style={{ width: 170, height: 110,borderRadius: 20 }} 
            />
          </View>
        </View>
        
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.instructionText}>Enter your 4-digit PIN</Text>
        
        <View style={styles.pinContainer}>
          {renderPinDots()}
        </View>
        
        {loading && (
          <ActivityIndicator size="small" color="#00c89c" style={styles.loader} />
        )}
        
        <TouchableOpacity onPress={navigateToEmailLogin} style={styles.alternateLoginButton}>
          <Text style={styles.alternateLoginText}>Login with Email Instead</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('1')}>
            <Text style={styles.keypadButtonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('2')}>
            <Text style={styles.keypadButtonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('3')}>
            <Text style={styles.keypadButtonText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('4')}>
            <Text style={styles.keypadButtonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('5')}>
            <Text style={styles.keypadButtonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('6')}>
            <Text style={styles.keypadButtonText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('7')}>
            <Text style={styles.keypadButtonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('8')}>
            <Text style={styles.keypadButtonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('9')}>
            <Text style={styles.keypadButtonText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButtonEmpty} onPress={handleClearAll}>
            <Text style={styles.keypadButtonText}></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handlePinInput('0')}>
            <Text style={styles.keypadButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={handleBackspace}>
            <Ionicons name="backspace-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 136,
    
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  pinDotFilled: {
    backgroundColor: '#00c89c',
  },
  loader: {
    marginBottom: 20,
  },
  alternateLoginButton: {
    padding: 10,
  },
  alternateLoginText: {
    color: '#00c89c',
    fontSize: 16,
    fontWeight: '500',
  },
  keypadContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonEmpty: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '500',
  },
});

export default PinLogin;