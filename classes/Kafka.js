const config = require('config.js');
const { Kafka } = require('kafkajs');
const avro = require('avro-js');

const deserializeAvro = (avroSchema, message) => {
  const type = avro.parse(avroSchema);
  return type.fromBuffer(message);
};

const serializeAvro = (avroSchema, object) => {
  const type = avro.parse(avroSchema);
  return type.toBuffer(object);
};

class KafkaClient {
  constructor(clientId = 'my-app') {
    this.messages = [];

    this.kafka = new Kafka({
      clientId,
      brokers: [config.kafka]
    });

    this.producer = this.kafka.producer();

    this.consumer = this.kafka.consumer({
      groupId: `${clientId}_group`
    });
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (e) {
      console.error('Unable to connect to Kafka. Aborting...', e);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
    } catch (e) {
      console.error('Unable to disconnect to Kafka', e);
    }
  }

  async sendMessage(topic, key, message) {
    try {
      await this.producer.send({
        topic,
        messages: [{
          key,
          value: JSON.stringify(message)
        }],
        acks: 1
      });
    } catch (e) {
      console.error('Unable to send message to Kafka.', e);
    }
  }

  async sendMessageAvro(topic, key, avroSchema, object) {
    try {
      await this.producer.send({
        topic,
        messages: [{
          key,
          value: Buffer.from([0, 0, 0, 0, 1].concat(Object.values(serializeAvro(avroSchema, object))))
        }],
        acks: 1
      });
    } catch (e) {
      console.error('Unable to send message to Kafka.', e);
    }
  }

  async connectConsumer() {
    try {
      await this.consumer.connect();
    } catch (e) {
      console.error('Unable to connect to Kafka. Aborting...', e);
      process.exit(1);
    }
  }

  async consumerSubscribe(topic) {
    try {
      await this.consumer.subscribe({
        topic,
        fromBeginning: false
      });
    } catch (e) {
      console.error('Unable to subscribe to Kafka. Aborting...', e);
      process.exit(1);
    }
  }

  async consumerRun(avroSchema = null) {
    try {
      await this.consumer.run({
        eachMessage: async ({
          topic,
          partition,
          message
        }) => {
          const currentMessage = {
            topic,
            partition,
            key: message.key.toString()
          };

          if (avroSchema != null) {
            currentMessage.value = deserializeAvro(avroSchema, message.value.slice(5));
          } else {
            currentMessage.value = message.value.toString();
          }

          this.messages.push(currentMessage);
        }
      });
    } catch (e) {
      console.error('Unable to subscribe to Kafka. Aborting...', e);
      process.exit(1);
    }
  }

  async disconnectConsumer() {
    try {
      await this.consumer.disconnect();
    } catch (e) {
      console.error('Unable to disconnect to Kafka', e);
      process.exit(1);
    }
  }
}

module.exports = KafkaClient;
