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
import { useAccountsStore } from "@/store/accountsStore";
import { Check } from "lucide-react-native";
import { useRouter, Stack } from "expo-router";
import { getAccountIcon } from "@/constants/icons";
import FlatIconAttribution from "@/components/FlatIconAttribution";

export default function NewAccountScreen() {
  const router = useRouter();
  const { addAccount } = useAccountsStore();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [selectedType, setSelectedType] = useState<"cash" | "bank" | "credit" | "savings" | "investment" | "other">("bank");
  const [selectedColor, setSelectedColor] = useState(colors.primary);

  const accountTypes = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
    { value: "credit", label: "Credit Card" },
    { value: "savings", label: "Savings" },
    { value: "investment", label: "Investment" },
    { value: "other", label: "Other" },
  ];

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

    addAccount({
      name,
      type: selectedType,
      balance: parseFloat(balance) || 0,
      currency: "USD",
      color: selectedColor,
      icon: selectedType,
      isShared: false,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "New Account" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <Text style={styles.label}>Initial Balance</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Account Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typesContainer}
            >
              {accountTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    selectedType === type.value && {
                      borderColor: selectedColor,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setSelectedType(type.value as any)}
                >
                  <View
                    style={[styles.typeIcon, { backgroundColor: selectedColor }]}
                  >
                    <Image 
                      source={{ uri: getAccountIcon(type.value) }}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.typeText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
            <Text style={styles.saveButtonText}>Create Account</Text>
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
  typesContainer: {
    paddingVertical: 8,
  },
  typeButton: {
    alignItems: "center",
    marginRight: 16,
    borderRadius: 12,
    padding: 8,
    borderColor: "transparent",
  },
  typeIcon: {
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
  typeText: {
    fontSize: typography.small,
    color: colors.dark,
    textAlign: "center",
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
    marginBottom: 32,
    gap: 8,
  },
  saveButtonText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: "#fff",
  },
});