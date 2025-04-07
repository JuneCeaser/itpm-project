import React, { useState, useContext } from 'react';
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

const SetPin = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState('create'); 
  const [loading, setLoading] = useState(false);
  const { setPin: savePin } = useContext(AuthContext);

  const handlePinInput = (num) => {
    if (stage === 'create' && pin.length < 4) {
      setPin(prev => prev + num);
    } else if (stage === 'confirm' && confirmPin.length < 4) {
      setConfirmPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (stage === 'create') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const handleClearAll = () => {
    if (stage === 'create') {
      setPin('');
    } else {
      setConfirmPin('');
    }
  };

  const moveToConfirmStage = () => {
    setStage('confirm');
  };

  const resetPinCreation = () => {
    setPin('');
    setConfirmPin('');
    setStage('create');
  };

  // Handle PIN verification and setting
  React.useEffect(() => {
    const checkPin = async () => {
      if (stage === 'create' && pin.length === 4) {
        setTimeout(() => moveToConfirmStage(), 300);
      } else if (stage === 'confirm' && confirmPin.length === 4) {
        if (pin === confirmPin) {
          setLoading(true);
          try {
            const success = await savePin(pin);
            if (success) {
              Alert.alert('Success', 'PIN set successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', 'Failed to set PIN. Please try again.');
              resetPinCreation();
            }
          } catch (error) {
            console.error('Error saving PIN:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
          } finally {
            setLoading(false);
          }
        } else {
          Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
          resetPinCreation();
        }
      }
    };
    
    checkPin();
  }, [pin, confirmPin]);

  const renderPinDots = (currentPin) => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            currentPin.length > i && styles.pinDotFilled
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {stage === 'create' ? 'Create PIN' : 'Confirm PIN'}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          {stage === 'create' 
            ? 'Enter a 4-digit PIN for quick login' 
            : 'Confirm your PIN by entering it again'}
        </Text>
        
        <View style={styles.pinContainer}>
          {stage === 'create' ? renderPinDots(pin) : renderPinDots(confirmPin)}
        </View>
        
        {loading && (
          <ActivityIndicator size="small" color="#00c89c" style={styles.loader} />
        )}
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
          <TouchableOpacity style={styles.keypadButton} onPress={handleClearAll}>
            <Text style={styles.keypadButtonText}>Clear</Text>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
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
    marginTop: 20,
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
  keypadButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '500',
  },
});

export default SetPin;