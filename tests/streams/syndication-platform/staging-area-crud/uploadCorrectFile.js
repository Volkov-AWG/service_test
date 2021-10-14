const chai = require('chai');

chai.use(require('deep-equal-in-any-order'));

const { expect } = chai;

const path = 'tests/streams/syndication-platform/staging-area-crud/data';
const config = require('config');
const StagingArea = require('classes/streams/syndication-platform/StagingAreaCrud');

const stagingArea = new StagingArea(config.streams.stagingArea);

describe('___ Check upload of excel file', () => {
  context('Upload file with one record', () => {
    let response;

    before('Upload file', async () => {
      response = await stagingArea.uploadFile('testmodel1.xlsx', path, 'model1', '98765');
    });

    it('Upload success', async () => {
      expect(response.statusCode, response.errMessage).to.equal(200);
    });
  });
});
