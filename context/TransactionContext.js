import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRecentTransactions, addTransaction as addTransactionToStorage, getBalance } from '../data/transactions'; // Changed from '../data/storage'

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

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      balance, 
      loading, 
      addTransaction,
      refresh: loadTransactions 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);