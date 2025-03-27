import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/constants/colors";
import { useTransactionsStore } from "@/store/transactionsStore";
import { useAccountsStore } from "@/store/accountsStore";
import { useCategoriesStore } from "@/store/categoriesStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Transaction, Period } from "@/types";
import { ArrowDownRight, ArrowUpRight, ChevronRight, DollarSign } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getCategoryIcon } from "@/constants/icons";
import FlatIconAttribution from "@/components/FlatIconAttribution";
import { useRouter } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";

export default function DashboardScreen() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<Period>("month");
  const { transactions, getTransactionsByPeriod, getIncomeTotal, getExpenseTotal } = useTransactionsStore();
  const { accounts, getTotalBalance } = useAccountsStore();
  const { categories, getCategoryById } = useCategoriesStore();
  const { selectedCurrency, currencySymbols, exchangeRates } = useSettingsStore();
  const { t } = useTranslation();

  const periodTransactions = getTransactionsByPeriod(activePeriod);
  const recentTransactions = [...periodTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Convert the stored USD amounts to the selected currency
  const totalBalanceUSD = getTotalBalance();
  const totalBalance = totalBalanceUSD * exchangeRates[selectedCurrency];
  
  const incomeTotalUSD = getIncomeTotal(activePeriod);
  const incomeTotal = incomeTotalUSD * exchangeRates[selectedCurrency];
  
  const expenseTotalUSD = getExpenseTotal(activePeriod);
  const expenseTotal = expenseTotalUSD * exchangeRates[selectedCurrency];
  
  const netSavings = incomeTotal - expenseTotal;

  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");

  const calculateCategoryTotals = () => {
    const categoryTotals: { [key: string]: number } = {};
    periodTransactions
      .filter(transaction => transaction.type === activeTab)
      .forEach(transaction => {
        if (!categoryTotals[transaction.categoryId]) {
          categoryTotals[transaction.categoryId] = 0;
        }
        categoryTotals[transaction.categoryId] += transaction.amount * exchangeRates[selectedCurrency];
      });
    return categoryTotals;
  };

  const categoryTotals = calculateCategoryTotals();
  const totalForType = activeTab === "income" ? incomeTotal : expenseTotal;

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([categoryId, amount]) => ({
      categoryId,
      amount,
      percentage: totalForType > 0 ? (amount / totalForType) * 100 : 0,
    }));

  const periods: { label: string; value: Period }[] = [
    { label: t("day"), value: "day" },
    { label: t("week"), value: "week" },
    { label: t("month"), value: "month" },
    { label: t("year"), value: "year" },
    { label: t("all"), value: "all" },
  ];

  const formatCurrency = (amount: number) => {
    return `${currencySymbols[selectedCurrency]}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const handleSeeAllTransactions = () => {
    router.push("/(tabs)/transactions");
  };

  const handleTransactionPress = (transactionId: string) => {
    router.push(`/transaction/${transactionId}`);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const category = getCategoryById(item.categoryId);
    const isIncome = item.type === "income";
    const iconUrl = getCategoryIcon(item.categoryId, categories);
    
    // Convert the stored USD amount to the selected currency
    const amountInSelectedCurrency = item.amount * exchangeRates[selectedCurrency];

    return (
      <TouchableOpacity 
        style={styles.transactionItem}
        onPress={() => handleTransactionPress(item.id)}
      >
        <View style={[styles.categoryIcon, { backgroundColor: category?.color || colors.gray }]}>
          <Image 
            source={{ uri: iconUrl }}
            style={styles.categoryIconImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{item.description}</Text>
          <Text style={styles.transactionCategory}>
            {category ? t(category.name.toLowerCase().replace(/\s+/g, '')) : t("uncategorized")}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.amountText,
              { color: isIncome ? colors.secondary : colors.danger },
            ]}
          >
            {isIncome ? "+" : "-"} {formatCurrency(amountInSelectedCurrency)}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{t("dashboard")}</Text>
          <Text style={styles.subtitle}>{t("totalBalance")}</Text>
        </View>

        <LinearGradient
          colors={[colors.primary, "#5E8FFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>{t("totalBalance")}</Text>
            <DollarSign size={20} color="#fff" />
          </View>
          <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceItem}>
              <ArrowUpRight size={16} color="#fff" />
              <Text style={styles.balanceItemText}>{t("income")}</Text>
              <Text style={styles.balanceItemAmount}>{formatCurrency(incomeTotal)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <ArrowDownRight size={16} color="#fff" />
              <Text style={styles.balanceItemText}>{t("expenses")}</Text>
              <Text style={styles.balanceItemAmount}>{formatCurrency(expenseTotal)}</Text>
            </View>
          </View>
        </LinearGradient>
        
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
        
        <View style={styles.statsCards}>
          <View style={[styles.statsCard, { backgroundColor: colors.secondaryLight }]}>
            <Text style={styles.statsTitle}>{t("netSavings")}</Text>
            <Text
              style={[
                styles.statsAmount,
                { color: netSavings >= 0 ? colors.secondary : colors.danger },
              ]}
            >
              {netSavings >= 0 ? "+" : ""} {formatCurrency(netSavings)}
            </Text>
          </View>
          <View style={[styles.statsCard, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.statsTitle}>{t("accounts")}</Text>
            <Text style={styles.statsAmount}>{accounts.length}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("recentTransactions")}</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={handleSeeAllTransactions}
            >
              <Text style={styles.seeAllText}>{t("seeAll")}</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            <FlatList
              data={recentTransactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              // ListFooterComponent={<FlatIconAttribution />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{t("noTransactionsForPeriod")}</Text>
              {/* <FlatIconAttribution /> */}
            </View>
          )}
        </View>
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "expense" && styles.activeTabButton]}
            onPress={() => setActiveTab("expense")}
          >
            <ArrowDownRight size={18} color={activeTab === "expense" ? "#fff" : colors.gray} />
            <Text style={[styles.tabButtonText, activeTab === "expense" && styles.activeTabButtonText]}>
              {t("expenses")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "income" && styles.activeTabButton]}
            onPress={() => setActiveTab("income")}
          >
            <ArrowUpRight size={18} color={activeTab === "income" ? "#fff" : colors.gray} />
            <Text style={[styles.tabButtonText, activeTab === "income" && styles.activeTabButtonText]}>
              {t("income")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>
            {activeTab === "income" ? t("income") : t("expense")} {t("byCategory")}
          </Text>
          {sortedCategories.length > 0 ? (
            sortedCategories.map(({ categoryId, amount, percentage }) => {
              const category = getCategoryById(categoryId);
              if (!category) return null;
              return (
                <View key={categoryId} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryNameContainer}>
                      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                        <Image 
                          source={{ uri: getCategoryIcon(categoryId, categories) }}
                          style={styles.iconImage}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View style={styles.categoryAmountContainer}>
                      <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
                      <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                  <View style={styles.categoryProgressBar}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        { width: `${Math.max(0, Math.min(percentage, 100))}%`, backgroundColor: category.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t(activeTab)} {t("noTransactionsForPeriod")}
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: typography.title,
    fontWeight: "bold",
    color: colors.dark,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.gray,
    marginTop: 4,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: typography.body,
    color: "#fff",
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 12,
  },
  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  balanceItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceItemText: {
    fontSize: typography.caption,
    color: "#fff",
    opacity: 0.9,
    marginLeft: 4,
    marginRight: 8,
  },
  balanceItemAmount: {
    fontSize: typography.caption,
    fontWeight: "600",
    color: "#fff",
  },
  periodSelector: {
    flexDirection: "row",
    marginTop: 24,
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
  statsCards: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 14
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginRight: 6,
    marginLeft: 6
  },
  statsTitle: {
    fontSize: typography.caption,
    color: colors.gray,
    marginBottom: 8,
  },
  statsAmount: {
    fontSize: typography.heading,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.dark,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: typography.caption,
    color: colors.primary,
    marginRight: 4,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIconImage: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.body,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: typography.small,
    color: colors.gray,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: typography.body,
    fontWeight: "600",
    marginBottom: 4,
  },
  dateText: {
    fontSize: typography.small,
    color: colors.gray,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: typography.body,
    color: colors.gray,
    marginBottom: 20,
  },
  tabSelector: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 0,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: typography.body,
    color: colors.gray,
    fontWeight: "500",
    marginLeft: 4,
  },
  activeTabButtonText: {
    color: "#fff",
  },
  categoriesSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconImage: {
    width: 18,
    height: 18,
    tintColor: "#fff",
  },
  categoryName: {
    fontSize: typography.body,
    color: colors.dark,
  },
  categoryAmountContainer: {
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  categoryPercentage: {
    fontSize: typography.small,
    color: colors.gray,
  },
  categoryProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
