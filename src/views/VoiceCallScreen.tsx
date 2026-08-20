import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { AUDIO_ROUTE_LABELS } from "../models/voiceCall";
import { colors } from "../theme";
import { useVoiceCallViewModel } from "../viewmodels/useVoiceCallViewModel";
import { ActionButton } from "./components/ActionButton";
import { EventLog } from "./components/EventLog";
import { useVoiceCallScreenStyle } from "./useVoiceCallScreenStyle";

const STATUS_COPY = {
  idle: { label: "Ready", color: colors.muted },
  connecting: { label: "Connecting", color: colors.warning },
  joined: { label: "Live", color: colors.accent },
} as const;

export function VoiceCallScreen() {
  const { state, actions } = useVoiceCallViewModel();
  const isJoined = state.status === "joined";
  const status = STATUS_COPY[state.status];
  const styles = useVoiceCallScreenStyle();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>OBMOB · VOICE LAB</Text>
              <Text style={styles.title}>Clear conversations.</Text>
              <Text style={styles.subtitle}>
                A focused space to test real-time audio.
              </Text>
            </View>
            <View style={styles.platformBadge}>
              <Text style={styles.platformText}>{Platform.OS}</Text>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusTopRow}>
              <View style={styles.statusIdentity}>
                <View
                  style={[styles.statusDot, { backgroundColor: status.color }]}
                />
                <Text style={styles.statusLabel}>{status.label}</Text>
              </View>
              <Text style={styles.secureLabel}>WebRTC · encrypted</Text>
            </View>
            <View style={styles.metrics}>
              <Metric
                value={String(state.remoteParticipantCount)}
                label="People"
              />
              <View style={styles.divider} />
              <Metric value={state.networkQuality} label="Network" />
              <View style={styles.divider} />
              <Metric
                value={state.micEnabled ? "On" : "Muted"}
                label="Microphone"
              />
            </View>
          </View>

          {!isJoined ? (
            <View style={styles.joinSection}>
              <Text style={styles.fieldLabel}>Daily room URL</Text>
              <TextInput
                accessibilityLabel="Daily room URL"
                autoCapitalize="none"
                autoCorrect={false}
                editable={state.status !== "connecting"}
                keyboardType="url"
                onChangeText={actions.setRoomUrl}
                onSubmitEditing={actions.join}
                placeholder="https://your-team.daily.co/room"
                placeholderTextColor={colors.muted}
                returnKeyType="go"
                style={styles.input}
                value={state.roomUrl}
              />
              <ActionButton
                disabled={state.status === "connecting"}
                icon="↗"
                label={state.status === "connecting" ? "Joining…" : "Join room"}
                detail="Microphone only · camera stays off"
                onPress={actions.join}
                variant="primary"
              />
            </View>
          ) : (
            <View style={styles.controls}>
              <View style={styles.controlRow}>
                <ActionButton
                  icon={state.micEnabled ? "●" : "○"}
                  label={state.micEnabled ? "Mute" : "Unmute"}
                  detail={state.micEnabled ? "Mic is live" : "Mic is off"}
                  onPress={actions.toggleMicrophone}
                />
                <ActionButton
                  icon="⌁"
                  label={AUDIO_ROUTE_LABELS[state.audioRoute]}
                  detail="Tap to switch"
                  onPress={actions.cycleAudioRoute}
                />
              </View>
              <ActionButton
                icon="×"
                label="Leave call"
                detail="End this voice session"
                onPress={actions.leave}
                variant="danger"
              />
            </View>
          )}

          <EventLog logs={state.logs} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  const styles = useVoiceCallScreenStyle();

  return (
    <View style={styles.metric}>
      <Text numberOfLines={1} style={styles.metricValue}>
        {value}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}
