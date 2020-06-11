const { createLogger, format, transports, config } = require('winston');
require('winston-daily-rotate-file');
const fn = require('../config/fieldNames');
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

const immediateRotateFileTransport = identifier => {
  return new transports.DailyRotateFile({
  filename: `${logDir}/immediateRun/${identifier}-%DATE%-logs.log`,
  datePattern: 'YYYY-MM-DD',
  prepend: true,
  json: true,
});
}


const loggerConfig = {
  levels: config.npm.levels,
  // change level if in dev environment versus production
  level: env === 'development' ? 'verbose' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.splat(),
    format.simple(),
    format((info)=>{
      info.service = "karting";
      info.hostname = os.hostname();      
      info.title = (info.meta) ? info.meta.title : "Unknown message";
      delete info.meta;
      return info
    })(),
    format.json(),
  ),
  transports: [
    consoleTransport,
    dailyRotateFileTransport,
    dailyRotateFileTransportERROR,
  ]
};

const logger = createLogger(loggerConfig);
let loggerImmediate = createLogger(loggerConfig);

const levelString = Object.keys(config.npm.levels);

wrapSendLog = (runningType, identifier) => {
  let returnSendLog;
  loggerImmediate = createLogger(loggerConfig)
  identifier ? loggerImmediate.add(immediateRotateFileTransport(identifier)) : null;
  returnSendLog = runningType === fn.runnigTypes.ImmediateRun ? sendLogImmediate : sendLog
  return returnSendLog;
} 
const sendLog = (level, logDetails, ...params) => {
  const {title, message} = logDetails;  
  logger.log(levelString[level], message, ...params, {title});
};

const sendLogImmediate = (level, logDetails, ...params) => {
  const {title, message} = logDetails;  
  loggerImmediate.log(levelString[level], message, ...params, {title});
};

module.exports = {
  sendLog,
  wrapSendLog,
  logLevel: config.npm.levels,
};
