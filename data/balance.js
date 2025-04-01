import { getBalance, saveBalance } from './storage';

export const calculateTotalExpenses = async () => {
  const transactions = await getTransactions();
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return expenses;
};

export const calculateTotalIncome = async () => {
  const transactions = await getTransactions();
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  return income;
};

export const updateBalance = async () => {
  const income = await calculateTotalIncome();
  const expenses = await calculateTotalExpenses();
  const balance = income - expenses;
  await saveBalance(balance);
  return balance;
};