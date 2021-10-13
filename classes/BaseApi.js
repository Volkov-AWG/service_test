const axios = require('axios');
const isPlainObject = require('is-plain-object');
const https = require('https');
const merge = require('deepmerge');

class BaseApi {
  constructor(server, options = {}) {
    this.client = axios.create(
      merge({
        baseURL: server,
        timeout: 60000,
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      }, options, { isMergeableObject: isPlainObject })
    );
  }

  get(uri, config = {}) {
    return this.client.get(uri, config)
      .then(response => this.formattedResponse(response))
      .catch(error => this.formattedError(error));
  }

  patch(uri, body = {}, config = {}) {
    return this.client.patch(uri, body, config)
      .then(response => this.formattedResponse(response))
      .catch(error => this.formattedError(error));
  }

  post(uri, body = {}, config = {}) {
    return this.client.post(uri, body, config)
      .then(response => this.formattedResponse(response))
      .catch(error => this.formattedError(error));
  }

  put(uri, body = {}, config = {}) {
    return this.client.put(uri, body, config)
      .then(response => this.formattedResponse(response))
      .catch(error => this.formattedError(error));
  }

  delete(uri, config = {}) {
    return this.client.delete(uri, config)
      .then(response => this.formattedResponse(response))
      .catch(error => this.formattedError(error));
  }

  formattedResponse(response) {
    try {
      this.normalResponse = {
        statusCode: response.status,
        body: response.data
      };
    } catch (e) {
      throw new Error(`Server responded with ${JSON.stringify(response)}`);
    }

    return this.normalResponse;
  }

  formattedError(err) {
    try {
      this.errorResponse = {
        statusCode: err.response.status,
        errName: err.response.data.message,
        errMessage: JSON.stringify(err.response.data)
      };
    } catch (e) {
      throw new Error(err);
    }

    return this.errorResponse;
  }

  setHeader(name, value) {
    this.client.defaults.headers[name] = value;
    return this;
  }

  setHeaders(headers) {
    Object.assign(this.client.defaults.headers, headers);
    return this;
  }

  unsetHeader(name) {
    delete this.client.defaults.headers[name];
    return this;
  }
}

module.exports = BaseApi;
