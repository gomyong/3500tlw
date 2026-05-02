const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const os = require('os');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// ~/node_modules has react-native@0.85.2 but project requires 0.81.5.
// Block only RN packages from the home directory so Metro doesn't pick up
// the wrong version, while leaving @expo/cli and metro itself accessible.
const homeNM = path.resolve(os.homedir(), 'node_modules');
const e = homeNM.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

config.resolver.blockList = [
  new RegExp(`^${e}/react-native/.*`),
  new RegExp(`^${e}/react-native-safe-area-context/.*`),
  new RegExp(`^${e}/react-native-screens/.*`),
  new RegExp(`^${e}/@react-native/.*`),
  new RegExp(`^${e}/@react-native-community/.*`),
  new RegExp(`^${e}/react/.*`),
  new RegExp(`^${e}/react-dom/.*`),
];

// Explicitly prefer project node_modules for all resolutions.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

module.exports = config;
