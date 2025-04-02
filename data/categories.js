import { getData, storeData } from './storage';

const CATEGORIES_KEY = '@categories';

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Food", emoji: "🍔", icon: "restaurant-outline", type: "expense" },
  { id: 2, name: "Transport", emoji: "🚗", icon: "car-outline", type: "expense" },
  { id: 3, name: "Shopping", emoji: "🛍️", icon: "cart-outline", type: "expense" },
  { id: 4, name: "Bills", emoji: "💸", icon: "receipt-outline", type: "expense" },
  { id: 5, name: "Entertainment", emoji: "🎬", icon: "film-outline", type: "expense" },
  { id: 6, name: "Salary", emoji: "💰", icon: "cash-outline", type: "income" },
  { id: 7, name: "Freelance", emoji: "💻", icon: "laptop-outline", type: "income" },
  { id: 8, name: "Investments", emoji: "📈", icon: "trending-up-outline", type: "income" },
  { id: 9, name: "Gifts", emoji: "🎁", icon: "gift-outline", type: "income" },
];

export const getCategories = async () => {
  try {
    const categories = await getData(CATEGORIES_KEY);
    if (!categories || categories.length === 0) {
      await storeData(CATEGORIES_KEY, DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

export const saveCategories = async (categories) => {
  try {
    await storeData(CATEGORIES_KEY, categories);
    return { success: true };
  } catch (error) {
    console.error('Error saving categories:', error);
    return { success: false, error };
  }
};

export const addCategory = async (category) => {
  try {
    const categories = await getCategories();
    const newCategory = {
      ...category,
      id: Date.now(), // Generate unique ID
    };
    const updatedCategories = [...categories, newCategory];
    await saveCategories(updatedCategories);
    return { success: true, category: newCategory };
  } catch (error) {
    console.error('Error adding category:', error);
    return { success: false, error };
  }
};

export const updateCategory = async (category) => {
  try {
    const categories = await getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    
    if (index === -1) {
      return { success: false, error: 'Category not found' };
    }
    
    const updatedCategories = [...categories];
    updatedCategories[index] = category;
    await saveCategories(updatedCategories);
    return { success: true, category };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error };
  }
};

export const deleteCategory = async (id) => {
  try {
    const categories = await getCategories();
    const updatedCategories = categories.filter(c => c.id !== id);
    await saveCategories(updatedCategories);
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error };
  }
};

export const getExpenseCategories = async () => {
  const categories = await getCategories();
  return categories.filter(c => c.type === 'expense');
};

export const getIncomeCategories = async () => {
  const categories = await getCategories();
  return categories.filter(c => c.type === 'income');
};