const { _INFO, emoji } = require('./build-tools/utils/chalkTip');

console.log(_INFO('读取babel.config.js'), emoji.get('hourglass'));
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3',
      },
    ],
  ],
  plugins: [],
};
