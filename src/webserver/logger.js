const chalk = require('chalk');

module.exports = () => require('pino-pretty')({
    colorize: true,
    // format translateTime
    // translateTime: 'dd-MM-yyyy HH:mm:ss',
    // Enable or disable timestamp, translateTime won't work if disabled
    timestampKey: false,
    // Don't log these keys automatically
    ignore: 'pid,hostname,level',
    hideObject: true,
    messageFormat: log => {
        let ll = chalk.inverse(log.level);
        if (log.level === 10) ll = chalk.cyan('[TRACE]');
        else if (log.level === 20) ll = chalk.blue('[DEBUG]');
        else if (log.level === 30) ll = chalk.green('[INFO]');
        else if (log.level === 40) ll = chalk.yellow('[WARN]');
        else if (log.level === 50) ll = chalk.red('[ERROR]');
        else if (log.level === 60) ll = chalk.magenta('[FATAL]');
        return `${ll} ${chalk.cyan(log.msg)}`;
    },
});