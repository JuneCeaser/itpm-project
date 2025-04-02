import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const TRANSACTIONS_KEY = '@transactions';
const CATEGORIES_KEY = '@categories';
const BALANCE_KEY = '@balance';

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting data:', e);
    return null;
  }
};

export const saveTransactions = async (transactions) => {
  await storeData(TRANSACTIONS_KEY, transactions);
};

export const getTransactions = async () => {
  return await getData(TRANSACTIONS_KEY) || [];
};

export const saveCategories = async (categories) => {
  await storeData(CATEGORIES_KEY, categories);
};

export const getCategories = async () => {
  return await getData(CATEGORIES_KEY) || [];
};

export const saveBalance = async (balance) => {
  await storeData(BALANCE_KEY, balance);
};

export const getBalance = async () => {
  return await getData(BALANCE_KEY) || 0;
};