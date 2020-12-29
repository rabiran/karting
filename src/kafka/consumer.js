const { Kafka } = require('kafkajs')
const config = require('./config')
const immediate = require('../runningMethods/immediate');
const { dataSources, kafka } = require('../config/fieldNames');
const { logLevel, wrapSendLog } = require('../util/logger');
const logDetails = require('../util/logDetails');
const { error } = require('winston');

require('dotenv').config()

const sendLog = wrapSendLog(kafka.migartion)

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: JSON.parse(process.env.KAFKA_BROKERS)
})

const topic = config.kafka.TOPIC
const consumer = kafka.consumer({
  groupId: config.kafka.GROUPID
})

const migration = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const identifier = JSON.parse(message.value);
        await immediate(dataSources.oa, [ identifier ]);

        sendLog(logLevel.info, logDetails.info.INF_CONSUME_FROM_KAFKA, topic, `key: ${message.key} value: ${message.value}`);
      } catch (error) {
        sendLog(logLevel.error, logDetails.error.ERR_WRONG_MESSAGE_FROM_KAFKA, topic, `key: ${message.key} value: ${message.value}`);
      }
    }
  })
}

migration().catch(error => sendLog(logLevel.error, logDetails.error.ERR_CONNECTING_TO_KAFKA, topic, error.message), error);
