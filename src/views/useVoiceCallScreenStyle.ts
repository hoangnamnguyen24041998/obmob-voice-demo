import { StyleSheet } from "react-native";
import { colors } from "../theme";

export const useVoiceCallScreenStyle = () => {
  return StyleSheet.create({
    flex: { flex: 1 },
    safeArea: { flex: 1, backgroundColor: colors.background },
    content: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 24,
      paddingTop: 16,
    },
    headerCopy: { flex: 1, paddingRight: 12 },
    eyebrow: {
      color: colors.accent,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.5,
    },
    title: {
      marginTop: 8,
      color: colors.ink,
      fontSize: 29,
      fontWeight: "800",
      letterSpacing: -0.8,
    },
    subtitle: {
      marginTop: 6,
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
    },
    platformBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.surfaceMuted,
    },
    platformText: {
      color: colors.muted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    statusCard: {
      padding: 18,
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statusIdentity: { flexDirection: "row", alignItems: "center", gap: 8 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusLabel: { color: colors.ink, fontSize: 14, fontWeight: "700" },
    secureLabel: { color: colors.muted, fontSize: 11 },
    metrics: { flexDirection: "row", alignItems: "center", marginTop: 22 },
    metric: { flex: 1 },
    metricValue: {
      color: colors.ink,
      fontSize: 17,
      fontWeight: "700",
      textTransform: "capitalize",
    },
    metricLabel: { marginTop: 4, color: colors.muted, fontSize: 11 },
    divider: {
      width: 1,
      height: 30,
      marginHorizontal: 12,
      backgroundColor: colors.border,
    },
    joinSection: { marginTop: 24, gap: 10 },
    fieldLabel: { color: colors.ink, fontSize: 12, fontWeight: "700" },
    input: {
      height: 54,
      paddingHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      color: colors.ink,
      fontSize: 14,
    },
    controls: { marginTop: 24, gap: 10 },
    controlRow: { flexDirection: "row", gap: 10 },
  });
};
