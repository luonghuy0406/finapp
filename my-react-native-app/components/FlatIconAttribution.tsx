import React from "react";
import { StyleSheet, Text, View, Linking, TouchableOpacity } from "react-native";
import { colors, typography } from "@/constants/colors";

export default function FlatIconAttribution() {
  const openFlaticon = () => {
    Linking.openURL("https://www.flaticon.com/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Icons provided by{" "}
        <TouchableOpacity onPress={openFlaticon}>
          <Text style={styles.link}>Flaticon</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
  },
  text: {
    fontSize: typography.small,
    color: colors.gray,
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
});