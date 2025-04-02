import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getRecentTransactions, 
  addTransaction as addTransactionToStorage, 
  getBalance,
  updateTransaction as updateTransactionInStorage,
  deleteTransaction as deleteTransactionFromStorage
} from '../data/transactions';
import { resetAppData } from '../data/storage';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const [txs, bal] = await Promise.all([
        getRecentTransactions(),
        getBalance()
      ]);
      setTransactions(txs);
      setBalance(bal);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Inside your TransactionProvider component:
const resetAllData = async () => {
  try {
    setLoading(true);
    const result = await resetAppData();
    if (result.success) {
      // Reload with empty state
      setTransactions([]);
      setBalance(0);
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Error resetting data:', error);
    return { success: false, error };
  } finally {
    setLoading(false);
  }
};


  const addTransaction = async (transaction) => {
    try {
      const result = await addTransactionToStorage(transaction);
      if (result.success) {
        await loadTransactions();
        return { success: true, transaction: result.transaction };
      }
      return { success: false };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, error };
    }
  };

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const result = await updateTransactionInStorage(id, updatedTransaction);
      if (result.success) {
        await loadTransactions();
        return { success: true, transaction: result.transaction };
      }
      return { success: false };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const result = await deleteTransactionFromStorage(id);
      if (result.success) {
        await loadTransactions();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      balance, 
      loading, 
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refresh: loadTransactions,
      resetAllData // Add this
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);