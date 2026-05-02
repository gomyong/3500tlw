const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const os = require('os');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Prevent Metro from resolving modules from ~/node_modules (global/parent).
// Without this, Metro crawls up the directory tree and picks up a different
// react-native version installed at the user's home, which causes codegen errors.
const homeNodeModules = path.resolve(os.homedir(), 'node_modules');
const escapedPath = homeNodeModules.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [
  new RegExp(`^${escapedPath}/.*`),
];

module.exports = config;
