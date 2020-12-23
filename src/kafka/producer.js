const { Kafka } = require('kafkajs')
const config = require('./config')
const faker = require('faker')

function messagesGen() {
  const mis = [];
  for (let i = 0; i < 10; i++) {
    mis.push(faker.random.number({'min': 100000,'max': 999999999}).toString());
  }
  return mis;
}

const messages = messagesGen()

const client = new Kafka({
  brokers: config.kafka.BROKERS,
  clientId: config.kafka.CLIENTID
})

const topic = config.kafka.TOPIC

const producer = client.producer()

let i = 0

const sendMessage = async (producer, topic) => {
  await producer.connect()

  setInterval(function() {
    i = i >= messages.length - 1 ? 0 : i + 1
    payloads = {
      topic: topic,
      messages: [
        { key: 'migration-pn', value: JSON.stringify({ identifier: messages[i], dataSource: 'ads' }) }
      ]
    }
    console.log('payloads=', payloads)
    producer.send(payloads)
  }, 5000)
}

sendMessage(producer, topic)
