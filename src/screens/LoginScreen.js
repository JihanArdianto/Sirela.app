import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { useAppData } from "../context/AppDataContext";

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const { login } = useAppData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Belum lengkap", "Nama pengguna dan kata sandi wajib diisi.");
      return;
    }
    const result = login(username, password);
    if (!result.success) {
      Alert.alert("Login gagal", result.message);
      return;
    }
    navigation.replace("Main");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.navy }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <View style={styles.logoCircle}>
            <Ionicons name="tablet-landscape-outline" size={28} color={colors.white} />
          </View>
          <Text style={[styles.appName, { color: colors.white }]}>SIRELA</Text>
          <Text style={styles.appSubtitle}>Sistem informasi ruang dan jadwal</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Masuk ke akun Anda</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Kelola data ruangan dan jadwal sekolah.
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Nama pengguna</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Masukkan nama pengguna"
            placeholderTextColor={colors.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.text }]}>Kata sandi</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Masukkan kata sandi"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setShowPassword((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }, showPassword && { backgroundColor: colors.navy, borderColor: colors.navy }]}>
              {showPassword && <Ionicons name="checkmark" size={12} color={colors.white} />}
            </View>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>Tampilkan sandi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.navy }]} activeOpacity={0.85} onPress={handleLogin}>
            <Text style={styles.submitText}>Masuk</Text>
          </TouchableOpacity>

          <Text style={[styles.helpText, { color: colors.textMuted }]}>Butuh bantuan? Hubungi admin IT sekolah.</Text>

          <Text style={styles.registerNotice}>
            Belum punya akun? Hubungi admin IT sekolah untuk dibuatkan akun.
          </Text>

          <Text style={styles.version}>SIRELA v1.0, Tahun ajaran 2025/2026</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: "center", paddingTop: 70, paddingBottom: 30 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: { fontSize: 20, fontWeight: "800" },
  appSubtitle: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 },
  card: { flex: 1, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24 },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardSubtitle: { fontSize: 12, marginTop: 4, marginBottom: 18 },
  label: { fontSize: 12, marginBottom: 6, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 14 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, marginRight: 8, alignItems: "center", justifyContent: "center" },
  submitBtn: { borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  submitText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  helpText: { textAlign: "center", fontSize: 11, marginTop: 22 },
  registerNotice: { textAlign: "center", fontSize: 12, color: "#8B8FA3", marginTop: 10 },
  version: { textAlign: "center", fontSize: 10, color: "#C6C9D0", marginTop: 22 },
});