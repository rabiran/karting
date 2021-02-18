const kafka = require('./Kafka');
const faker = require('faker');

require('dotenv').config();

function messagesGen() {
  const mis = [];
  for (let i = 0; i < 10; i++) {
    mis.push(faker.random.number({'min': 100000,'max': 999999999}).toString());
  }
  return mis;
}

const messages = messagesGen();
const topic = process.env.KAFKA_MIGRATION_TOPIC;
const producer = kafka.producer();

let i = 0

const sendMessage = async (producer, topic) => {
  await producer.connect()

  setInterval(function() {
    i = i >= messages.length - 1 ? 0 : i + 1
    payloads = {
      topic: topic,
      messages: [
        { key: 'migration-pn', value: JSON.stringify({ personalNumber: messages[i] }) }
      ]
    }
    console.log('payloads=', payloads);
    producer.send(payloads);
  }, 5000)
}

sendMessage(producer, topic);
