const merge = require('deepmerge');

const config = {
  COMMON: {
    stagingAreaOptions: {
      admin: 'Basic YWRtaW46aDdeZ0RiMTNIYjg2Jg=='
  },

  KUBER: { 
    streams: {
      stagingArea: 'https://staging-area-crud-dev-f5i63t.priv.nprd.pcdp.adeo.cloud',
  };

process.env.ENV = 'KUBER';

if (undefined !== process.env.ENV) {
  module.exports = merge(config[process.env.ENV], config.COMMON);
} else {
  throw new Error('ENV variable should be specified!');
}
