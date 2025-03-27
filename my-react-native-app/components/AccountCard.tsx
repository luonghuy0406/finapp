import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { colors, typography } from "@/constants/colors";
import { Account } from "@/types";
import { getAccountIcon } from "@/constants/icons";

interface AccountCardProps {
  account: Account;
  onPress?: (account: Account) => void;
}

export default function AccountCard({ account, onPress }: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const iconUrl = getAccountIcon(account.type);

  const handlePress = () => {
    if (onPress) {
      onPress(account);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.iconContainer, { backgroundColor: account.color }]}>
        <Image 
          source={{ uri: iconUrl }}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{account.name}</Text>
        <Text style={styles.type}>{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</Text>
      </View>
      <View style={styles.balance}>
        <Text
          style={[
            styles.balanceText,
            { color: account.balance >= 0 ? colors.dark : colors.danger },
          ]}
        >
          {formatCurrency(account.balance)}
        </Text>
        <Text style={styles.currencyText}>{account.currency}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  iconContainer: {
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
  details: {
    flex: 1,
  },
  name: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  type: {
    fontSize: typography.small,
    color: colors.gray,
  },
  balance: {
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