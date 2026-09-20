import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CenterModal from "./CenterModal";
import { useTheme } from "../theme/ThemeContext";

export default function ConfirmModal({
  visible,
  onClose,
  title,
  description,
  confirmLabel = "Ya, hapus",
  onConfirm,
}) {
  const { colors } = useTheme();

  return (
    <CenterModal visible={visible} onClose={onClose}>
      <View style={[styles.iconWrap, { backgroundColor: colors.redLight }]}>
        <Ionicons name="alert" size={26} color={colors.red} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.desc, { color: colors.textMuted }]}>{description}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.border }]}
          onPress={onClose}
        >
          <Text style={[styles.cancelText, { color: colors.text }]}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.red }]}
          onPress={() => {
            onConfirm && onConfirm();
            onClose && onClose();
          }}
        >
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        </TouchableOpacity>
      </View>
    </CenterModal>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { fontSize: 17, fontWeight: "700", textAlign: "center" },
  desc: { fontSize: 13, textAlign: "center", marginTop: 8, marginBottom: 20, lineHeight: 19 },
  row: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: "center" },
  cancelText: { fontWeight: "600" },
  confirmText: { color: "#FFFFFF", fontWeight: "700" },
});
