import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme";

interface Props {
  label: string;
  detail?: string;
  icon: string;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
  onPress: () => void;
}

export function ActionButton({
  label,
  detail,
  icon,
  variant = "default",
  disabled,
  onPress,
}: Props) {
  const hasColor = variant !== "default";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={[styles.icon, hasColor && styles.iconOnColor]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, hasColor && styles.textOnColor]}>{label}</Text>
        {detail ? (
          <Text style={[styles.detail, hasColor && styles.detailOnColor]}>{detail}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  default: {},
  primary: { backgroundColor: colors.ink, borderColor: colors.ink },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.55 },
  icon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  iconOnColor: { backgroundColor: colors.whiteOverlay },
  iconText: { fontSize: 17 },
  copy: { flex: 1 },
  label: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  textOnColor: { color: colors.white },
  detail: { marginTop: 2, color: colors.muted, fontSize: 12 },
  detailOnColor: { color: colors.whiteMuted },
});
