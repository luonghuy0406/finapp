import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Period } from '@/types';
import { useAccountsStore } from './accountsStore';

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transactionData: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByAccount: (accountId: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByPeriod: (period: Period) => Transaction[];
  getIncomeTotal: (period?: Period) => number;
  getExpenseTotal: (period?: Period) => number;
  clearError: () => void;
}

// Helper function to filter transactions by period
const filterByPeriod = (transactions: Transaction[], period: Period): Transaction[] => {
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'all':
    default:
      return transactions;
  }
  
  return transactions.filter(t => new Date(t.date) >= startDate);
};

// Generate sample transactions for the past 30 days
const generateSampleTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Sample transaction descriptions
  const incomeDescriptions = [
    'Monthly Salary', 'Freelance Work', 'Dividend Payment', 'Client Payment', 'Bonus'
  ];
  
  const expenseDescriptions = [
    'Grocery Shopping', 'Restaurant Bill', 'Uber Ride', 'Netflix Subscription',
    'Electricity Bill', 'Rent Payment', 'Phone Bill', 'Amazon Purchase',
    'Gas Station', 'Coffee Shop', 'Gym Membership', 'Doctor Visit'
  ];
  
  // Generate transactions for the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Add 1-3 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < transactionsPerDay; j++) {
      const isIncome = Math.random() > 0.7; // 30% chance of income
      
      const transaction: Transaction = {
        id: `sample-${i}-${j}`,
        amount: isIncome 
          ? Math.floor(Math.random() * 1000) + 500 
          : Math.floor(Math.random() * 200) + 10,
        description: isIncome 
          ? incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)]
          : expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)],
        date: date.toISOString(),
        categoryId: isIncome 
          ? ['1', '2', '3'][Math.floor(Math.random() * 3)]
          : ['4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 6)],
        accountId: ['1', '2', '3'][Math.floor(Math.random() * 3)],
        type: isIncome ? 'income' : 'expense',
        isRecurring: Math.random() > 0.8, // 20% chance of recurring
        createdBy: '1', // Default user ID
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      };
      
      transactions.push(transaction);
    }
  }
  
  return transactions;
};

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: generateSampleTransactions(),
      isLoading: false,
      error: null,
      
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          transactions: [...state.transactions, newTransaction]
        }));
        
        // Update account balance
        const { updateAccount, getAccountById } = useAccountsStore.getState();
        const account = getAccountById(transactionData.accountId);
        
        if (account) {
          const balanceChange = transactionData.type === 'income' 
            ? transactionData.amount 
            : -transactionData.amount;
            
          updateAccount(account.id, {
            balance: account.balance + balanceChange
          });
        }
      },
      
      updateTransaction: (id, transactionData) => {
        const oldTransaction = get().transactions.find(t => t.id === id);
        
        set(state => ({
          transactions: state.transactions.map(transaction => 
            transaction.id === id 
              ? { 
                  ...transaction, 
                  ...transactionData, 
                  updatedAt: new Date().toISOString() 
                } 
              : transaction
          )
        }));
        
        // Update account balance if amount or type changed
        if (oldTransaction && 
            (transactionData.amount !== undefined || 
             transactionData.type !== undefined || 
             transactionData.accountId !== undefined)) {
          
          const { updateAccount, getAccountById } = useAccountsStore.getState();
          
          // If account changed, update both old and new account
          if (transactionData.accountId && transactionData.accountId !== oldTransaction.accountId) {
            const oldAccount = getAccountById(oldTransaction.accountId);
            const newAccount = getAccountById(transactionData.accountId);
            
            if (oldAccount) {
              const oldBalanceChange = oldTransaction.type === 'income' 
                ? -oldTransaction.amount 
                : oldTransaction.amount;
                
              updateAccount(oldAccount.id, {
                balance: oldAccount.balance + oldBalanceChange
              });
            }
            
            if (newAccount) {
              const newBalanceChange = (transactionData.type || oldTransaction.type) === 'income' 
                ? (transactionData.amount || oldTransaction.amount) 
                : -(transactionData.amount || oldTransaction.amount);
                
              updateAccount(newAccount.id, {
                balance: newAccount.balance + newBalanceChange
              });
            }
          } 
          // If only amount or type changed
          else {
            const account = getAccountById(oldTransaction.accountId);
            
            if (account) {
              // Remove old transaction effect
              const oldBalanceChange = oldTransaction.type === 'income' 
                ? -oldTransaction.amount 
                : oldTransaction.amount;
              
              // Add new transaction effect
              const newBalanceChange = (transactionData.type || oldTransaction.type) === 'income' 
                ? (transactionData.amount || oldTransaction.amount) 
                : -(transactionData.amount || oldTransaction.amount);
              
              updateAccount(account.id, {
                balance: account.balance + oldBalanceChange + newBalanceChange
              });
            }
          }
        }
      },
      
      deleteTransaction: (id) => {
        const transaction = get().transactions.find(t => t.id === id);
        
        set(state => ({
          transactions: state.transactions.filter(transaction => transaction.id !== id)
        }));
        
        // Update account balance
        if (transaction) {
          const { updateAccount, getAccountById } = useAccountsStore.getState();
          const account = getAccountById(transaction.accountId);
          
          if (account) {
            const balanceChange = transaction.type === 'income' 
              ? -transaction.amount 
              : transaction.amount;
              
            updateAccount(account.id, {
              balance: account.balance + balanceChange
            });
          }
        }
      },
      
      getTransactionById: (id) => {
        return get().transactions.find(transaction => transaction.id === id);
      },
      
      getTransactionsByAccount: (accountId) => {
        return get().transactions.filter(transaction => transaction.accountId === accountId);
      },
      
      getTransactionsByCategory: (categoryId) => {
        return get().transactions.filter(transaction => transaction.categoryId === categoryId);
      },
      
      getTransactionsByPeriod: (period) => {
        return filterByPeriod(get().transactions, period);
      },
      
      getIncomeTotal: (period = 'all') => {
        const transactions = period === 'all' 
          ? get().transactions 
          : filterByPeriod(get().transactions, period);
          
        return transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getExpenseTotal: (period = 'all') => {
        const transactions = period === 'all' 
          ? get().transactions 
          : filterByPeriod(get().transactions, period);
          
        return transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'finance-transactions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);