import React, { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import Fab from "../components/Fab";
import CenterModal from "../components/CenterModal";
import ConfirmModal from "../components/ConfirmModal";
import PickerField from "../components/PickerField";
import { useTheme } from "../theme/ThemeContext";
import { useAppData } from "../context/AppDataContext";

export default function KelasScreen() {
  const { colors } = useTheme();
  const { classes, majors, addClass, deleteClass } = useAppData();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [students, setStudents] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const majorNames = majors.map((m) => m.name);

  const filtered = useMemo(
    () => classes.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [classes, query]
  );

  const resetForm = () => {
    setName("");
    setMajor("");
    setStudents("");
  };

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert("Belum lengkap", "Nama kelas wajib diisi.");
      return;
    }
    if (!major) {
      Alert.alert("Belum lengkap", "Jurusan wajib dipilih.");
      return;
    }
    addClass({ name: name.trim(), major, students: Number(students) || 0 });
    resetForm();
    setAddOpen(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScreenHeader icon="albums-outline" title="Kelas" subtitle="Kelola daftar kelas per jurusan" />

      <View style={styles.body}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Cari kelas..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>DAFTAR KELAS</Text>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.className, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.classMajor, { color: colors.textMuted }]}>{item.major}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <Text style={[styles.classStudents, { color: colors.text }]}>{item.students} siswa</Text>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => setDeleteTarget(item)}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.red} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <Fab color={colors.blue} onPress={() => setAddOpen(true)} />

      <CenterModal
        visible={addOpen}
        onClose={() => {
          setAddOpen(false);
          resetForm();
        }}
      >
        <View style={styles.modalHeaderRow}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Tambah kelas baru</Text>
          <TouchableOpacity
            onPress={() => {
              setAddOpen(false);
              resetForm();
            }}
          >
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Nama kelas *</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.blue, color: colors.text }]}
          placeholder="Contoh: X-RPL-1"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <PickerField
          label="Jurusan"
          required
          placeholder="Pilih jurusan"
          value={major}
          options={majorNames}
          onChange={setMajor}
          accentColor={colors.blue}
          emptyMessage="Belum ada jurusan. Tambahkan dulu di halaman Jurusan."
        />

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Jumlah siswa</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={students}
          onChangeText={setStudents}
        />

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.blue }]} onPress={handleAdd}>
          <Text style={styles.saveBtnText}>Simpan kelas</Text>
        </TouchableOpacity>
      </CenterModal>

      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus kelas?"
        description={`${deleteTarget?.name || ""} akan dihapus permanen beserta jadwal yang memakai kelas ini. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, hapus"
        onConfirm={() => deleteClass(deleteTarget.id, deleteTarget.name)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 13 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1 },
  className: { fontSize: 15, fontWeight: "700" },
  classMajor: { fontSize: 12, marginTop: 2 },
  classStudents: { fontSize: 13 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  saveBtn: { marginTop: 22, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: "#FFFFFF", fontWeight: "700" },
});
