import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CenterModal from "./CenterModal";
import { useTheme } from "../theme/ThemeContext";

// field dropdown: value dipilih dari `options` (array of string), tidak bisa ketik bebas.
export default function PickerField({ label, placeholder, value, options, onChange, required, accentColor, emptyMessage }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const accent = accentColor || colors.blue;

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required ? " *" : ""}
      </Text>
      <TouchableOpacity
        style={[styles.field, { borderColor: value ? accent : colors.border }]}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <Text style={{ color: value ? colors.text : colors.textMuted, fontSize: 14 }}>
          {value || placeholder || "Pilih..."}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <CenterModal visible={open} onClose={() => setOpen(false)}>
        <View style={styles.modalHeaderRow}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{label}</Text>
          <TouchableOpacity onPress={() => setOpen(false)}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        {options.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: "center", paddingVertical: 20 }}>
            {emptyMessage || "Belum ada data. Tambahkan dulu di halaman terkait."}
          </Text>
        ) : (
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            style={{ maxHeight: 320 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, { borderBottomColor: colors.border }]}
                onPress={() => {
                  onChange(item);
                  setOpen(false);
                }}
              >
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: item === value ? "700" : "400" }}>
                  {item}
                </Text>
                {item === value && <Ionicons name="checkmark" size={18} color={accent} />}
              </TouchableOpacity>
            )}
          />
        )}
      </CenterModal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
});
