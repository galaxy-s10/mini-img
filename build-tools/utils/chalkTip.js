const chalk = require('chalk');
const emoji = require('node-emoji');

const _INFO = (v) => `${chalk.bgBlueBright.black(' INFO ')} ${v}`;
const _SUCCESS = (v) => `${chalk.bgGreenBright.black(' SUCCESS ')} ${v}`;
const _ERROR = (v) => `${chalk.bgRedBright.black(' ERROR ')} ${v}`;

module.exports = { _INFO, _SUCCESS, _ERROR, emoji };
