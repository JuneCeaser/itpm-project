// data/transactions.js
import { 
  getTransactions as getTransactionsFromStorage, 
  saveTransactions, 
  getBalance as getBalanceFromStorage, 
  saveBalance 
} from './storage';
import { updateBalance } from './balance';

export const getTransactions = async () => {
  try {
    return await getTransactionsFromStorage();
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const getRecentTransactions = async (limit = 20) => {
  try {
    const transactions = await getTransactions();
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    return [];
  }
};

export const addTransaction = async (transaction) => {
  try {
    const transactions = await getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    const newTransactions = [newTransaction, ...transactions];
    await saveTransactions(newTransactions);
    
    // Update balance
    const newBalance = await updateBalance();
    await saveBalance(newBalance);
    
    return { 
      success: true, 
      transaction: newTransaction,
      balance: newBalance
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, error };
  }
};

export const getBalance = async () => {
  try {
    return await updateBalance();
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};