import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import Fab from "../components/Fab";
import CenterModal from "../components/CenterModal";
import ConfirmModal from "../components/ConfirmModal";
import PickerField from "../components/PickerField";
import { useTheme } from "../theme/ThemeContext";
import { useAppData } from "../context/AppDataContext";
import { SUBJECT_COLORS } from "../theme/colors";
import { DAYS } from "../data/seed";

const emptyForm = { day: "", className: "", room: "", teacher: "", startTime: "", endTime: "" };

export default function JadwalScreen() {
  const { colors } = useTheme();
  const { classes, rooms, schedule, addScheduleItem, updateScheduleItem, deleteScheduleItem } = useAppData();
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);

  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [deleteItem, setDeleteItem] = useState(null);

  const classNames = classes.map((c) => c.name);
  const roomNames = rooms.map((r) => r.name);
  const items = schedule[activeDay] || [];

  const resetAddForm = () => setAddForm({ ...emptyForm, day: activeDay });

  const validate = (form) => {
    if (!form.day) return "Hari wajib dipilih.";
    if (!form.className) return "Kelas wajib dipilih.";
    if (!form.room) return "Ruangan wajib dipilih.";
    if (!form.startTime.trim() || !form.endTime.trim()) return "Jam mulai dan jam selesai wajib diisi.";
    return null;
  };

  const handleAdd = () => {
    const err = validate(addForm);
    if (err) {
      Alert.alert("Belum lengkap", err);
      return;
    }
    addScheduleItem(addForm.day, {
      time: `${addForm.startTime.trim()} - ${addForm.endTime.trim()}`,
      className: addForm.className,
      room: addForm.room,
      teacher: addForm.teacher.trim(),
      color: SUBJECT_COLORS[items.length % SUBJECT_COLORS.length],
    });
    setAddOpen(false);
    setActiveDay(addForm.day);
    resetAddForm();
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      day: activeDay,
      className: item.className,
      room: item.room,
      teacher: item.teacher || "",
      startTime: item.time.split(" - ")[0] || "",
      endTime: item.time.split(" - ")[1] || "",
    });
  };

  const handleSaveEdit = () => {
    const err = validate(editForm);
    if (err) {
      Alert.alert("Belum lengkap", err);
      return;
    }
    updateScheduleItem(activeDay, editItem.id, {
      time: `${editForm.startTime.trim()} - ${editForm.endTime.trim()}`,
      className: editForm.className,
      room: editForm.room,
      teacher: editForm.teacher.trim(),
    });
    setEditItem(null);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteScheduleItem(activeDay, deleteItem.id);
  };

  const renderFormFields = (form, setForm, accentColor) => (
    <>
      <PickerField
        label="Hari"
        required
        value={form.day}
        options={DAYS}
        onChange={(v) => setForm((f) => ({ ...f, day: v }))}
        accentColor={accentColor}
      />

      <PickerField
        label="Kelas"
        required
        placeholder="Pilih kelas"
        value={form.className}
        options={classNames}
        onChange={(v) => setForm((f) => ({ ...f, className: v }))}
        accentColor={accentColor}
        emptyMessage="Belum ada kelas. Tambahkan dulu di halaman Kelas."
      />

      <PickerField
        label="Ruangan"
        required
        placeholder="Pilih ruangan"
        value={form.room}
        options={roomNames}
        onChange={(v) => setForm((f) => ({ ...f, room: v }))}
        accentColor={accentColor}
        emptyMessage="Belum ada ruangan. Tambahkan dulu di halaman Ruangan."
      />

      <Text style={[styles.fieldLabel, { color: colors.text }]}>Nama guru</Text>
      <TextInput
        style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
        placeholder="Nama guru pengajar"
        placeholderTextColor={colors.textMuted}
        value={form.teacher}
        onChangeText={(v) => setForm((f) => ({ ...f, teacher: v }))}
      />

      <View style={styles.timeRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Jam mulai *</Text>
          <TextInput
            style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
            placeholder="07:00"
            placeholderTextColor={colors.textMuted}
            value={form.startTime}
            onChangeText={(v) => setForm((f) => ({ ...f, startTime: v }))}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Jam selesai *</Text>
          <TextInput
            style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
            placeholder="08:30"
            placeholderTextColor={colors.textMuted}
            value={form.endTime}
            onChangeText={(v) => setForm((f) => ({ ...f, endTime: v }))}
          />
        </View>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScreenHeader icon="calendar-outline" title="Jadwal" subtitle="Kamis, 4 September" />

      <View style={styles.dayTabs}>
        {DAYS.map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setActiveDay(d)}
            style={[styles.dayTab, { backgroundColor: activeDay === d ? colors.navy : "transparent" }]}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: activeDay === d ? colors.white : colors.textMuted }}>
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        {items.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada jadwal untuk hari ini.</Text>
        ) : (
          items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.scheduleRow}
              activeOpacity={0.7}
              onPress={() => openEdit(item)}
              onLongPress={() => setDeleteItem(item)}
            >
              <View style={[styles.colorBar, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.scheduleTime, { color: colors.text }]}>{item.time}</Text>
                <Text style={[styles.scheduleSubject, { color: colors.text }]}>
                  {item.className}, {item.room}
                </Text>
                {!!item.teacher && (
                  <Text style={[styles.scheduleTeacher, { color: colors.textMuted }]}>{item.teacher}</Text>
                )}
              </View>
              <Ionicons name="create-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
        {items.length > 0 && (
          <Text style={[styles.hintText, { color: colors.textMuted }]}>
            Ketuk jadwal untuk edit, tekan lama untuk hapus.
          </Text>
        )}
      </ScrollView>

      <Fab
        color={colors.green}
        onPress={() => {
          resetAddForm();
          setAddOpen(true);
        }}
      />

      <CenterModal visible={addOpen} onClose={() => setAddOpen(false)}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.modalHeaderRow}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Tambah jadwal baru</Text>
            <TouchableOpacity onPress={() => setAddOpen(false)}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {renderFormFields(addForm, setAddForm, colors.green)}

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.green }]} onPress={handleAdd}>
            <Text style={styles.saveBtnText}>Simpan jadwal</Text>
          </TouchableOpacity>
        </ScrollView>
      </CenterModal>

      <CenterModal visible={!!editItem} onClose={() => setEditItem(null)}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.modalHeaderRow}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit jadwal</Text>
            <TouchableOpacity onPress={() => setEditItem(null)}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {renderFormFields(editForm, setEditForm, colors.blue)}

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.blue }]} onPress={handleSaveEdit}>
            <Text style={styles.saveBtnText}>Simpan perubahan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: colors.redLight }]}
            onPress={() => {
              setDeleteItem(editItem);
              setEditItem(null);
            }}
          >
            <Text style={{ color: colors.red, fontWeight: "700" }}>Hapus jadwal ini</Text>
          </TouchableOpacity>
        </ScrollView>
      </CenterModal>

      <ConfirmModal
        visible={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Hapus jadwal?"
        description={`Jadwal ${deleteItem?.className || ""} pada ${deleteItem?.time || ""} akan dihapus. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, hapus"
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dayTabs: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  dayTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  body: { flex: 1, paddingHorizontal: 20 },
  emptyText: { fontSize: 13, textAlign: "center", marginTop: 40 },
  scheduleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 20 },
  colorBar: { width: 4, borderRadius: 2, alignSelf: "stretch" },
  scheduleTime: { fontSize: 15, fontWeight: "700" },
  scheduleSubject: { fontSize: 13, marginTop: 2 },
  scheduleTeacher: { fontSize: 11, marginTop: 2 },
  hintText: { fontSize: 11, textAlign: "center", marginTop: 4, marginBottom: 20 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14 },
  timeRow: { flexDirection: "row", gap: 12 },
  saveBtn: { marginTop: 22, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: "#FFFFFF", fontWeight: "700" },
  deleteBtn: { marginTop: 12, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
});
