import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EventLogItem } from "../../models/voiceCall";
import { colors } from "../../theme";

export function EventLog({ logs }: { logs: EventLogItem[] }) {
  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Activity</Text>
        <Text style={styles.count}>{logs.length}</Text>
      </View>
      <ScrollView style={styles.list} nestedScrollEnabled>
        {logs.length === 0 ? (
          <Text style={styles.empty}>Call activity will appear here.</Text>
        ) : (
          logs.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.dot} />
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { flex: 1, minHeight: 180, marginTop: 28 },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heading: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  count: {
    color: colors.muted,
    fontSize: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  message: { flex: 1, marginHorizontal: 10, color: colors.ink, fontSize: 13 },
  time: { color: colors.muted, fontSize: 11, fontVariant: ["tabular-nums"] },
  empty: { paddingVertical: 28, color: colors.muted, fontSize: 13 },
});
