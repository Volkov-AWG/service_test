const merge = require('deepmerge');

const config = {
  COMMON: {
    stagingAreaOptions: {
      admin: 'Basic YWRtaW46aDdeZ0RiMTNIYjg2Jg=='
    }
  },

  KUBER: {
    streams: {
      stagingArea: 'http://localhost:8080/'
    }
  }
};

process.env.ENV = 'KUBER';

if (undefined !== process.env.ENV) {
  module.exports = merge(config[process.env.ENV], config.COMMON);
} else {
  throw new Error('ENV variable should be specified!');
}
