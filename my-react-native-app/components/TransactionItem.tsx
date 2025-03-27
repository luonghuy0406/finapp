import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { colors, typography } from "@/constants/colors";
import { Transaction } from "@/types";
import { useCategoriesStore } from "@/store/categoriesStore";
import { useAccountsStore } from "@/store/accountsStore";
import { useSettingsStore } from "@/store/settingsStore";
import { getCategoryIcon } from "@/constants/icons";
import { useTranslation } from "@/hooks/useTranslation";

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { getCategoryById, categories } = useCategoriesStore();
  const { getAccountById } = useAccountsStore();
  const { selectedCurrency, currencySymbols, exchangeRates } = useSettingsStore();
  const { t } = useTranslation();

  const category = getCategoryById(transaction.categoryId);
  const account = getAccountById(transaction.accountId);
  const isIncome = transaction.type === "income";
  const iconUrl = getCategoryIcon(transaction.categoryId, categories);

  // Convert the stored USD amount to the selected currency
  const amountInSelectedCurrency = transaction.amount * exchangeRates[selectedCurrency];

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

  const handlePress = () => {
    if (onPress) {
      onPress(transaction);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.categoryIcon, { backgroundColor: category?.color || colors.gray }]}>
        <Image 
          source={{ uri: iconUrl }}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{transaction.description}</Text>
        <Text style={styles.subtitle}>
          {category ? t(category.name.toLowerCase().replace(/\s+/g, '')) : t("uncategorized")} • {account?.name || t("unknownAccount")}
        </Text>
      </View>
      <View style={styles.amount}>
        <Text
          style={[
            styles.amountText,
            { color: isIncome ? colors.secondary : colors.danger },
          ]}
        >
          {isIncome ? "+" : "-"} {formatCurrency(amountInSelectedCurrency)}
        </Text>
        <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  iconImage: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: typography.body,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.small,
    color: colors.gray,
  },
  amount: {
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
});