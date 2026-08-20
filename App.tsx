import React from "react";
import { StatusBar } from "expo-status-bar";

import { VoiceCallScreen } from "./src/views/VoiceCallScreen";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <VoiceCallScreen />
    </>
  );
}
