const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const os = require('os');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// ~/node_modules has react-native@0.85.2 but this project needs 0.81.5.
// Block RN packages from the home directory; Metro and @expo/cli remain accessible.
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

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Inject document/location polyfills before HMR initialises.
// Hermes raises ReferenceError for undeclared globals; ?. only catches null/undefined.
const originalGetPolyfills = config.serializer.getPolyfills;
config.serializer.getPolyfills = (params) => {
  const defaults = originalGetPolyfills ? originalGetPolyfills(params) : [];
  const list = Array.isArray(defaults) ? defaults : [];
  return [path.resolve(projectRoot, 'polyfills.js'), ...list];
};

module.exports = config;
