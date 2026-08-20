import { useCallback, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import { AUDIO_ROUTES, AudioRoute, CallStatus, EventLogItem } from "../models/voiceCall";
import { DailyVoiceCallService } from "../services/DailyVoiceCallService";

const MAX_LOG_ITEMS = 40;

export function useVoiceCallViewModel() {
  const service = useRef(new DailyVoiceCallService()).current;
  const nextLogId = useRef(0);
  const [roomUrl, setRoomUrl] = useState("");
  const [status, setStatus] = useState<CallStatus>("idle");
  const [micEnabled, setMicEnabled] = useState(true);
  const [audioRoute, setAudioRoute] = useState<AudioRoute>("earpiece");
  const [remoteParticipantCount, setRemoteParticipantCount] = useState(0);
  const [networkQuality, setNetworkQuality] = useState("unknown");
  const [logs, setLogs] = useState<EventLogItem[]>([]);

  const addLog = useCallback((message: string) => {
    const item = {
      id: nextLogId.current++,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    setLogs((current) => [item, ...current].slice(0, MAX_LOG_ITEMS));
  }, []);

  const join = useCallback(async () => {
    const normalizedUrl = roomUrl.trim();
    if (!normalizedUrl) {
      addLog("Enter a Daily room URL first");
      return;
    }

    setStatus("connecting");
    addLog("Connecting to room");
    try {
      const hasMicrophonePermission = await requestMicrophonePermission();
      if (!hasMicrophonePermission) {
        setStatus("idle");
        addLog("Microphone permission is required to join");
        return;
      }

      await service.join(normalizedUrl, {
        onJoined: () => {
          setStatus("joined");
          addLog("Call connected");
        },
        onLeft: () => {
          setStatus("idle");
          resetCallMetrics();
          addLog("Call ended");
        },
        onError: (message) => {
          setStatus("idle");
          addLog(`Error · ${message}`);
        },
        onRemoteParticipantChange: (delta) => {
          setRemoteParticipantCount((count) => Math.max(0, count + delta));
          addLog(delta > 0 ? "Participant joined" : "Participant left");
        },
        onNetworkQualityChange: (quality) => {
          setNetworkQuality(quality);
          addLog(`Network · ${quality}`);
        },
        onAppMessage: (message) => addLog(`Message · ${message}`),
      });
    } catch (error) {
      setStatus("idle");
      addLog(`Unable to join · ${getErrorMessage(error)}`);
    }
  }, [addLog, roomUrl, service]);

  const leave = useCallback(async () => {
    try {
      await service.leave();
    } catch (error) {
      addLog(`Unable to leave · ${getErrorMessage(error)}`);
    } finally {
      setStatus("idle");
      resetCallMetrics();
    }
  }, [addLog, service]);

  const toggleMicrophone = useCallback(async () => {
    const nextValue = !micEnabled;
    try {
      await service.setMicrophone(nextValue);
      setMicEnabled(nextValue);
      addLog(`Microphone ${nextValue ? "enabled" : "muted"}`);
    } catch (error) {
      addLog(`Microphone error · ${getErrorMessage(error)}`);
    }
  }, [addLog, micEnabled, service]);

  const cycleAudioRoute = useCallback(async () => {
    const currentIndex = AUDIO_ROUTES.indexOf(audioRoute);
    const nextRoute = AUDIO_ROUTES[(currentIndex + 1) % AUDIO_ROUTES.length] ?? "earpiece";
    try {
      await service.setAudioRoute(nextRoute);
      setAudioRoute(nextRoute);
      addLog(`Audio route · ${nextRoute}`);
    } catch (error) {
      addLog(`Audio route error · ${getErrorMessage(error)}`);
    }
  }, [addLog, audioRoute, service]);

  function resetCallMetrics() {
    setRemoteParticipantCount(0);
    setNetworkQuality("unknown");
  }

  useEffect(() => () => void service.destroy(), [service]);

  return {
    state: { roomUrl, status, micEnabled, audioRoute, remoteParticipantCount, networkQuality, logs },
    actions: { setRoomUrl, join, leave, toggleMicrophone, cycleAudioRoute },
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const details = error as Record<string, unknown>;
    for (const key of ["errorMsg", "message", "reason", "error", "type"]) {
      const value = details[key];
      if (typeof value === "string" && value) return value;
    }

    try {
      const serialized = JSON.stringify(error);
      if (serialized !== "{}") return serialized;
    } catch {
      // Fall through to the generic message below.
    }
  }

  return "Unknown error";
}

async function requestMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== "android") return true;

  const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO!;
  if (await PermissionsAndroid.check(permission)) return true;

  const result = await PermissionsAndroid.request(permission, {
    title: "Microphone permission",
    message: "ObMob Voice Demo needs microphone access to join a voice call.",
    buttonPositive: "Allow",
    buttonNegative: "Not now",
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}
