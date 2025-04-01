import { getTransactions, saveTransactions, getBalance, saveBalance } from './storage';

export const addTransaction = async (transaction) => {
  try {
    const transactions = await getTransactions();
    const newTransactions = [transaction, ...transactions];
    await saveTransactions(newTransactions);
    
    // Update balance
    const currentBalance = await getBalance();
    const newBalance = currentBalance + transaction.amount;
    await saveBalance(newBalance);
    
    return { success: true };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, error };
  }
};

export const getRecentTransactions = async (limit = 20) => {
  const transactions = await getTransactions();
  return transactions.slice(0, limit);
};