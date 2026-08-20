const fs = require("fs");
const path = require("path");

const modulePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native-background-timer",
  "android",
  "src",
  "main",
  "java",
  "com",
  "ocetnik",
  "timer",
  "BackgroundTimerModule.java"
);

if (!fs.existsSync(modulePath)) {
  console.warn("[postinstall] react-native-background-timer Android source was not found; skipping patch.");
  process.exit(0);
}

const source = fs.readFileSync(modulePath, "utf8");

if (source.includes("public void removeListeners(Integer count)")) {
  process.exit(0);
}

const marker = "    /*@ReactMethod\n    public void clearTimeout";
const listenerMethods = [
  "    // Required by React Native's NativeEventEmitter contract. Events are still",
  "    // emitted through RCTDeviceEventEmitter, so no native bookkeeping is needed.",
  "    @ReactMethod",
  "    public void addListener(String eventName) {",
  "    }",
  "",
  "    @ReactMethod",
  "    public void removeListeners(Integer count) {",
  "    }",
  "",
].join("\n");

if (!source.includes(marker)) {
  throw new Error("Unable to patch react-native-background-timer: insertion point changed.");
}

fs.writeFileSync(modulePath, source.replace(marker, listenerMethods + marker));
console.log("[postinstall] Patched react-native-background-timer NativeEventEmitter methods.");
