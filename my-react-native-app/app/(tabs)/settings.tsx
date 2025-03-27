import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, Image, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  User,
  Check,
  X,
} from "lucide-react-native";
import FlatIconAttribution from "@/components/FlatIconAttribution";
import { flatIcons } from "@/constants/icons";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { 
    isDarkMode, 
    toggleDarkMode, 
    notificationsEnabled, 
    toggleNotifications,
    selectedLanguage,
    setLanguage,
    selectedCurrency,
    setCurrency,
    availableLanguages,
    availableCurrencies,
    currencySymbols
  } = useSettingsStore();
  const { t } = useTranslation();

  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const renderLanguageItem = ({ item }: { item: { code: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        selectedLanguage === item.code && styles.selectedModalItem
      ]}
      onPress={() => {
        setLanguage(item.code);
        setIsLanguageModalVisible(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.name}</Text>
      {selectedLanguage === item.code && (
        <Check size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderCurrencyItem = ({ item }: { item: { code: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        selectedCurrency === item.code && styles.selectedModalItem
      ]}
      onPress={() => {
        setCurrency(item.code);
        setIsCurrencyModalVisible(false);
      }}
    >
      <View style={styles.currencyItemContent}>
        <Text style={styles.currencySymbol}>{currencySymbols[item.code]}</Text>
        <Text style={styles.modalItemText}>{item.name}</Text>
      </View>
      {selectedCurrency === item.code && (
        <Check size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("settings")}</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>{t("edit")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("preferences")}</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>{t("darkMode")}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.lightGray, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>{t("notifications")}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.lightGray, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setIsLanguageModalVisible(true)}
          >
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>{t("language")}</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>
                {availableLanguages.find(lang => lang.code === selectedLanguage)?.name}
              </Text>
              <ChevronRight size={20} color={colors.gray} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setIsCurrencyModalVisible(true)}
          >
            <View style={styles.settingIconContainer}>
              <CreditCard size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>{t("currency")}</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>
                {currencySymbols[selectedCurrency]} {availableCurrencies.find(curr => curr.code === selectedCurrency)?.name}
              </Text>
              <ChevronRight size={20} color={colors.gray} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("account")}</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Image 
                source={{ uri: flatIcons.settings }}
                style={styles.settingIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.settingText}>{t("personalInformation")}</Text>
            <ChevronRight size={20} color={colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Image 
                source={{ uri: flatIcons.investment }}
                style={styles.settingIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.settingText}>{t("security")}</Text>
            <ChevronRight size={20} color={colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Image 
                source={{ uri: flatIcons.credit }}
                style={styles.settingIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.settingText}>{t("paymentMethods")}</Text>
            <ChevronRight size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("support")}</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>{t("helpAndSupport")}</Text>
            <ChevronRight size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.logoutText}>{t("logOut")}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>{t("version")} 1.0.0</Text>
        
        <FlatIconAttribution />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("selectLanguage")}</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <X size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableLanguages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      {/* Currency Selection Modal */}
      <Modal
        visible={isCurrencyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCurrencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("selectCurrency")}</Text>
              <TouchableOpacity onPress={() => setIsCurrencyModalVisible(false)}>
                <X size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableCurrencies}
              renderItem={renderCurrencyItem}
              keyExtractor={(item) => item.code}
              style={styles.modalList}
            />
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: typography.title,
    fontWeight: "bold",
    color: colors.dark,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.cardBackground,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: typography.caption,
    color: colors.gray,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
  },
  editButtonText: {
    fontSize: typography.small,
    color: colors.primary,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.dark,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingIcon: {
    width: 20,
    height: 20,
    tintColor: colors.primary,
  },
  settingText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.dark,
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: typography.body,
    color: colors.gray,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FFF1F0",
    borderRadius: 12,
  },
  logoutText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.danger,
    marginLeft: 8,
  },
  versionText: {
    fontSize: typography.small,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 16,
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
  modalList: {
    maxHeight: "70%",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedModalItem: {
    backgroundColor: colors.primaryLight,
  },
  modalItemText: {
    fontSize: typography.body,
    color: colors.dark,
  },
  currencyItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.dark,
    marginRight: 12,
  },
});