const kafka = require('./Kafka')
const fn = require('../config/fieldNames');
const immediate = require('../runningMethods/immediate');
const { dataSources, kafkaConf } = require('../config/fieldNames');
const { logLevel, wrapSendLog } = require('../util/logger');
const logDetails = require('../util/logDetails');

require('dotenv').config()

const sendLog = wrapSendLog(fn.runnigTypes.kafkaRun, { kafkaFunction: kafkaConf.migartion.flowName });

const topic = process.env.KAFKA_MIGRATION_TOPIC
const consumer = kafka.consumer({
  groupId: process.env.KAFKA_MIGRATION_GROUP_ID
})

const migration = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const identifier = JSON.parse(message.value);
        await immediate(dataSources.ads, [ identifier ]);

        sendLog(logLevel.info, logDetails.info.INF_CONSUME_FROM_KAFKA, topic, `key: ${message.key} value: ${message.value}`);
      } catch (error) {
        sendLog(logLevel.error, logDetails.error.ERR_WRONG_MESSAGE_FROM_KAFKA, topic, `key: ${message.key} value: ${message.value}`, error.message);
      }
    }
  })
}

module.exports = async () => migration().catch(error => sendLog(logLevel.error, logDetails.error.ERR_CONNECTING_TO_KAFKA, topic, error.message));
