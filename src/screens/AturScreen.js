import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import CenterModal from "../components/CenterModal";
import { useTheme } from "../theme/ThemeContext";
import { useAppData } from "../context/AppDataContext";

export default function AturScreen({ navigation }) {
  const { colors, darkMode, setDarkMode } = useTheme();
  const { currentUser, admins, addAdmin, deleteAdmin, changeMyPassword, logout } = useAppData();

  const [notifications, setNotifications] = useState(true);

  // --- Ubah kata sandi ---
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const resetPwForm = () => {
    setOldPw("");
    setNewPw("");
    setConfirmPw("");
  };

  const handleChangePassword = () => {
    if (!oldPw.trim() || !newPw.trim() || !confirmPw.trim()) {
      Alert.alert("Belum lengkap", "Semua kolom wajib diisi.");
      return;
    }
    if (newPw.length < 6) {
      Alert.alert("Terlalu pendek", "Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert("Tidak cocok", "Konfirmasi kata sandi baru tidak sama.");
      return;
    }
    const result = changeMyPassword(oldPw, newPw);
    if (!result.success) {
      Alert.alert("Gagal", result.message);
      return;
    }
    resetPwForm();
    setPwModalOpen(false);
    Alert.alert("Berhasil", "Kata sandi berhasil diubah. Gunakan kata sandi baru ini saat login berikutnya.");
  };

  // --- Manajemen akun user (khusus Admin) ---
  const isAdmin = currentUser?.role === "Admin";
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetUserForm = () => {
    setNewName("");
    setNewUsername("");
    setNewPassword("");
  };

  const handleAddUser = () => {
    if (!newName.trim() || !newUsername.trim() || !newPassword.trim()) {
      Alert.alert("Belum lengkap", "Semua kolom wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Terlalu pendek", "Kata sandi minimal 6 karakter.");
      return;
    }
    // Akun baru selalu dibuat dengan peran "User" -- tidak ada pilihan peran di sini.
    const result = addAdmin(newName, newUsername, newPassword, "User");
    if (!result.success) {
      Alert.alert("Gagal", result.message);
      return;
    }
    resetUserForm();
    setUserModalOpen(false);
    Alert.alert("Berhasil", "Akun user baru berhasil dibuat.");
  };

  const handleDeleteUser = (account) => {
    Alert.alert(
      "Hapus akun?",
      `Akun ${account.name} (${account.username}) tidak akan bisa lagi mengakses SIRELA setelah dihapus.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, hapus",
          style: "destructive",
          onPress: () => {
            const result = deleteAdmin(account.username);
            if (!result.success) {
              Alert.alert("Gagal", result.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Keluar akun?", "Anda harus masuk kembali untuk mengakses SIRELA.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya, keluar",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.getParent()?.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScreenHeader icon="ellipse-outline" title="Pengaturan" subtitle="Kelola akun dan preferensi" />

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: colors.navy }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: colors.text }]}>{currentUser?.name || "-"}</Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>@{currentUser?.username || "-"}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.navy }]}>
              <Text style={styles.roleBadgeText}>{currentUser?.role || "-"}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>UMUM</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Notifikasi</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: colors.green, false: colors.border }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Mode gelap</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ true: colors.green, false: colors.border }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Bahasa</Text>
            <Text style={[styles.settingValue, { color: colors.textMuted }]}>Indonesia</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => setPwModalOpen(true)}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Ubah kata sandi</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Tahun ajaran aktif</Text>
            <Text style={[styles.settingValue, { color: colors.textMuted }]}>2025/2026</Text>
          </View>
        </View>

        {isAdmin && (
          <>
            <View style={styles.adminSectionHeaderRow}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted, marginBottom: 0 }]}>
                MANAJEMEN AKUN USER
              </Text>
              <TouchableOpacity
                style={[styles.addAdminBtn, { backgroundColor: colors.navy }]}
                onPress={() => setUserModalOpen(true)}
              >
                <Ionicons name="add" size={14} color="#FFFFFF" />
                <Text style={styles.addAdminBtnText}>Tambah</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.helperText, { color: colors.textMuted }]}>
              Hanya Admin yang dapat menambah atau menghapus akun user. Tidak ada pendaftaran akun terbuka untuk umum.
            </Text>

            <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
              {admins.map((acc, idx) => (
                <View key={acc.username}>
                  <View style={styles.adminRow}>
                    <View>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>{acc.name}</Text>
                      <Text style={[styles.adminSub, { color: colors.textMuted }]}>@{acc.username}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <View
                        style={[
                          styles.roleTag,
                          { backgroundColor: acc.role === "Admin" ? colors.navy : colors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleTagText,
                            { color: acc.role === "Admin" ? "#FFFFFF" : colors.textMuted },
                          ]}
                        >
                          {acc.role}
                        </Text>
                      </View>
                      {acc.role !== "Admin" && (
                        <TouchableOpacity onPress={() => handleDeleteUser(acc)}>
                          <Ionicons name="trash-outline" size={16} color={colors.red} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {idx < admins.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.redLight }]} onPress={handleLogout}>
          <Text style={{ color: colors.red, fontWeight: "700" }}>Keluar akun</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: Ubah kata sandi */}
      <CenterModal
        visible={pwModalOpen}
        onClose={() => {
          setPwModalOpen(false);
          resetPwForm();
        }}
      >
        <View style={styles.modalHeaderRow}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Ubah kata sandi</Text>
          <TouchableOpacity
            onPress={() => {
              setPwModalOpen(false);
              resetPwForm();
            }}
          >
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Kata sandi lama</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
          placeholder="Masukkan kata sandi lama"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={oldPw}
          onChangeText={setOldPw}
        />

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Kata sandi baru</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
          placeholder="Minimal 6 karakter"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={newPw}
          onChangeText={setNewPw}
        />

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Konfirmasi kata sandi baru</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
          placeholder="Ulangi kata sandi baru"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={confirmPw}
          onChangeText={setConfirmPw}
        />

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.navy }]} onPress={handleChangePassword}>
          <Text style={styles.saveBtnText}>Simpan kata sandi</Text>
        </TouchableOpacity>
      </CenterModal>

      {/* Modal: Tambah akun user (Admin saja) */}
      <CenterModal
        visible={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          resetUserForm();
        }}
      >
        <View style={styles.modalHeaderRow}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Tambah akun user</Text>
          <TouchableOpacity
            onPress={() => {
              setUserModalOpen(false);
              resetUserForm();
            }}
          >
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Nama lengkap</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
          placeholder="Masukkan nama lengkap"
          placeholderTextColor={colors.textMuted}
          value={newName}
          onChangeText={setNewName}
        />

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Nama pengguna</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
          placeholder="Buat nama pengguna"
          placeholderTextColor={colors.textMuted}
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
        />

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Kata sandi sementara</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
          placeholder="Minimal 6 karakter"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.navy }]} onPress={handleAddUser}>
          <Text style={styles.saveBtnText}>Simpan akun</Text>
        </TouchableOpacity>
      </CenterModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 14, padding: 16, marginBottom: 22 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontWeight: "700" },
  profileName: { fontSize: 15, fontWeight: "700" },
  profileEmail: { fontSize: 12, marginTop: 2 },
  roleBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 6 },
  roleBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "600" },
  sectionLabel: { fontSize: 11, fontWeight: "700", marginBottom: 10 },
  settingsCard: { borderRadius: 14, paddingHorizontal: 16, marginBottom: 22 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  settingLabel: { fontSize: 14, fontWeight: "500" },
  settingValue: { fontSize: 13 },
  divider: { height: 1 },
  adminSectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  addAdminBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addAdminBtnText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  helperText: { fontSize: 11, marginBottom: 10, lineHeight: 16 },
  adminRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  adminSub: { fontSize: 11, marginTop: 2 },
  roleTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  roleTagText: { fontSize: 10, fontWeight: "700" },
  logoutBtn: { marginTop: 4, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  saveBtn: { marginTop: 22, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: "#FFFFFF", fontWeight: "700" },
});