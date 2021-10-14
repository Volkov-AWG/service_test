const BaseApi = require('classes/BaseApi');
const FormData = require('form-data');
const fs = require('fs');
const config = require('config');

class StagingAreaCrud extends BaseApi {
  constructor(server = config.streams.stagingArea, options = {}) {
    super(server, options);
  }

  uploadFile(file, path, model_id, partner_code, authorization = config.stagingAreaOptions.admin) {
    const headers = (authorization !== false) ? { authorization } : {};
    const data = new FormData();

    data.append('file', fs.createReadStream(`${path}/${file}`));
    Object.assign(headers, data.getHeaders());
    headers['content-language'] = 'ru';
    return this.post(`/v1/products/partner-format:upload-xlsx?partnerUniqueIdentifier=${partner_code}&productModelIdentifier=${model_id}`, data, { headers });
  }
}

module.exports = StagingAreaCrud;
