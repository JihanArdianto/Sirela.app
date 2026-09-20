import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import Fab from "../components/Fab";
import CenterModal from "../components/CenterModal";
import ConfirmModal from "../components/ConfirmModal";
import { useTheme } from "../theme/ThemeContext";
import { useAppData } from "../context/AppDataContext";

export default function JurusanScreen() {
  const { colors } = useTheme();
  const { majors, classes, addMajor, deleteMajor } = useAppData();
  const [manageOpen, setManageOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newMajorName, setNewMajorName] = useState("");

  const totalClasses = classes.length;
  // Kartu grid: semua jurusan asli + satu kartu ringkasan "Semua jurusan" di akhir.
  const gridData = [
    ...majors,
    { id: "__total__", name: "Semua jurusan", info: `${totalClasses} kelas total`, isTotal: true, color: colors.green },
  ];

  const handleAddMajor = () => {
    const trimmed = newMajorName.trim();
    if (!trimmed) return;
    if (majors.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert("Sudah ada", "Nama jurusan ini sudah terdaftar.");
      return;
    }
    addMajor(trimmed);
    setNewMajorName("");
  };

  const confirmDelete = (m) => {
    if (m.classCount > 0) {
      setManageOpen(false);
      setDeleteTarget(m);
    } else {
      deleteMajor(m.id);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMajor(deleteTarget.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScreenHeader icon="diamond-outline" title="Jurusan" subtitle="Kelola daftar jurusan sekolah" />

      <FlatList
        data={gridData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        columnWrapperStyle={{ gap: 14 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.isTotal && styles.totalCard, { backgroundColor: item.color + "22" }]}
            activeOpacity={0.8}
            onPress={() => !item.isTotal && setManageOpen(true)}
          >
            {!item.isTotal && (
              <View style={[styles.badge, { backgroundColor: item.color }]}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {item.code}
                </Text>
              </View>
            )}
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.cardInfo, { color: colors.textMuted }]}>
              {item.isTotal ? item.info : `${item.classCount} kelas aktif`}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Fab color={colors.orange} onPress={() => setManageOpen(true)} />

      <CenterModal visible={manageOpen} onClose={() => setManageOpen(false)}>
        <View style={styles.modalHeaderRow}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Kelola jurusan</Text>
          <TouchableOpacity onPress={() => setManageOpen(false)}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.addRow}>
          <TextInput
            style={[styles.addInput, { borderColor: colors.border, color: colors.text }]}
            placeholder="Nama jurusan baru"
            placeholderTextColor={colors.textMuted}
            value={newMajorName}
            onChangeText={setNewMajorName}
          />
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.orange }]} onPress={handleAddMajor}>
            <Text style={styles.addBtnText}>+ Tambah</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>DAFTAR JURUSAN</Text>
        {majors.map((m) => (
          <View key={m.id} style={[styles.listRow, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.listName, { color: colors.text }]}>{m.name}</Text>
              <Text style={[styles.listInfo, { color: colors.textMuted }]}>{m.classCount} kelas terdaftar</Text>
            </View>
            <TouchableOpacity onPress={() => confirmDelete(m)}>
              <Ionicons name="close" size={18} color={colors.red} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.border }]} onPress={() => setManageOpen(false)}>
          <Text style={[styles.closeBtnText, { color: colors.text }]}>Tutup</Text>
        </TouchableOpacity>
      </CenterModal>

      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => {
          setDeleteTarget(null);
          setManageOpen(true);
        }}
        title="Hapus jurusan?"
        description={`Jurusan ${deleteTarget?.name || ""} memiliki ${deleteTarget?.classCount || 0} kelas terdaftar. Menghapusnya tidak bisa dibatalkan, dan kelas-kelas itu jadi tidak punya jurusan.`}
        confirmLabel="Ya, hapus"
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { flex: 1, borderRadius: 14, padding: 16, minHeight: 100, justifyContent: "flex-start" },
  totalCard: { justifyContent: "center", minHeight: 90 },
  badge: {
    alignSelf: "flex-start",
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardTitle: { fontSize: 14, fontWeight: "700" },
  cardInfo: { fontSize: 11, marginTop: 2 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  addRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  addInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, fontSize: 13 },
  addBtn: { borderRadius: 10, paddingHorizontal: 16, justifyContent: "center" },
  addBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  sectionLabel: { fontSize: 11, fontWeight: "700", marginBottom: 8 },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  listName: { fontSize: 14, fontWeight: "700" },
  listInfo: { fontSize: 11, marginTop: 2 },
  closeBtn: { marginTop: 18, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  closeBtnText: { fontWeight: "700" },
});
