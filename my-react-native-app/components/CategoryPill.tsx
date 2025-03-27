import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors, typography } from "@/constants/colors";
import { Category } from "@/types";

interface CategoryPillProps {
  category: Category;
  selected?: boolean;
  onPress?: (category: Category) => void;
}

export default function CategoryPill({ category, selected = false, onPress }: CategoryPillProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(category);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && { borderColor: category.color, borderWidth: 2 },
      ]}
      onPress={handlePress}
    >
      <View style={[styles.colorDot, { backgroundColor: category.color }]} />
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderColor: "transparent",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  name: {
    fontSize: typography.small,
    color: colors.dark,
  },
});