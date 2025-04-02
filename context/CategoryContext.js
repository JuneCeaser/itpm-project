import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getExpenseCategories, 
  getIncomeCategories, 
  addCategory as addCategoryToStorage,
  updateCategory as updateCategoryInStorage,
  deleteCategory as deleteCategoryFromStorage
} from '../data/categories';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const [expenseCats, incomeCats] = await Promise.all([
        getExpenseCategories(),
        getIncomeCategories()
      ]);
      setExpenseCategories(expenseCats);
      setIncomeCategories(incomeCats);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category) => {
    try {
      const result = await addCategoryToStorage(category);
      if (result.success) {
        await loadCategories();
        return { success: true, category: result.category };
      }
      return { success: false };
    } catch (error) {
      console.error('Error adding category:', error);
      return { success: false, error };
    }
  };

  const updateCategory = async (category) => {
    try {
      const result = await updateCategoryInStorage(category);
      if (result.success) {
        await loadCategories();
        return { success: true, category: result.category };
      }
      return { success: false };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const result = await deleteCategoryFromStorage(id);
      if (result.success) {
        await loadCategories();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ 
      expenseCategories, 
      incomeCategories, 
      loading, 
      addCategory,
      updateCategory,
      deleteCategory,
      refresh: loadCategories 
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);