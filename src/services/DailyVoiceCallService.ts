import Daily, {
  DailyCall,
  DailyEventObjectAppMessage,
  DailyEventObjectNetworkQualityEvent,
  DailyEventObjectParticipant,
  DailyEventObjectParticipantLeft,
} from "@daily-co/react-native-daily-js";

import { AudioRoute } from "../models/voiceCall";

interface DailyCallEvents {
  onJoined: () => void;
  onLeft: () => void;
  onError: (message: string) => void;
  onRemoteParticipantChange: (delta: number) => void;
  onNetworkQualityChange: (quality: string) => void;
  onAppMessage: (message: string) => void;
}

export class DailyVoiceCallService {
  private call: DailyCall | null = null;

  async join(roomUrl: string, events: DailyCallEvents): Promise<void> {
    await this.destroy();
    const call = Daily.createCallObject({ audioSource: true, videoSource: false });
    this.call = call;
    this.attachListeners(call, events);

    try {
      await call.join({ url: roomUrl });
    } catch (error) {
      await this.destroy();
      throw new Error(getErrorMessage(error));
    }
  }

  async leave(): Promise<void> {
    if (!this.call) return;
    const call = this.call;
    this.call = null;
    await call.leave();
    await call.destroy();
  }

  async setMicrophone(enabled: boolean): Promise<void> {
    await this.call?.setLocalAudio(enabled);
  }

  async setAudioRoute(route: AudioRoute): Promise<void> {
    await this.call?.setAudioDevice(route);
  }

  async destroy(): Promise<void> {
    const call = this.call;
    this.call = null;
    await call?.destroy();
  }

  private attachListeners(call: DailyCall, events: DailyCallEvents) {
    call.on("joined-meeting", events.onJoined);
    call.on("left-meeting", events.onLeft);
    call.on("error", (event) => events.onError(getErrorMessage(event?.errorMsg ?? event)));
    call.on("participant-joined", (event: DailyEventObjectParticipant | undefined) => {
      if (!event?.participant.local) events.onRemoteParticipantChange(1);
    });
    call.on("participant-left", (event: DailyEventObjectParticipantLeft | undefined) => {
      if (!event?.participant.local) events.onRemoteParticipantChange(-1);
    });
    call.on(
      "network-quality-change",
      (event: DailyEventObjectNetworkQualityEvent | undefined) => {
        if (event) events.onNetworkQualityChange(event.threshold);
      }
    );
    call.on("app-message", (event: DailyEventObjectAppMessage | undefined) => {
      events.onAppMessage(JSON.stringify(event?.data));
    });
  }
}

function getErrorMessage(error: unknown): string {
  const message = extractErrorMessage(error);

  if (message === "account-missing-payment-method") {
    return "Daily account missing payment method. Add one in Daily Dashboard or use a room from another active account.";
  }

  return message;
}

function extractErrorMessage(error: unknown): string {
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

  return "Unknown Daily error";
}
