import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace("Login"), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <View style={styles.logoCircle}>
        <Ionicons name="tablet-landscape-outline" size={34} color={COLORS.white} />
      </View>
      <Text style={styles.title}>SIRELA</Text>
      <Text style={styles.subtitle}>Sistem informasi ruang dan jadwal</Text>
      <View style={styles.dots}>
        <View style={[styles.dot, { backgroundColor: COLORS.purple }]} />
        <View style={[styles.dot, { backgroundColor: COLORS.orange }]} />
        <View style={[styles.dot, { backgroundColor: COLORS.green }]} />
      </View>
      <View style={styles.spacer} />
      <Text style={styles.loading}>Memuat aplikasi...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy, alignItems: "center" },
  spacer: { flex: 1 },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  title: { color: COLORS.white, fontSize: 26, fontWeight: "800", letterSpacing: 1 },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 },
  dots: { flexDirection: "row", gap: 8, marginTop: 22 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  loading: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 30 },
});
