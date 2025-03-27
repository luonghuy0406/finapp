import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from '@/types';

interface AccountsState {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, accountData: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  getAccountById: (id: string) => Account | undefined;
  getTotalBalance: () => number;
  clearError: () => void;
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set, get) => ({
      accounts: [
        {
          id: '1',
          name: 'Cash',
          type: 'cash',
          balance: 500,
          currency: 'USD',
          color: '#4CD964',
          icon: 'wallet',
          isShared: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Bank Account',
          type: 'bank',
          balance: 2500,
          currency: 'USD',
          color: '#3E7BFA',
          icon: 'building',
          isShared: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Credit Card',
          type: 'credit',
          balance: -350,
          currency: 'USD',
          color: '#FF3B30',
          icon: 'credit-card',
          isShared: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      error: null,
      
      addAccount: (accountData) => {
        const newAccount: Account = {
          ...accountData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          accounts: [...state.accounts, newAccount]
        }));
      },
      
      updateAccount: (id, accountData) => {
        set(state => ({
          accounts: state.accounts.map(account => 
            account.id === id 
              ? { 
                  ...account, 
                  ...accountData, 
                  updatedAt: new Date().toISOString() 
                } 
              : account
          )
        }));
      },
      
      deleteAccount: (id) => {
        set(state => ({
          accounts: state.accounts.filter(account => account.id !== id)
        }));
      },
      
      getAccountById: (id) => {
        return get().accounts.find(account => account.id === id);
      },
      
      getTotalBalance: () => {
        return get().accounts.reduce((total, account) => total + account.balance, 0);
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'finance-accounts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);