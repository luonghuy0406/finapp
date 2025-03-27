import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  selectedLanguage: string;
  setLanguage: (language: string) => void;
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
  availableLanguages: { code: string; name: string }[];
  availableCurrencies: { code: string; name: string }[];
  currencySymbols: { [key: string]: string };
  exchangeRates: { [key: string]: number };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
      
      notificationsEnabled: true,
      toggleNotifications: () => set(state => ({ notificationsEnabled: !state.notificationsEnabled })),
      
      selectedLanguage: 'en',
      setLanguage: (language) => set({ selectedLanguage: language }),
      
      selectedCurrency: 'USD',
      setCurrency: (currency) => set({ selectedCurrency: currency }),
      
      availableLanguages: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'zh', name: '中文' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'pt', name: 'Português' },
        { code: 'ru', name: 'Русский' },
        { code: 'ar', name: 'العربية' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'it', name: 'Italiano' },
        { code: 'vi', name: 'Tiếng Việt' },
      ],
      
      availableCurrencies: [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'HKD', name: 'Hong Kong Dollar' },
        { code: 'SGD', name: 'Singapore Dollar' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'BRL', name: 'Brazilian Real' },
        { code: 'RUB', name: 'Russian Ruble' },
        { code: 'KRW', name: 'South Korean Won' },
        { code: 'MXN', name: 'Mexican Peso' },
      ],
      
      currencySymbols: {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CNY': '¥',
        'AUD': 'A$',
        'CAD': 'C$',
        'CHF': 'Fr',
        'HKD': 'HK$',
        'SGD': 'S$',
        'INR': '₹',
        'BRL': 'R$',
        'RUB': '₽',
        'KRW': '₩',
        'MXN': 'Mex$',
      },
      
      // Exchange rates relative to USD (1 USD = X of currency)
      exchangeRates: {
        'USD': 1,
        'EUR': 0.85,
        'GBP': 0.75,
        'JPY': 110.5,
        'CNY': 6.45,
        'AUD': 1.35,
        'CAD': 1.25,
        'CHF': 0.92,
        'HKD': 7.78,
        'SGD': 1.35,
        'INR': 74.5,
        'BRL': 5.2,
        'RUB': 73.5,
        'KRW': 1150,
        'MXN': 20.1,
      },
    }),
    {
      name: 'finance-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);