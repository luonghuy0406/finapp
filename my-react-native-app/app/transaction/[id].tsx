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
import { useTransactionsStore } from "@/store/transactionsStore";
import { useAccountsStore } from "@/store/accountsStore";
import { useCategoriesStore } from "@/store/categoriesStore";
import { ArrowDownRight, ArrowUpRight, Calendar, Check, Trash } from "lucide-react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { getCategoryIcon, getAccountIcon } from "@/constants/icons";
import FlatIconAttribution from "@/components/FlatIconAttribution";

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTransactionById, updateTransaction, deleteTransaction } = useTransactionsStore();
  const { accounts } = useAccountsStore();
  const { categories, getIncomeCategories, getExpenseCategories } = useCategoriesStore();

  const transaction = getTransactionById(id);

  const [type, setType] = useState<"income" | "expense">(transaction?.type || "expense");
  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [description, setDescription] = useState(transaction?.description || "");
  const [selectedAccountId, setSelectedAccountId] = useState(transaction?.accountId || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(transaction?.categoryId || "");

  const incomeCategories = getIncomeCategories();
  const expenseCategories = getExpenseCategories();
  const availableCategories = type === "income" ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (!transaction) {
      Alert.alert("Error", "Transaction not found");
      router.back();
    }
  }, [transaction, router]);

  const handleSave = () => {
    if (!amount || !selectedAccountId || !selectedCategoryId) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    updateTransaction(id, {
      amount: parseFloat(amount),
      description,
      categoryId: selectedCategoryId,
      accountId: selectedAccountId,
      type,
      updatedAt: new Date().toISOString(),
    });

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTransaction(id);
            router.back();
          },
        },
      ]
    );
  };

  if (!transaction) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen 
        options={{
          title: "Transaction Details",
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Trash size={20} color={colors.danger} />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Created on</Text>
            <Text style={styles.dateValue}>{formatDate(transaction.date)}</Text>
          </View>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, type === "expense" && styles.activeTypeButton]}
              onPress={() => setType("expense")}
            >
              <ArrowDownRight
                size={20}
                color={type === "expense" ? "#fff" : colors.gray}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === "expense" && styles.activeTypeButtonText,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === "income" && styles.activeTypeButton]}
              onPress={() => setType("income")}
            >
              <ArrowUpRight
                size={20}
                color={type === "income" ? "#fff" : colors.gray}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === "income" && styles.activeTypeButtonText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="What was this for?"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {availableCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategoryId === category.id && {
                      borderColor: category.color,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setSelectedCategoryId(category.id)}
                >
                  <View
                    style={[styles.categoryIcon, { backgroundColor: category.color }]}
                  >
                    <Image 
                      source={{ uri: getCategoryIcon(category.id, categories) }}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Account</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.accountsContainer}
            >
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountButton,
                    selectedAccountId === account.id && {
                      borderColor: account.color,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setSelectedAccountId(account.id)}
                >
                  <View
                    style={[styles.accountIcon, { backgroundColor: account.color }]}
                  >
                    <Image 
                      source={{ uri: getAccountIcon(account.type) }}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.accountText}>{account.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Check size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Trash size={20} color={colors.danger} />
            <Text style={styles.deleteButtonText}>Delete Transaction</Text>
          </TouchableOpacity>
          
          {/* <FlatIconAttribution /> */}
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
    padding: 8,
  },
  dateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: typography.caption,
    color: colors.gray,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: typography.body,
    color: colors.dark,
  },
  typeSelector: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    overflow: "hidden",
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  activeTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.body,
    color: colors.gray,
    fontWeight: "500",
  },
  activeTypeButtonText: {
    color: "#fff",
  },
  formGroup: {
    marginBottom: 20,
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
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  currencySymbol: {
    fontSize: 24,
    color: colors.gray,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    color: colors.dark,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryButton: {
    alignItems: "center",
    marginRight: 16,
    borderRadius: 12,
    padding: 8,
    borderColor: "transparent",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
  categoryText: {
    fontSize: typography.small,
    color: colors.dark,
    textAlign: "center",
  },
  accountsContainer: {
    paddingVertical: 8,
  },
  accountButton: {
    alignItems: "center",
    marginRight: 16,
    borderRadius: 12,
    padding: 8,
    borderColor: "transparent",
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  accountText: {
    fontSize: typography.small,
    color: colors.dark,
    textAlign: "center",
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