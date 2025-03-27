import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/constants/colors";
import { useAccountsStore } from "@/store/accountsStore";
import { useTransactionsStore } from "@/store/transactionsStore";
import { Check, Trash } from "lucide-react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { getAccountIcon } from "@/constants/icons";
import TransactionItem from "@/components/TransactionItem";
import FlatIconAttribution from "@/components/FlatIconAttribution";

export default function AccountDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getAccountById, updateAccount, deleteAccount } = useAccountsStore();
  const { getTransactionsByAccount } = useTransactionsStore();

  const account = getAccountById(id);
  const transactions = getTransactionsByAccount(id);

  const [name, setName] = useState(account?.name || "");
  const [selectedColor, setSelectedColor] = useState(account?.color || colors.primary);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!account) {
      Alert.alert("Error", "Account not found");
      router.back();
    }
  }, [account, router]);

  const colorOptions = [
    colors.primary,
    colors.secondary,
    "#FF3B30",
    "#FF9500",
    "#FFCC00",
    "#5AC8FA",
    "#AF52DE",
    "#FF2D55",
  ];

  const handleSave = () => {
    if (!name) {
      Alert.alert("Error", "Please enter an account name");
      return;
    }

    updateAccount(id, {
      name,
      color: selectedColor,
      updatedAt: new Date().toISOString(),
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (transactions.length > 0) {
      Alert.alert(
        "Cannot Delete Account",
        "This account has transactions associated with it. Please delete or move these transactions before deleting the account."
      );
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteAccount(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleTransactionPress = (transactionId: string) => {
    router.push(`/transaction/${transactionId}`);
  };

  if (!account) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen 
        options={{
          title: isEditing ? "Edit Account" : "Account Details",
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)} 
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>
                {isEditing ? "Cancel" : "Edit"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {isEditing ? (
            // Edit mode
            <View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Account Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter account name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Account Color</Text>
                <View style={styles.colorOptions}>
                  {colorOptions.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColorOption,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Check size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Trash size={20} color={colors.danger} />
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // View mode
            <View>
              <View style={styles.accountHeader}>
                <View style={[styles.accountIcon, { backgroundColor: account.color }]}>
                  <Image 
                    source={{ uri: getAccountIcon(account.type) }}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountType}>
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text
                  style={[
                    styles.balanceAmount,
                    { color: account.balance >= 0 ? colors.dark : colors.danger },
                  ]}
                >
                  {formatCurrency(account.balance)}
                </Text>
                <Text style={styles.balanceCurrency}>{account.currency}</Text>
              </View>

              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Recent Transactions</Text>
              </View>

              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onPress={() => handleTransactionPress(transaction.id)}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No transactions for this account</Text>
                </View>
              )}
            </View>
          )}
          
          <FlatIconAttribution />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: "500",
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  accountIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconImage: {
    width: 32,
    height: 32,
    tintColor: "#fff",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  accountType: {
    fontSize: typography.body,
    color: colors.gray,
  },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: typography.caption,
    color: colors.gray,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  balanceCurrency: {
    fontSize: typography.caption,
    color: colors.gray,
  },
  transactionsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionsTitle: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.dark,
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
  formGroup: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: typography.caption,
    color: colors.gray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: typography.body,
    color: colors.dark,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    marginBottom: 16,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: "#fff",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1F0",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.danger,
  },
});