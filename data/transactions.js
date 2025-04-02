// data/transactions.js
import { 
  getTransactions as getTransactionsFromStorage, 
  saveTransactions, 
  getBalance as getBalanceFromStorage, 
  saveBalance 
} from './storage';
import { updateBalance } from './balance';

export const addTransaction = async (transaction) => {
  try {
    const transactions = await getTransactionsFromStorage();
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

export const updateTransaction = async (id, updatedTransaction) => {
  try {
    const transactions = await getTransactionsFromStorage();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Transaction not found' };
    }
    
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = {
      ...updatedTransaction,
      id, // Keep the same ID
      date: transactions[index].date // Keep the original date
    };
    
    await saveTransactions(updatedTransactions);
    
    // Update balance
    const newBalance = await updateBalance();
    await saveBalance(newBalance);
    
    return { 
      success: true, 
      transaction: updatedTransactions[index],
      balance: newBalance
    };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { success: false, error };
  }
};

export const deleteTransaction = async (id) => {
  try {
    const transactions = await getTransactionsFromStorage();
    const transactionToDelete = transactions.find(t => t.id === id);
    
    if (!transactionToDelete) {
      return { success: false, error: 'Transaction not found' };
    }
    
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await saveTransactions(updatedTransactions);
    
    // Update balance
    const newBalance = await updateBalance();
    await saveBalance(newBalance);
    
    return { 
      success: true,
      balance: newBalance
    };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error };
  }
};

export const getRecentTransactions = async (limit = 20) => {
  try {
    const transactions = await getTransactionsFromStorage();
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    return [];
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