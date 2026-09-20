import React, { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import Fab from "../components/Fab";
import CenterModal from "../components/CenterModal";
import ConfirmModal from "../components/ConfirmModal";
import { useTheme } from "../theme/ThemeContext";
import { useAppData } from "../context/AppDataContext";

export default function RuanganScreen() {
  const { colors } = useTheme();
  const { rooms, addRoom, emptyRoom, deleteRoom } = useAppData();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [confirmRoom, setConfirmRoom] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [newRoomName, setNewRoomName] = useState("");

  const filtered = useMemo(
    () => rooms.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())),
    [rooms, query]
  );

  const resetForm = () => {
    setNewRoomName("");
  };

  const handleAddRoom = () => {
    if (!newRoomName.trim()) {
      Alert.alert("Belum lengkap", "Nama ruangan wajib diisi.");
      return;
    }
    addRoom({
      name: newRoomName.trim(),
      info: "Belum ada kelas",
    });
    resetForm();
    setAddOpen(false);
  };

  const handleEmptyRoom = () => {
    if (!confirmRoom) return;
    emptyRoom(confirmRoom.id, confirmRoom.name);
  };

  const handleDeleteRoom = () => {
    if (!deleteTarget) return;
    deleteRoom(deleteTarget.id, deleteTarget.name);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScreenHeader icon="square-outline" title="Data ruangan" subtitle="Kelola dan pantau status ruangan" />

      <View style={styles.body}>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setSearchOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Cari ruangan...</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>DAFTAR RUANGAN</Text>

        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={[styles.roomRow, { borderBottomColor: colors.border }]}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}
                activeOpacity={0.7}
                onPress={() => item.status === "Terpakai" && setConfirmRoom(item)}
              >
                <View>
                  <Text style={[styles.roomName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.roomStatus, { color: item.status === "Terpakai" ? colors.red : colors.green }]}>
                    {item.status}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.roomInfo, { color: colors.text }]}>{item.info}</Text>
                  {!!item.person && <Text style={[styles.roomPerson, { color: colors.textMuted }]}>{item.person}</Text>}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.trashBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setDeleteTarget(item)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.red} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Fab color={colors.purple} onPress={() => setAddOpen(true)} />

      <CenterModal visible={searchOpen} onClose={() => setSearchOpen(false)}>
        <View style={styles.modalHeaderRow}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Hasil pencarian</Text>
          <TouchableOpacity onPress={() => setSearchOpen(false)}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchInputRow}>
          <TextInput
            style={[styles.searchInput, { borderColor: colors.blue, color: colors.text }]}
            placeholder="Cari ruangan..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>DITEMUKAN {filtered.length} RUANGAN</Text>
        {filtered.map((r) => (
          <View key={r.id} style={[styles.foundRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.roomName, { color: colors.text }]}>{r.name}</Text>
            <Text style={{ color: r.status === "Terpakai" ? colors.red : colors.green, fontSize: 12 }}>
              {r.status}
            </Text>
          </View>
        ))}
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.border }]} onPress={() => setSearchOpen(false)}>
          <Text style={[styles.closeBtnText, { color: colors.text }]}>Tutup</Text>
        </TouchableOpacity>
      </CenterModal>

      <CenterModal
        visible={addOpen}
        onClose={() => {
          setAddOpen(false);
          resetForm();
        }}
      >
        <View style={styles.modalHeaderRow}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Tambah ruangan baru</Text>
          <TouchableOpacity
            onPress={() => {
              setAddOpen(false);
              resetForm();
            }}
          >
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.text }]}>Nama ruangan *</Text>
        <TextInput
          style={[styles.fieldInput, { borderColor: colors.purple, color: colors.text }]}
          placeholder="Contoh: Ruang 106"
          placeholderTextColor={colors.textMuted}
          value={newRoomName}
          onChangeText={setNewRoomName}
        />

        <Text style={[styles.helperText, { color: colors.textMuted }]}>
          Status ruangan (Kosong/Terpakai) akan otomatis mengikuti jadwal yang berlaku hari ini.
        </Text>

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.purple }]} onPress={handleAddRoom}>
          <Text style={styles.saveBtnText}>Simpan ruangan</Text>
        </TouchableOpacity>
      </CenterModal>

      <ConfirmModal
        visible={!!confirmRoom}
        onClose={() => setConfirmRoom(null)}
        title="Kosongkan ruangan?"
        description={`${confirmRoom?.name || ""} akan diubah statusnya menjadi Kosong dan jadwal terkait akan dihapus dari ruangan ini.`}
        confirmLabel="Ya, kosongkan"
        onConfirm={handleEmptyRoom}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus ruangan?"
        description={`${deleteTarget?.name || ""} akan dihapus permanen beserta jadwal yang memakai ruangan ini. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, hapus"
        onConfirm={handleDeleteRoom}
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
    paddingVertical: 12,
    marginBottom: 18,
  },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  roomRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1 },
  trashBtn: { paddingLeft: 12 },
  roomName: { fontSize: 15, fontWeight: "700" },
  roomStatus: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  roomInfo: { fontSize: 13 },
  roomPerson: { fontSize: 11, marginTop: 2 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  searchInputRow: { marginBottom: 16 },
  searchInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  foundRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1 },
  closeBtn: { marginTop: 18, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  closeBtnText: { fontWeight: "700" },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  helperText: { fontSize: 12, marginTop: 12, lineHeight: 17 },
  saveBtn: { marginTop: 22, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: "#FFFFFF", fontWeight: "700" },
});