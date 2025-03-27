// Finance icons from Flaticon
// Attribution: Icons made by various authors from www.flaticon.com

export const flatIcons = {
    // Account type icons
    cash: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    bank: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
    credit: "https://cdn-icons-png.flaticon.com/512/1086/1086741.png",
    savings: "https://cdn-icons-png.flaticon.com/512/2830/2830281.png",
    investment: "https://cdn-icons-png.flaticon.com/512/4222/4222019.png",
    
    // Category icons - Income
    salary: "https://cdn-icons-png.flaticon.com/512/2830/2830312.png",
    investment: "https://cdn-icons-png.flaticon.com/512/1728/1728946.png",
    gift: "https://cdn-icons-png.flaticon.com/512/4213/4213958.png",
    
    // Category icons - Expense
    food: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
    transport: "https://cdn-icons-png.flaticon.com/512/3097/3097144.png",
    housing: "https://cdn-icons-png.flaticon.com/512/2544/2544087.png",
    entertainment: "https://cdn-icons-png.flaticon.com/512/3163/3163478.png",
    shopping: "https://cdn-icons-png.flaticon.com/512/3144/3144456.png",
    healthcare: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    
    // App icons
    wallet: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    stats: "https://cdn-icons-png.flaticon.com/512/1828/1828859.png",
    settings: "https://cdn-icons-png.flaticon.com/512/3524/3524636.png",
    add: "https://cdn-icons-png.flaticon.com/512/1828/1828817.png",
    dashboard: "https://cdn-icons-png.flaticon.com/512/1828/1828765.png",
  };
  
  // Helper function to get category icon
  export const getCategoryIcon = (categoryId: string, categories: any[]) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return flatIcons.shopping; // Default
    
    switch(category.name.toLowerCase()) {
      case "salary":
        return flatIcons.salary;
      case "investments":
        return flatIcons.investment;
      case "gifts":
        return flatIcons.gift;
      case "food & dining":
        return flatIcons.food;
      case "transportation":
        return flatIcons.transport;
      case "housing":
        return flatIcons.housing;
      case "entertainment":
        return flatIcons.entertainment;
      case "shopping":
        return flatIcons.shopping;
      case "healthcare":
        return flatIcons.healthcare;
      default:
        return category.type === "income" ? flatIcons.salary : flatIcons.shopping;
    }
  };
  
  // Helper function to get account icon
  export const getAccountIcon = (accountType: string) => {
    switch(accountType) {
      case "cash":
        return flatIcons.cash;
      case "bank":
        return flatIcons.bank;
      case "credit":
        return flatIcons.credit;
      case "savings":
        return flatIcons.savings;
      case "investment":
        return flatIcons.investment;
      default:
        return flatIcons.wallet;
    }
  };