const { expect } = require('chai');
const { retryAsync } = require('helpers/utils');
const config = require('config.js');

const merge = require('deepmerge');

const BaseApi = require('./BaseApi.js');

const defaults = {
  headers: {
    Authorization: config.rabbitOptions.auth
  }
};

class Rabbit extends BaseApi {
  constructor(server = config.rabbit, options = {}) {
    super(server, merge(defaults, options));
  }

  async sendMessage(rkey, payload, exchange = 'amq.default', vhost = '/', properties = {}) {
    const body = {
      properties,
      routing_key: rkey,
      payload: JSON.stringify(payload),
      payload_encoding: 'string'
    };

    const response = await this.post(`/api/exchanges/${(vhost === '/') ? '%2F' : vhost}/${exchange}/publish`, body);

    expect(response.statusCode, `Unable to send message to Rabbit: ${response.errMessage}`).to.equal(200);
    expect(response.body).to.eql({ routed: true });
  }

  async getMessages(
    queueName,
    payload = { count: 200, ackmode: 'ack_requeue_true', encoding: 'auto' },
    field,
    value
  ) {
    const response = await this.post(`/api/queues/%2F/${queueName}/get`, payload);

    expect(response.statusCode, `Unable to get messages from Rabbit ${queueName} queue: ${response.errMessage}`).to.equal(200);

    if (field) {
      return response.body
        .filter(message => message.payload.includes(`"${field}":"${value}"`))
        .map((message) => {
          const msg = message;

          msg.payload = JSON.parse(msg.payload);
          return msg;
        })
        .slice(-1)
        .pop();
    }

    return response;
  }

  async getQueueDetails(queueName, vhost = '/') {
    const response = await this.get(`/api/queues/${(vhost === '/') ? '%2F' : vhost}/${queueName}`);

    expect(response.statusCode, `Failed to get queue ${queueName} details on vhost ${vhost}`).to.equal(200);

    return response;
  }

  async purgeQueue(name, vhost = '/') {
    const data = { mode: 'purge', name, vhost };
    const response = await this.delete(`/api/queues/${(vhost === '/') ? '%2F' : vhost}/${name}/contents`, { data });

    expect(response.statusCode, `Unable to purge queue ${name}: ${response.errMessage}`).to.equal(204);

    await this.waitUntilQueueIsEmpty(name);
  }

  async deleteQueue(name, vhost = '/') {
    // Sometimes rabbit returns error unexpectedly
    await retryAsync(async () => {
      const response = await this.delete(`/api/queues/${(vhost === '/') ? '%2F' : vhost}/${name}`);

      expect(response.statusCode, `Failed to delete queue ${name} on vhost ${vhost}: ${response.errMessage}`).to.be.oneOf([204, 404]);
    }, null, 10000, 5000);
  }

  async createQueue(rkey, name, exchange = name.split('.')[0], vhost = '/') {
    let response = await this.put(`/api/queues/${(vhost === '/') ? '%2F' : vhost}/${name}`);

    expect(response.statusCode, `Failed to create queue ${name} on vhost ${vhost}`).to.be.oneOf([201, 204]);

    response = await this.post(`/api/bindings/${(vhost === '/') ? '%2F' : vhost}/e/${exchange}/q/${name}`, { routing_key: rkey });

    expect(
      response.statusCode,
      `Failed to bind queue ${name} to exchange ${exchange} by routing key ${rkey} on vhost ${vhost}`
    ).to.equal(201);
  }

  async checkQueue(queueName, expectedValue, timeout = 60000, pollingInterval = 5000) {
    await retryAsync(async () => {
      const { body: messages } = await this.getMessages(queueName, { count: 10000, ackmode: 'ack_requeue_true', encoding: 'auto' });

      const result = messages.filter(message => message.payload.includes(`"value":${JSON.stringify(expectedValue)}`));

      expect(result).to.have.lengthOf.above(0, `There's no message with ${JSON.stringify(expectedValue)}`);
    }, null, timeout, pollingInterval);
  }

  async waitUntilQueueIsEmpty(queueName, timeout = 60000, pollingInterval = 15000) {
    return retryAsync(async () => {
      const response = await this.getQueueDetails(queueName);

      if (response.body.messages !== 0) {
        throw Error(`Queue ${queueName} is not empty!`);
      }
    }, null, timeout, pollingInterval);
  }

  async createVirtualHost(name, description = '', tags = '') {
    const response = await this.put(`api/vhosts/${name}`, { name, description, tags });

    expect(response.statusCode, `Failed to create virtual host ${name}`).to.be.oneOf([201, 204]);
  }

  async createExchange(name, vhost = '/', type, durable = true, auto_delete = false, internal = false) {
    const response = await this.put(
      `/api/exchanges/${(vhost === '/') ? '%2F' : vhost}/${name}`,
      {
        vhost, name, type, durable, auto_delete, internal, arguments: {}
      }
    );

    expect(response.statusCode, `Failed to create virtual host ${name}`).to.be.oneOf([201, 204]);
  }
}

module.exports = Rabbit;
