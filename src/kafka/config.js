module.exports = {
  kafka: {
    TOPIC: 'migrate',
    BROKERS: ['localhost:9092'],
    GROUPID: 'migrators',
    CLIENTID: 'migrator-1'
  }
}
