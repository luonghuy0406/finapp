import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/types';

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, categoryData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getIncomeCategories: () => Category[];
  getExpenseCategories: () => Category[];
  clearError: () => void;
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: [
        // Income categories
        {
          id: '1',
          name: 'Salary',
          type: 'income',
          color: '#4CD964',
          icon: 'briefcase',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Investments',
          type: 'income',
          color: '#3E7BFA',
          icon: 'trending-up',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Gifts',
          type: 'income',
          color: '#AF52DE',
          icon: 'gift',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        
        // Expense categories
        {
          id: '4',
          name: 'Food & Dining',
          type: 'expense',
          color: '#FF9500',
          icon: 'utensils',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Transportation',
          type: 'expense',
          color: '#5AC8FA',
          icon: 'car',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          name: 'Housing',
          type: 'expense',
          color: '#FF3B30',
          icon: 'home',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '7',
          name: 'Entertainment',
          type: 'expense',
          color: '#FFCC00',
          icon: 'film',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '8',
          name: 'Shopping',
          type: 'expense',
          color: '#FF2D55',
          icon: 'shopping-bag',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '9',
          name: 'Healthcare',
          type: 'expense',
          color: '#4CD964',
          icon: 'activity',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      error: null,
      
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          categories: [...state.categories, newCategory]
        }));
      },
      
      updateCategory: (id, categoryData) => {
        set(state => ({
          categories: state.categories.map(category => 
            category.id === id 
              ? { 
                  ...category, 
                  ...categoryData, 
                  updatedAt: new Date().toISOString() 
                } 
              : category
          )
        }));
      },
      
      deleteCategory: (id) => {
        set(state => ({
          categories: state.categories.filter(category => category.id !== id)
        }));
      },
      
      getCategoryById: (id) => {
        return get().categories.find(category => category.id === id);
      },
      
      getIncomeCategories: () => {
        return get().categories.filter(category => category.type === 'income');
      },
      
      getExpenseCategories: () => {
        return get().categories.filter(category => category.type === 'expense');
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'finance-categories-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);