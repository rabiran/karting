const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create require('dotenv').config()the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-logs.log`,
  datePattern: 'YYYY-MM-DD',
  prepend: true,
  json: true,
});

const dailyRotateFileTransportERROR = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-ERROR logs.log`,
  level: 'error',
  datePattern: 'YYYY-MM-DD',
});

const consoleTransport = new transports.Console({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  )
});



const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'verbose' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format((info)=>{
      info.service = "karting";
      info.hostname = os.hostname();
      return info
    })(),
    format.json(),
  ),
  transports: [
    consoleTransport,
    dailyRotateFileTransport,
    dailyRotateFileTransportERROR,
  ]
});

module.exports = logger;
