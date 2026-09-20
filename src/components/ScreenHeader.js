import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";

export default function ScreenHeader({ icon = "square-outline", title, subtitle }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.navy }}>
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color={colors.white} />
        </View>
        <View>
          <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
          {!!subtitle && (
            <Text style={[styles.subtitle, { color: "rgba(255,255,255,0.6)" }]}>{subtitle}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "700" },
  subtitle: { fontSize: 12, marginTop: 2 },
});
