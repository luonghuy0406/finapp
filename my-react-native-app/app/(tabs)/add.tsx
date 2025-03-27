import React, { useState } from "react";
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
import { useSettingsStore } from "@/store/settingsStore";
import { ArrowDownRight, ArrowUpRight, Calendar, Check, Mic, Upload } from "lucide-react-native";
import { useRouter } from "expo-router";
import { getCategoryIcon, getAccountIcon } from "@/constants/icons";
import FlatIconAttribution from "@/components/FlatIconAttribution";
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from "@/hooks/useTranslation";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactionsStore();
  const { accounts } = useAccountsStore();
  const { categories, getIncomeCategories, getExpenseCategories } = useCategoriesStore();
  const { selectedCurrency, currencySymbols, exchangeRates } = useSettingsStore();
  const { t } = useTranslation();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [invoiceImage, setInvoiceImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [recordingTimerId, setRecordingTimerId] = useState<NodeJS.Timeout | null>(null);

  const incomeCategories = getIncomeCategories();
  const expenseCategories = getExpenseCategories();
  const availableCategories = type === "income" ? incomeCategories : expenseCategories;

  const handleSave = () => {
    if (!amount || !selectedAccountId || !selectedCategoryId) {
      Alert.alert(t("error"), t("fillRequiredFields"));
      return;
    }

    // Convert amount to USD (base currency) for storage
    const amountInUSD = parseFloat(amount) / exchangeRates[selectedCurrency];

    addTransaction({
      amount: amountInUSD,
      description: description || `${type === "income" ? t("income") : t("expense")}`, // Default description if empty
      date: new Date().toISOString(),
      categoryId: selectedCategoryId,
      accountId: selectedAccountId,
      type,
      isRecurring: false,
      attachments: invoiceImage ? [invoiceImage] : undefined,
      createdBy: "1", // Default user ID
    });

    // Reset form
    setAmount("");
    setDescription("");
    setSelectedCategoryId("");
    setInvoiceImage(null);
    
    // Navigate back or show success message
    Alert.alert(
      t("success"),
      t("transactionAddedSuccess"),
      [
        {
          text: t("addAnother"),
          onPress: () => {}, // Stay on the same screen
        },
        {
          text: t("goToTransactions"),
          onPress: () => router.push("/(tabs)/transactions"),
        },
      ]
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setInvoiceImage(result.assets[0].uri);
      
      // Simulate invoice scanning with a random amount and category
      if (type === "expense") {
        setTimeout(() => {
          const randomAmount = (Math.random() * 100 + 10).toFixed(2);
          const randomCategoryIndex = Math.floor(Math.random() * expenseCategories.length);
          
          setAmount(randomAmount);
          setSelectedCategoryId(expenseCategories[randomCategoryIndex].id);
          setDescription("Invoice " + new Date().toLocaleDateString());
          
          Alert.alert(
            t("invoiceScanned"),
            t("invoiceDataExtracted")
          );
        }, 1500);
      }
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingTimer(0);
    
    // Start a timer to simulate recording
    const timerId = setInterval(() => {
      setRecordingTimer(prev => prev + 1);
    }, 1000);
    
    setRecordingTimerId(timerId);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    
    if (recordingTimerId) {
      clearInterval(recordingTimerId);
      setRecordingTimerId(null);
    }
    
    // Simulate speech recognition with a random transaction
    setTimeout(() => {
      if (type === "expense") {
        const randomAmount = (Math.random() * 50 + 5).toFixed(2);
        const randomCategoryIndex = Math.floor(Math.random() * expenseCategories.length);
        const possibleDescriptions = [
          "Coffee at Starbucks",
          "Lunch with colleagues",
          "Grocery shopping",
          "Gas station",
          "Uber ride"
        ];
        const randomDescription = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
        
        setAmount(randomAmount);
        setSelectedCategoryId(expenseCategories[randomCategoryIndex].id);
        setDescription(randomDescription);
        
        Alert.alert(
          t("voiceRecognized"),
          t("voiceDataExtracted")
        );
      } else {
        const randomAmount = (Math.random() * 500 + 100).toFixed(2);
        const randomCategoryIndex = Math.floor(Math.random() * incomeCategories.length);
        const possibleDescriptions = [
          "Salary payment",
          "Freelance work",
          "Client payment",
          "Dividend",
          "Gift"
        ];
        const randomDescription = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
        
        setAmount(randomAmount);
        setSelectedCategoryId(incomeCategories[randomCategoryIndex].id);
        setDescription(randomDescription);
        
        Alert.alert(
          t("voiceRecognized"),
          t("voiceDataExtracted")
        );
      }
    }, 1000);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("addTransaction")}</Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={pickImage}>
              <Upload size={20} color={colors.primary} />
              <Text style={styles.quickActionText}>{t("scanInvoice")}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, isRecording && styles.recordingButton]} 
              onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
            >
              <Mic size={20} color={isRecording ? "#fff" : colors.primary} />
              <Text style={[styles.quickActionText, isRecording && styles.recordingText]}>
                {isRecording ? formatRecordingTime(recordingTimer) : t("voiceRecord")}
              </Text>
            </TouchableOpacity>
          </View>

          {invoiceImage && (
            <View style={styles.invoicePreview}>
              <Text style={styles.invoiceTitle}>{t("uploadedInvoice")}</Text>
              <Image source={{ uri: invoiceImage }} style={styles.invoiceImage} />
              <TouchableOpacity 
                style={styles.removeInvoiceButton}
                onPress={() => setInvoiceImage(null)}
              >
                <Text style={styles.removeInvoiceText}>{t("removeInvoice")}</Text>
              </TouchableOpacity>
            </View>
          )}

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
                {t("expense")}
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
                {t("income")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("amount")}</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>{currencySymbols[selectedCurrency]}</Text>
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
            <Text style={styles.label}>{t("descriptionOptional")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("whatWasThisFor")}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("date")}</Text>
            <TouchableOpacity style={styles.dateSelector}>
              <Text style={styles.dateText}>{t("today")}</Text>
              <Calendar size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("category")}</Text>
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
                  <Text style={styles.categoryText}>{t(category.name.toLowerCase().replace(/\s+/g, ''))}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t("account")}</Text>
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
            <Text style={styles.saveButtonText}>{t("saveTransaction")}</Text>
          </TouchableOpacity>
          
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
  quickActions: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  recordingButton: {
    backgroundColor: colors.danger,
  },
  quickActionText: {
    fontSize: typography.small,
    color: colors.primary,
    fontWeight: "500",
  },
  recordingText: {
    color: "#fff",
  },
  invoicePreview: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    alignItems: "center",
  },
  invoiceTitle: {
    fontSize: typography.body,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 8,
  },
  invoiceImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeInvoiceButton: {
    paddingVertical: 8,
  },
  removeInvoiceText: {
    fontSize: typography.small,
    color: colors.danger,
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
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: typography.body,
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
    marginBottom: 32,
    gap: 8,
  },
  saveButtonText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: "#fff",
  },
});