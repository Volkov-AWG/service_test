/* eslint no-underscore-dangle: 0 */
const { expect } = require('chai');
const config = require('config');
const BaseApi = require('./BaseApi.js');

class Mountebank extends BaseApi {
  constructor(server = config.mountebank) {
    super(server);
  }

  createImposter(body) {
    return this.post('/imposters', body);
  }

  deleteImposters(port) {
    return this.delete(`/imposters/${port || ''}`);
  }

  getImposter(port) {
    return this.get(`/imposters/${port}`);
  }

  async addStubToImposter(newStub, port) {
    return this.post(`/imposters/${port}/stubs`, newStub);
  }

  // eslint-disable-next-line class-methods-use-this
  async createStub(serviceName, imposterBody) {
    const mockServer = new Mountebank();
    const responseGet = await mockServer.getImposter(serviceName.port);

    if ((responseGet.statusCode) === 200) {
      const mockBody = responseGet.body.stubs;

      mockBody.forEach((e) => {
        delete e._links;
      });

      if ((JSON.stringify(imposterBody.stubs)) !== (JSON.stringify(mockBody))) {
        const responseDelete = await mockServer.deleteImposters(serviceName.port);

        expect(responseDelete.statusCode, `Failed to delete imposter for ${Object.keys(serviceName)}:${serviceName.port}`).to.equal(200);

        const responseCreate = await mockServer.createImposter(imposterBody);

        expect(responseCreate.statusCode, `Failed to create imposter for ${Object.keys(serviceName)}:${serviceName.port}`).to.equal(201);
      }
    }

    if ((responseGet.statusCode) === 404) {
      const responseCreate = await mockServer.createImposter(imposterBody);

      expect(responseCreate.statusCode, `Failed to create imposter for ${Object.keys(serviceName)}:${serviceName.port}`).to.equal(201);
    }
  }
}

module.exports = Mountebank;
