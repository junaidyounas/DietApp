module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './components',
            '@lib': './lib',
            '@types': './types',
            '@utils': './utils',
            '@data': './data',
            '@constants': './constants',
            '@hooks': './hooks',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
}; 
 