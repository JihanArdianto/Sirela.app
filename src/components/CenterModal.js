import React from "react";
import { Modal, View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function CenterModal({ visible, onClose, children }) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 22,
    maxHeight: "85%",
  },
});
