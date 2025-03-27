import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/constants/colors";
import { useTransactionsStore } from "@/store/transactionsStore";
import { useCategoriesStore } from "@/store/categoriesStore";
import { Period } from "@/types";
import { ArrowDownRight, ArrowUpRight } from "lucide-react-native";
import { getCategoryIcon } from "@/constants/icons";
import FlatIconAttribution from "@/components/FlatIconAttribution";

export default function StatsScreen() {
  const [activePeriod, setActivePeriod] = useState<Period>("month");
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");
  const { getTransactionsByPeriod, getIncomeTotal, getExpenseTotal } = useTransactionsStore();
  const { categories, getIncomeCategories, getExpenseCategories } = useCategoriesStore();

  const periodTransactions = getTransactionsByPeriod(activePeriod);
  const incomeTotal = getIncomeTotal(activePeriod);
  const expenseTotal = getExpenseTotal(activePeriod);
  const netSavings = incomeTotal - expenseTotal;
  const savingsRate = incomeTotal > 0 ? (netSavings / incomeTotal) * 100 : 0;

  const periods: { label: string; value: Period }[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
    { label: "All", value: "all" },
  ];

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  // Calculate category totals
  const calculateCategoryTotals = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    periodTransactions
      .filter(t => t.type === activeTab)
      .forEach(transaction => {
        const { categoryId, amount } = transaction;
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += amount;
      });
    
    return categoryTotals;
  };

  const categoryTotals = calculateCategoryTotals();
  const totalForType = activeTab === "income" ? incomeTotal : expenseTotal;
  
  // Sort categories by amount
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .map(([categoryId, amount]) => ({
      categoryId,
      amount,
      percentage: totalForType > 0 ? (amount / totalForType) * 100 : 0,
    }));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
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

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Income</Text>
            <Text style={[styles.summaryAmount, { color: colors.secondary }]}>
              {formatCurrency(incomeTotal)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Expenses</Text>
            <Text style={[styles.summaryAmount, { color: colors.danger }]}>
              {formatCurrency(expenseTotal)}
            </Text>
          </View>
        </View>

        <View style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <Text style={styles.savingsTitle}>Net Savings</Text>
            <Text
              style={[
                styles.savingsAmount,
                { color: netSavings >= 0 ? colors.secondary : colors.danger },
              ]}
            >
              {formatCurrency(netSavings)}
            </Text>
          </View>
          <View style={styles.savingsRateContainer}>
            <View style={styles.savingsRateBar}>
              <View
                style={[
                  styles.savingsRateFill,
                  {
                    width: `${Math.max(0, Math.min(savingsRate, 100))}%`,
                    backgroundColor:
                      savingsRate >= 0 ? colors.secondary : colors.danger,
                  },
                ]}
              />
            </View>
            <Text style={styles.savingsRateText}>
              {savingsRate.toFixed(1)}% of income
            </Text>
          </View>
        </View>

        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "expense" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("expense")}
          >
            <ArrowDownRight
              size={18}
              color={activeTab === "expense" ? "#fff" : colors.gray}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "expense" && styles.activeTabButtonText,
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "income" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("income")}
          >
            <ArrowUpRight
              size={18}
              color={activeTab === "income" ? "#fff" : colors.gray}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "income" && styles.activeTabButtonText,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>
            {activeTab === "income" ? "Income" : "Expense"} by Category
          </Text>

          {sortedCategories.length > 0 ? (
            sortedCategories.map(({ categoryId, amount, percentage }) => {
              const category = categories.find(c => c.id === categoryId);
              if (!category) return null;
              
              return (
                <View key={categoryId} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryNameContainer}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: category.color },
                        ]}
                      >
                        <Image 
                          source={{ uri: getCategoryIcon(categoryId, categories) }}
                          style={styles.iconImage}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View style={styles.categoryAmountContainer}>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(amount)}
                      </Text>
                      <Text style={styles.categoryPercentage}>
                        {percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryProgressBar}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: category.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No {activeTab} transactions for this period
              </Text>
            </View>
          )}
        </View>
        
        <FlatIconAttribution />
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
  title: {
    fontSize: typography.title,
    fontWeight: "bold",
    color: colors.dark,
  },
  periodSelector: {
    flexDirection: "row",
    marginHorizontal: 20,
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
  summaryCards: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginRight: 8,
  },
  summaryTitle: {
    fontSize: typography.caption,
    color: colors.gray,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: typography.heading,
    fontWeight: "bold",
  },
  savingsCard: {
    marginHorizontal: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  savingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  savingsTitle: {
    fontSize: typography.body,
    fontWeight: "500",
    color: colors.dark,
  },
  savingsAmount: {
    fontSize: typography.heading,
    fontWeight: "bold",
  },
  savingsRateContainer: {
    marginTop: 8,
  },
  savingsRateBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  savingsRateFill: {
    height: "100%",
    borderRadius: 4,
  },
  savingsRateText: {
    fontSize: typography.small,
    color: colors.gray,
    textAlign: "right",
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
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: typography.body,
    color: colors.gray,
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: "#fff",
  },
  categoriesSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 16,
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
  emptyState: {
    padding: 20,
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: typography.body,
    color: colors.gray,
  },
});