import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/constants/colors";
import { useAccountsStore } from "@/store/accountsStore";
import { Account } from "@/types";
import { Plus } from "lucide-react-native";
import { getAccountIcon } from "@/constants/icons";
import { useRouter } from "expo-router";
import FlatIconAttribution from "@/components/FlatIconAttribution";

export default function AccountsScreen() {
  const router = useRouter();
  const { accounts, getTotalBalance } = useAccountsStore();
  const totalBalance = getTotalBalance();

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const handleAddAccount = () => {
    router.push("/account/new");
  };

  const handleAccountPress = (accountId: string) => {
    router.push(`/account/${accountId}`);
  };

  const renderAccount = ({ item }: { item: Account }) => {
    return (
      <TouchableOpacity 
        style={styles.accountCard}
        onPress={() => handleAccountPress(item.id)}
      >
        <View style={[styles.accountIcon, { backgroundColor: item.color }]}>
          <Image 
            source={{ uri: getAccountIcon(item.type) }}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.accountType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
        </View>
        <View style={styles.accountBalance}>
          <Text
            style={[
              styles.balanceText,
              { color: item.balance >= 0 ? colors.dark : colors.danger },
            ]}
          >
            {formatCurrency(item.balance)}
          </Text>
          <Text style={styles.currencyText}>{item.currency}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Accounts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddAccount}
        >
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.totalBalanceContainer}>
        <Text style={styles.totalBalanceLabel}>Total Balance</Text>
        <Text style={styles.totalBalanceAmount}>{formatCurrency(totalBalance)}</Text>
        <Text style={styles.totalBalanceCurrency}>USD</Text>
      </View>

      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.accountsList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<FlatIconAttribution />}
      />
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
  totalBalanceContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  totalBalanceLabel: {
    fontSize: typography.body,
    color: colors.gray,
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 4,
  },
  totalBalanceCurrency: {
    fontSize: typography.caption,
    color: colors.gray,
  },
  accountsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconImage: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  accountType: {
    fontSize: typography.small,
    color: colors.gray,
  },
  accountBalance: {
    alignItems: "flex-end",
  },
  balanceText: {
    fontSize: typography.heading,
    fontWeight: "600",
    marginBottom: 4,
  },
  currencyText: {
    fontSize: typography.small,
    color: colors.gray,
  },
});