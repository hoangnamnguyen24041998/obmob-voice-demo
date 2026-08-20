export type AudioRoute = "earpiece" | "speaker" | "bluetooth";
export type CallStatus = "idle" | "connecting" | "joined";

export interface EventLogItem {
  id: number;
  message: string;
  time: string;
}

export const AUDIO_ROUTES: AudioRoute[] = ["earpiece", "speaker", "bluetooth"];

export const AUDIO_ROUTE_LABELS: Record<AudioRoute, string> = {
  earpiece: "Earpiece",
  speaker: "Speaker",
  bluetooth: "Bluetooth",
};
