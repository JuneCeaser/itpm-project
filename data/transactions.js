import { getTransactions, saveTransactions, getBalance, saveBalance } from './storage';

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
    const currentBalance = await getBalance();
    const newBalance = currentBalance + transaction.amount;
    await saveBalance(newBalance);
    
    return { success: true, transaction: newTransaction };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, error };
  }
};

export const getRecentTransactions = async (limit = 20) => {
  const transactions = await getTransactions();
  return transactions.slice(0, limit).sort((a, b) => new Date(b.date) - new Date(a.date));
};