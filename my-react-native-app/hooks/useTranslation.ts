import { useSettingsStore } from '@/store/settingsStore';

// Define the translations type
type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Define translations for different languages
const translations: Translations = {
  en: {
    // General
    settings: 'Settings',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    apply: 'Apply',
    clear: 'Clear',
    success: 'Success',
    error: 'Error',
    
    // Dashboard
    dashboard: 'Dashboard',
    totalBalance: 'Total Balance',
    income: 'Income',
    expense: 'Expense',
    expenses: 'Expenses',
    netSavings: 'Net Savings',
    accounts: 'Accounts',
    recentTransactions: 'Recent Transactions',
    seeAll: 'See All',
    noTransactionsForPeriod: 'No transactions for this period',
    
    // Time periods
    day: 'Day',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    all: 'All',
    today: 'Today',
    
    // Transactions
    transactions: 'Transactions',
    addTransaction: 'Add Transaction',
    saveTransaction: 'Save Transaction',
    editTransaction: 'Edit Transaction',
    deleteTransaction: 'Delete Transaction',
    transactionDetails: 'Transaction Details',
    amount: 'Amount',
    description: 'Description',
    descriptionOptional: 'Description (Optional)',
    whatWasThisFor: 'What was this for?',
    date: 'Date',
    category: 'Category',
    categories: 'Categories',
    account: 'Account',
    transactionType: 'Transaction Type',
    amountRange: 'Amount Range',
    min: 'Min',
    max: 'Max',
    sortBy: 'Sort By',
    newest: 'Newest',
    oldest: 'Oldest',
    highest: 'Highest',
    lowest: 'Lowest',
    filterTransactions: 'Filter Transactions',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',
    noMatchingTransactions: 'No matching transactions',
    transactionAddedSuccess: 'Transaction added successfully',
    addAnother: 'Add Another',
    goToTransactions: 'Go to Transactions',
    fillRequiredFields: 'Please fill in all required fields',
    
    // Categories
    salary: 'Salary',
    investments: 'Investments',
    gifts: 'Gifts',
    'food&dining': 'Food & Dining',
    transportation: 'Transportation',
    housing: 'Housing',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    healthcare: 'Healthcare',
    
    // Accounts
    newAccount: 'New Account',
    accountDetails: 'Account Details',
    editAccount: 'Edit Account',
    deleteAccount: 'Delete Account',
    accountName: 'Account Name',
    initialBalance: 'Initial Balance',
    accountType: 'Account Type',
    accountColor: 'Account Color',
    createAccount: 'Create Account',
    currentBalance: 'Current Balance',
    
    // Settings
    preferences: 'Preferences',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    language: 'Language',
    selectLanguage: 'Select Language',
    currency: 'Currency',
    selectCurrency: 'Select Currency',
    personalInformation: 'Personal Information',
    security: 'Security',
    paymentMethods: 'Payment Methods',
    support: 'Support',
    helpAndSupport: 'Help & Support',
    logOut: 'Log Out',
    version: 'Version',
    
    // New features
    scanInvoice: 'Scan Invoice',
    voiceRecord: 'Voice Record',
    uploadedInvoice: 'Uploaded Invoice',
    removeInvoice: 'Remove',
    invoiceScanned: 'Invoice Scanned',
    invoiceDataExtracted: 'Data has been extracted from your invoice',
    voiceRecognized: 'Voice Recognized',
    voiceDataExtracted: 'Transaction details extracted from your voice',
  },
  
  es: {
    // General
    settings: 'Ajustes',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    add: 'Añadir',
    search: 'Buscar',
    filter: 'Filtrar',
    apply: 'Aplicar',
    clear: 'Limpiar',
    success: 'Éxito',
    error: 'Error',
    
    // Dashboard
    dashboard: 'Panel',
    totalBalance: 'Balance Total',
    income: 'Ingresos',
    expense: 'Gasto',
    expenses: 'Gastos',
    netSavings: 'Ahorro Neto',
    accounts: 'Cuentas',
    recentTransactions: 'Transacciones Recientes',
    seeAll: 'Ver Todo',
    noTransactionsForPeriod: 'No hay transacciones para este período',
    
    // Time periods
    day: 'Día',
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
    all: 'Todo',
    today: 'Hoy',
    
    // Transactions
    transactions: 'Transacciones',
    addTransaction: 'Añadir Transacción',
    saveTransaction: 'Guardar Transacción',
    editTransaction: 'Editar Transacción',
    deleteTransaction: 'Eliminar Transacción',
    transactionDetails: 'Detalles de Transacción',
    amount: 'Cantidad',
    description: 'Descripción',
    descriptionOptional: 'Descripción (Opcional)',
    whatWasThisFor: '¿Para qué fue esto?',
    date: 'Fecha',
    category: 'Categoría',
    categories: 'Categorías',
    account: 'Cuenta',
    transactionType: 'Tipo de Transacción',
    amountRange: 'Rango de Cantidad',
    min: 'Mín',
    max: 'Máx',
    sortBy: 'Ordenar Por',
    newest: 'Más Reciente',
    oldest: 'Más Antiguo',
    highest: 'Mayor Cantidad',
    lowest: 'Menor Cantidad',
    filterTransactions: 'Filtrar Transacciones',
    clearFilters: 'Limpiar Filtros',
    applyFilters: 'Aplicar Filtros',
    noMatchingTransactions: 'No hay transacciones coincidentes',
    transactionAddedSuccess: 'Transacción añadida con éxito',
    addAnother: 'Añadir Otra',
    goToTransactions: 'Ir a Transacciones',
    fillRequiredFields: 'Por favor complete todos los campos requeridos',
    
    // Categories
    salary: 'Salario',
    investments: 'Inversiones',
    gifts: 'Regalos',
    'food&dining': 'Comida',
    transportation: 'Transporte',
    housing: 'Vivienda',
    entertainment: 'Entretenimiento',
    shopping: 'Compras',
    healthcare: 'Salud',
    
    // Accounts
    newAccount: 'Nueva Cuenta',
    accountDetails: 'Detalles de Cuenta',
    editAccount: 'Editar Cuenta',
    deleteAccount: 'Eliminar Cuenta',
    accountName: 'Nombre de Cuenta',
    initialBalance: 'Balance Inicial',
    accountType: 'Tipo de Cuenta',
    accountColor: 'Color de Cuenta',
    createAccount: 'Crear Cuenta',
    currentBalance: 'Balance Actual',
    
    // Settings
    preferences: 'Preferencias',
    darkMode: 'Modo Oscuro',
    notifications: 'Notificaciones',
    language: 'Idioma',
    selectLanguage: 'Seleccionar Idioma',
    currency: 'Moneda',
    selectCurrency: 'Seleccionar Moneda',
    personalInformation: 'Información Personal',
    security: 'Seguridad',
    paymentMethods: 'Métodos de Pago',
    support: 'Soporte',
    helpAndSupport: 'Ayuda y Soporte',
    logOut: 'Cerrar Sesión',
    version: 'Versión',
    
    // New features
    scanInvoice: 'Escanear Factura',
    voiceRecord: 'Grabar Voz',
    uploadedInvoice: 'Factura Cargada',
    removeInvoice: 'Eliminar',
    invoiceScanned: 'Factura Escaneada',
    invoiceDataExtracted: 'Se han extraído datos de su factura',
    voiceRecognized: 'Voz Reconocida',
    voiceDataExtracted: 'Detalles de transacción extraídos de su voz',
  },
  
  fr: {
    // General
    settings: 'Paramètres',
    edit: 'Modifier',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    apply: 'Appliquer',
    clear: 'Effacer',
    success: 'Succès',
    error: 'Erreur',
    
    // Dashboard
    dashboard: 'Tableau de bord',
    totalBalance: 'Solde Total',
    income: 'Revenus',
    expense: 'Dépense',
    expenses: 'Dépenses',
    netSavings: 'Économies Nettes',
    accounts: 'Comptes',
    recentTransactions: 'Transactions Récentes',
    seeAll: 'Voir Tout',
    noTransactionsForPeriod: 'Aucune transaction pour cette période',
    
    // Time periods
    day: 'Jour',
    week: 'Semaine',
    month: 'Mois',
    year: 'Année',
    all: 'Tout',
    today: "Aujourd'hui",
    
    // Transactions
    transactions: 'Transactions',
    addTransaction: 'Ajouter une Transaction',
    saveTransaction: 'Enregistrer la Transaction',
    editTransaction: 'Modifier la Transaction',
    deleteTransaction: 'Supprimer la Transaction',
    transactionDetails: 'Détails de la Transaction',
    amount: 'Montant',
    description: 'Description',
    descriptionOptional: 'Description (Optionnel)',
    whatWasThisFor: "À quoi cela a-t-il servi?",
    date: 'Date',
    category: 'Catégorie',
    categories: 'Catégories',
    account: 'Compte',
    transactionType: 'Type de Transaction',
    amountRange: 'Plage de Montant',
    min: 'Min',
    max: 'Max',
    sortBy: 'Trier Par',
    newest: 'Plus Récent',
    oldest: 'Plus Ancien',
    highest: 'Montant le Plus Élevé',
    lowest: 'Montant le Plus Bas',
    filterTransactions: 'Filtrer les Transactions',
    clearFilters: 'Effacer les Filtres',
    applyFilters: 'Appliquer les Filtres',
    noMatchingTransactions: 'Aucune transaction correspondante',
    transactionAddedSuccess: 'Transaction ajoutée avec succès',
    addAnother: 'Ajouter une Autre',
    goToTransactions: 'Aller aux Transactions',
    fillRequiredFields: 'Veuillez remplir tous les champs obligatoires',
    
    // Categories
    salary: 'Salaire',
    investments: 'Investissements',
    gifts: 'Cadeaux',
    'food&dining': 'Alimentation',
    transportation: 'Transport',
    housing: 'Logement',
    entertainment: 'Divertissement',
    shopping: 'Shopping',
    healthcare: 'Santé',
    
    // Accounts
    newAccount: 'Nouveau Compte',
    accountDetails: 'Détails du Compte',
    editAccount: 'Modifier le Compte',
    deleteAccount: 'Supprimer le Compte',
    accountName: 'Nom du Compte',
    initialBalance: 'Solde Initial',
    accountType: 'Type de Compte',
    accountColor: 'Couleur du Compte',
    createAccount: 'Créer un Compte',
    currentBalance: 'Solde Actuel',
    
    // Settings
    preferences: 'Préférences',
    darkMode: 'Mode Sombre',
    notifications: 'Notifications',
    language: 'Langue',
    selectLanguage: 'Sélectionner la Langue',
    currency: 'Devise',
    selectCurrency: 'Sélectionner la Devise',
    personalInformation: 'Informations Personnelles',
    security: 'Sécurité',
    paymentMethods: 'Méthodes de Paiement',
    support: 'Support',
    helpAndSupport: 'Aide et Support',
    logOut: 'Déconnexion',
    version: 'Version',
    
    // New features
    scanInvoice: 'Scanner une Facture',
    voiceRecord: 'Enregistrement Vocal',
    uploadedInvoice: 'Facture Téléchargée',
    removeInvoice: 'Supprimer',
    invoiceScanned: 'Facture Scannée',
    invoiceDataExtracted: 'Les données ont été extraites de votre facture',
    voiceRecognized: 'Voix Reconnue',
    voiceDataExtracted: 'Détails de transaction extraits de votre voix',
  },
};

export const useTranslation = () => {
  const { selectedLanguage } = useSettingsStore();
  
  // Fallback to English if the selected language is not available
  const currentLanguage = translations[selectedLanguage] || translations.en;
  
  const t = (key: string): string => {
    return currentLanguage[key] || translations.en[key] || key;
  };
  
  return { t };
};