const { Kafka } = require('kafkajs')
const config = require('./config')
const immediate = require('../runningMethods/immediate');
const { dataSources } = require('../config/fieldNames');
const { database } = require('faker');
const identifierHandler = require('../util/fieldsUtils/identifierHandler');

const kafka = new Kafka({
  clientId: config.kafka.CLIENTID,
  brokers: config.kafka.BROKERS
})

const topic = config.kafka.TOPIC
const consumer = kafka.consumer({
  groupId: config.kafka.GROUPID
})

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        // { dataSource, identifier } = {dataSource: "e", identifier: "e"}
        const { identifier, dataSource } = JSON.parse(message.value);
        // console.log(identifier, dataSource);
        await immediate(dataSource, [identifier]);
      } catch (error) {
        console.log('err=', error)
      }
    }
  })
}

function filterPassengerInfo(jsonObj) {
  let returnVal = null

  console.log(`eventId ${jsonObj.eventId} received!`)

  if (jsonObj.bodyTemperature >= 36.9 && jsonObj.overseasTravelHistory) {
    returnVal = jsonObj
  }

  return returnVal
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})

module.exports = {
  filterPassengerInfo
}
