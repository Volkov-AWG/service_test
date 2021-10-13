const { expect } = require('chai');
const { retryAsync } = require('helpers/utils');

const fs = require('fs');
const amqp = require('amqplib');
const config = require('config');

const sslOptions = {
  cert: fs.readFileSync(`${config.rabbitOptions.certPath}/client_rabbit_cert.pem`),
  key: fs.readFileSync(`${config.rabbitOptions.certPath}/client_rabbit_key.pem`),
  rejectUnauthorized: false
  // timeout: 15000
};

const creds = Buffer.from(config.rabbitOptions.auth.replace('Basic ', ''), 'base64')
  .toString('ascii');

class RabbitAMQP {
  constructor(params) {
    this.connectionString = {
      protocol: 'amqps',
      hostname: params.hostname,
      port: params.port || 11096,
      username: params.username || creds.split(':')[0],
      password: params.password || creds.split(':')[1],
      locale: 'en_US',
      frameMax: 0,
      heartbeat: 0,
      vhost: params.vhost || '/'
    };
  }

  async connect() {
    this.connection = await amqp.connect(this.connectionString, sslOptions);
    this.publicationChannel = await this.connection.createChannel();
  }

  async publish(exchange, content, routingKey = '#') {
    const response = await this.publicationChannel.publish(exchange, routingKey, Buffer.from(JSON.stringify(content)));

    expect(response, `Message is not published to ${exchange} exchange.`).to.equal(true);
  }

  async createQueue(queueName, exchange, routingKey = '#', queueOptions = {}) {
    await retryAsync(async () => {
      const createResponse = await this.publicationChannel.assertQueue(queueName, queueOptions);

      expect(createResponse, `Queue ${queueName} is not created`).to.have.property('queue', queueName);

      const bindResponse = await this.publicationChannel.bindQueue(queueName, exchange, routingKey);

      expect(bindResponse).to.eql({});
    });
  }

  async purgeQueue(queue) {
    await retryAsync(async () => {
      const response = await this.publicationChannel.purgeQueue(queue);

      expect(response, `Queue ${queue} is not empty`).to.eql({ messageCount: 0 });
    });
  }

  async deleteQueue(name) {
    await retryAsync(async () => {
      const response = await this.publicationChannel.deleteQueue(name);

      expect(response, `Queue ${name} is not deleted`)
        .to.have.property('messageCount')
        .that.is.a('number');
    });
  }

  async sendToQueue(queue, content) {
    const response = await this.publicationChannel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));

    expect(response, `Message is not sent ${queue} queue.`).to.equal(true);
  }

  async waitUntilQueueIsEmpty(queueName, timeout = 60000, pollingInterval = 15000) {
    return retryAsync(async () => {
      const response = await this.publicationChannel.get(queueName);

      if (response) {
        if (response.fields.messageCount !== 0) {
          throw new Error(`Queue ${queueName} is not empty still!`);
        }
      }
    }, null, timeout, pollingInterval);
  }

  async waitUntilQueueIsNotEmpty(queueName, timeout = 60000, pollingInterval = 15000) {
    return retryAsync(async () => {
      const response = await this.publicationChannel.get(queueName);

      if (!response) {
        throw new Error(`Queue ${queueName} is empty still!`);
      }
    }, null, timeout, pollingInterval);
  }

  async disconnect() {
    await this.publicationChannel.close();
    await this.connection.close();
  }
}

module.exports = RabbitAMQP;
