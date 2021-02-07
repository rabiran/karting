const { Kafka } = require('kafkajs');
require('dotenv').config();

module.exports = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: JSON.parse(process.env.KAFKA_BROKERS)
});