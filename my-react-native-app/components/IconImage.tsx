import React from "react";
import { Image, StyleSheet, View, ImageStyle, ViewStyle } from "react-native";
import { colors } from "@/constants/colors";

interface IconImageProps {
  source: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

export default function IconImage({
  source,
  size = 24,
  color,
  style,
  imageStyle,
}: IconImageProps) {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, backgroundColor: color || "transparent" },
        style,
      ]}
    >
      <Image
        source={{ uri: source }}
        style={[
          {
            width: size * 0.6,
            height: size * 0.6,
          },
          imageStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});