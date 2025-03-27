import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/constants/colors";
import { useTransactionsStore } from "@/store/transactionsStore";
import { useCategoriesStore } from "@/store/categoriesStore";
import { useAccountsStore } from "@/store/accountsStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Period, Transaction } from "@/types";
import { Search, Filter, Plus, X, Check, Calendar, ArrowDownUp } from "lucide-react-native";
import TransactionItem from "@/components/TransactionItem";
import { useRouter } from "expo-router";
import FlatIconAttribution from "@/components/FlatIconAttribution";
import CategoryPill from "@/components/CategoryPill";
import { useTranslation } from "@/hooks/useTranslation";

export default function TransactionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activePeriod, setActivePeriod] = useState<Period>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { getTransactionsByPeriod, transactions } = useTransactionsStore();
  const { categories, getIncomeCategories, getExpenseCategories } = useCategoriesStore();
  const { accounts } = useAccountsStore();
  const { selectedCurrency, currencySymbols, exchangeRates } = useSettingsStore();

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<("income" | "expense")[]>([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const periodTransactions = getTransactionsByPeriod(activePeriod);
  
  useEffect(() => {
    applyFilters();
  }, [periodTransactions, searchQuery, selectedCategories, selectedAccounts, selectedTypes, minAmount, maxAmount, sortOrder]);

  const applyFilters = () => {
    let filtered = [...periodTransactions];
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(t => selectedCategories.includes(t.categoryId));
    }
    
    // Apply account filter
    if (selectedAccounts.length > 0) {
      filtered = filtered.filter(t => selectedAccounts.includes(t.accountId));
    }
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(t => selectedTypes.includes(t.type));
    }
    
    // Apply amount filter
    if (minAmount) {
      filtered = filtered.filter(t => {
        // Convert the stored USD amount to the selected currency
        const amountInSelectedCurrency = t.amount * exchangeRates[selectedCurrency];
        return amountInSelectedCurrency >= parseFloat(minAmount);
      });
    }
    
    if (maxAmount) {
      filtered = filtered.filter(t => {
        // Convert the stored USD amount to the selected currency
        const amountInSelectedCurrency = t.amount * exchangeRates[selectedCurrency];
        return amountInSelectedCurrency <= parseFloat(maxAmount);
      });
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "highest":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }
    
    setFilteredTransactions(filtered);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedAccounts([]);
    setSelectedTypes([]);
    setMinAmount("");
    setMaxAmount("");
    setSortOrder("newest");
  };

  const periods: { label: string; value: Period }[] = [
    { label: t("day"), value: "day" },
    { label: t("week"), value: "week" },
    { label: t("month"), value: "month" },
    { label: t("year"), value: "year" },
    { label: t("all"), value: "all" },
  ];

  const handleTransactionPress = (id: string) => {
    router.push(`/transaction/${id}`);
  };

  const handleAddTransaction = () => {
    router.push("/(tabs)/add");
  };

  const toggleCategorySelection = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const toggleAccountSelection = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, accountId]);
    }
  };

  const toggleTypeSelection = (type: "income" | "expense") => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("transactions")}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTransaction}
        >
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        {isSearchActive ? (
          <View style={styles.activeSearchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder={t("searchTransactions")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery("");
                setIsSearchActive(false);
              }}
            >
              <X size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => setIsSearchActive(true)}
          >
            <Search size={20} color={colors.gray} />
            <Text style={styles.searchPlaceholder}>{t("searchTransactions")}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            (selectedCategories.length > 0 || selectedAccounts.length > 0 || 
             selectedTypes.length > 0 || minAmount || maxAmount) && styles.activeFilterButton
          ]}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Filter size={20} color={
            (selectedCategories.length > 0 || selectedAccounts.length > 0 || 
             selectedTypes.length > 0 || minAmount || maxAmount) ? "#fff" : colors.primary
          } />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodButton,
              activePeriod === period.value && styles.activePeriodButton,
            ]}
            onPress={() => setActivePeriod(period.value)}
          >
            <Text
              style={[
                styles.periodButtonText,
                activePeriod === period.value && styles.activePeriodButtonText,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onPress={() => handleTransactionPress(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedCategories.length > 0 || selectedAccounts.length > 0 || selectedTypes.length > 0 || minAmount || maxAmount
                ? t("noMatchingTransactions")
                : t("noTransactionsForPeriod")}
            </Text>
          </View>
        }
        ListFooterComponent={<FlatIconAttribution />}
      />

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("filterTransactions")}</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <X size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Transaction Type Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t("transactionType")}</Text>
                <View style={styles.typeFilters}>
                  <TouchableOpacity
                    style={[
                      styles.typeFilterButton,
                      selectedTypes.includes("income") && styles.selectedTypeFilter,
                      selectedTypes.includes("income") && { backgroundColor: colors.secondary }
                    ]}
                    onPress={() => toggleTypeSelection("income")}
                  >
                    <Text style={[
                      styles.typeFilterText,
                      selectedTypes.includes("income") && styles.selectedTypeFilterText
                    ]}>
                      {t("income")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeFilterButton,
                      selectedTypes.includes("expense") && styles.selectedTypeFilter,
                      selectedTypes.includes("expense") && { backgroundColor: colors.danger }
                    ]}
                    onPress={() => toggleTypeSelection("expense")}
                  >
                    <Text style={[
                      styles.typeFilterText,
                      selectedTypes.includes("expense") && styles.selectedTypeFilterText
                    ]}>
                      {t("expense")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Amount Range Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t("amountRange")}</Text>
                <View style={styles.amountRangeContainer}>
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.amountInputLabel}>{t("min")}</Text>
                    <View style={styles.amountInput}>
                      <Text style={styles.currencySymbol}>{currencySymbols[selectedCurrency]}</Text>
                      <TextInput
                        style={styles.amountInputField}
                        placeholder="0"
                        keyboardType="numeric"
                        value={minAmount}
                        onChangeText={setMinAmount}
                      />
                    </View>
                  </View>
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.amountInputLabel}>{t("max")}</Text>
                    <View style={styles.amountInput}>
                      <Text style={styles.currencySymbol}>{currencySymbols[selectedCurrency]}</Text>
                      <TextInput
                        style={styles.amountInputField}
                        placeholder="∞"
                        keyboardType="numeric"
                        value={maxAmount}
                        onChangeText={setMaxAmount}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t("categories")}</Text>
                <View style={styles.categoriesContainer}>
                  {categories.map(category => (
                    <CategoryPill
                      key={category.id}
                      category={category}
                      selected={selectedCategories.includes(category.id)}
                      onPress={() => toggleCategorySelection(category.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Account Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t("accounts")}</Text>
                <View style={styles.accountsContainer}>
                  {accounts.map(account => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountFilterButton,
                        selectedAccounts.includes(account.id) && {
                          backgroundColor: account.color + '20', // Add transparency
                          borderColor: account.color,
                          borderWidth: 1
                        }
                      ]}
                      onPress={() => toggleAccountSelection(account.id)}
                    >
                      <View style={[styles.accountColorDot, { backgroundColor: account.color }]} />
                      <Text style={styles.accountFilterText}>{account.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sort Order */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t("sortBy")}</Text>
                <View style={styles.sortOrderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.sortOrderButton,
                      sortOrder === "newest" && styles.selectedSortOrder
                    ]}
                    onPress={() => setSortOrder("newest")}
                  >
                    <Text style={[
                      styles.sortOrderText,
                      sortOrder === "newest" && styles.selectedSortOrderText
                    ]}>
                      {t("newest")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortOrderButton,
                      sortOrder === "oldest" && styles.selectedSortOrder
                    ]}
                    onPress={() => setSortOrder("oldest")}
                  >
                    <Text style={[
                      styles.sortOrderText,
                      sortOrder === "oldest" && styles.selectedSortOrderText
                    ]}>
                      {t("oldest")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortOrderButton,
                      sortOrder === "highest" && styles.selectedSortOrder
                    ]}
                    onPress={() => setSortOrder("highest")}
                  >
                    <Text style={[
                      styles.sortOrderText,
                      sortOrder === "highest" && styles.selectedSortOrderText
                    ]}>
                      {t("highest")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortOrderButton,
                      sortOrder === "lowest" && styles.selectedSortOrder
                    ]}
                    onPress={() => setSortOrder("lowest")}
                  >
                    <Text style={[
                      styles.sortOrderText,
                      sortOrder === "lowest" && styles.selectedSortOrderText
                    ]}>
                      {t("lowest")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>{t("clearFilters")}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={() => {
                  applyFilters();
                  setIsFilterModalVisible(false);
                }}
              >
                <Check size={20} color="#fff" />
                <Text style={styles.applyFiltersText}>{t("applyFilters")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: typography.title,
    fontWeight: "bold",
    color: colors.dark,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  activeSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body,
    color: colors.dark,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: typography.body,
    color: colors.gray,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  periodSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  periodButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.cardBackground,
  },
  activePeriodButton: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: typography.small,
    color: colors.gray,
  },
  activePeriodButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: typography.body,
    color: colors.gray,
    textAlign: "center",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.dark,
  },
  modalContent: {
    padding: 20,
    maxHeight: "70%",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 12,
  },
  typeFilters: {
    flexDirection: "row",
    gap: 12,
  },
  typeFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
  },
  selectedTypeFilter: {
    backgroundColor: colors.primary,
  },
  typeFilterText: {
    fontSize: typography.body,
    color: colors.gray,
  },
  selectedTypeFilterText: {
    color: "#fff",
    fontWeight: "500",
  },
  amountRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  amountInputWrapper: {
    flex: 1,
  },
  amountInputLabel: {
    fontSize: typography.small,
    color: colors.gray,
    marginBottom: 4,
  },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currencySymbol: {
    fontSize: typography.body,
    color: colors.gray,
    marginRight: 4,
  },
  amountInputField: {
    flex: 1,
    fontSize: typography.body,
    color: colors.dark,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  accountsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  accountFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  accountColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  accountFilterText: {
    fontSize: typography.small,
    color: colors.dark,
  },
  sortOrderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sortOrderButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSortOrder: {
    backgroundColor: colors.primary,
  },
  sortOrderText: {
    fontSize: typography.small,
    color: colors.gray,
  },
  selectedSortOrderText: {
    color: "#fff",
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearFiltersText: {
    fontSize: typography.body,
    color: colors.dark,
  },
  applyFiltersButton: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
    gap: 8,
  },
  applyFiltersText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: "#fff",
  },
});