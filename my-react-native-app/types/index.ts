export type User = {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    createdAt: string;
  };
  
  export type Account = {
    id: string;
    name: string;
    type: 'cash' | 'bank' | 'credit' | 'savings' | 'investment' | 'other';
    balance: number;
    currency: string;
    color: string;
    icon: string;
    isShared: boolean;
    sharedWith?: string[];
    createdAt: string;
    updatedAt: string;
  };
  
  export type Category = {
    id: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Transaction = {
    id: string;
    amount: number;
    description: string;
    date: string;
    categoryId: string;
    accountId: string;
    type: 'income' | 'expense' | 'transfer';
    isRecurring: boolean;
    recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    attachments?: string[];
    notes?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Budget = {
    id: string;
    name: string;
    amount: number;
    spent: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    categoryIds: string[];
    startDate: string;
    endDate?: string;
    isShared: boolean;
    sharedWith?: string[];
    createdAt: string;
    updatedAt: string;
  };
  
  export type Group = {
    id: string;
    name: string;
    description?: string;
    members: {
      userId: string;
      role: 'owner' | 'admin' | 'member' | 'viewer';
    }[];
    createdAt: string;
    updatedAt: string;
  };
  
  export type ChartData = {
    labels: string[];
    datasets: {
      data: number[];
      colors: string[];
    };
  };
  
  export type Period = 'day' | 'week' | 'month' | 'year' | 'all';