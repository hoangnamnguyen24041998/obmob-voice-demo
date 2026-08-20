const { withProjectBuildGradle } = require("expo/config-plugins");

const DEPENDENCY_EXCLUSION = `
// Voice-only Daily build: its optional USB-camera dependency references a
// libuvc artifact that is no longer available from JitPack.
allprojects {
    configurations.configureEach {
        exclude group: "com.github.jiangdongguo.AndroidUSBCamera", module: "libnative"
        exclude group: "com.github.jiangdongguo.AndroidUSBCamera", module: "libuvc"
    }
}
`;

module.exports = function withVoiceOnlyDaily(config) {
  return withProjectBuildGradle(config, (androidConfig) => {
    if (!androidConfig.modResults.contents.includes('module: "libuvc"')) {
      androidConfig.modResults.contents += DEPENDENCY_EXCLUSION;
    }
    return androidConfig;
  });
};
