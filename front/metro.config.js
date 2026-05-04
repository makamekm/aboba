const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// IMPORTANT: Do NOT replace `config.resolver` object with a spread.
// Expo's web aliasing (react-native -> react-native-web) is attached to the resolver
// and can be lost if you overwrite the object.
if (config.resolver) {
  config.resolver.nodeModulesPaths = [
    path.resolve(__dirname, 'node_modules'),
  ];
}

module.exports = config;
