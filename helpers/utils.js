const { Random } = require('random-js');
const merge = require('deepmerge');
const { Chance } = require('chance');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const convert = require('xml-js');

const sleep = (millis) => {
  const t = (new Date())
    .getTime();
  let sl = 0;

  while (((new Date())
    .getTime() - t) < millis) {
    if (sl < ((new Date())
      .getTime() - t)) {
      sl = ((new Date())
        .getTime() - t);

      if (((new Date())
        .getTime() - t) % 1000 === 0) {
        // eslint-disable-next-line max-len
        // console.log("Sleep: " + Math.ceil((millis - ((new Date()).getTime() - t)) / 1000).toString() + "s");
      }
    }
  }
};

const asyncSleep = async ms => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const isKuber = () => process.env.ENV === 'KUBER';

const isDev = () => process.env.ENV === 'DEV';

const isTest = () => process.env.ENV === 'TEST';

const isPreprod = () => process.env.ENV === 'PPROD';

const retryAsync = async (fn, args, timeout = 60000, pollingInterval = 2500, silentMode = false) => {
  const interval = pollingInterval;
  const finishTime = Date.now() + timeout;
  let lastError = {};

  while (finishTime > Date.now()) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fn.apply(this, args);
    } catch (e) {
      lastError = e;
      if (!silentMode){
        console.log(`Retrying execution! ${e}`);
      }
      // eslint-disable-next-line no-await-in-loop
      await asyncSleep(interval);
    }
  }

  lastError.message += ` after ${timeout} ms`;
  throw lastError;
};

const checkDuring = async (fn, args, timeout = 60000, pollingInterval = 2500) => {
  const interval = pollingInterval;
  const finishTime = Date.now() + timeout;

  while (finishTime > Date.now()) {
    // eslint-disable-next-line no-await-in-loop
    await fn.apply(this, args);
    // eslint-disable-next-line no-await-in-loop
    await asyncSleep(interval);
  }
};

const getDate = (offsetDays = 0, presetDate, withTime = false) => {
  let now = presetDate ? new Date(presetDate) : new Date();

  now = new Date(now.setHours(now.getHours() - now.getTimezoneOffset() / 60));

  const date = new Date(now.setDate(now.getDate() + offsetDays)).toISOString();

  return withTime ? date : date.split('T')[0];
};

const calculatePartition = (step = 'twoDays', date = new Date()) => {
  const partitionStart = new Date(date);
  let partitionEnd;

  const getYyyyMmDd = srcDate => srcDate.toISOString().slice(0, 10)
    .replace(/-/g, '');

  switch (step) {
    case 'twoDays': {
      let day = partitionStart.getDate();

      if (day % 2 === 0) {
        partitionStart.setDate(--day);
      }

      partitionEnd = new Date(partitionStart);
      partitionEnd.setDate(day + 2);

      if (partitionEnd.getMonth() !== partitionStart.getMonth()) {
        partitionEnd.setDate(1);
      }

      break;
    }

    case 'month': {
      partitionStart.setDate(1);

      partitionEnd = new Date(partitionStart);
      partitionEnd.setMonth(partitionEnd.getMonth() + 1);
      break;
    }

    default: {
      throw new Error('Unknown step type');
    }
  }

  return `${getYyyyMmDd(partitionStart)}_${getYyyyMmDd(partitionEnd)}`;
};

const normalizeRabbitDate = (payload) => {
  let parsedPayload;

  switch (typeof payload) {
    case 'string':
      parsedPayload = JSON.parse(payload);
      break;
    case 'object':
      parsedPayload = merge({}, payload);
      break;
    default:
      throw new Error(`Payload of type ${typeof payload} is unsupported`);
  }

  parsedPayload.date = (new Date(parsedPayload.date)).toISOString();

  return parsedPayload;
};

const randomInt = (min = 1, max = 10000) => {
  const random = new Random(Random.nodeCrypto);
  return random.integer(min, max);
};

const randomText = (length = 10) => {
  const chance = new Chance();
  return chance.word({ length });
};

const getNewProductIds = (count = 1, sequential = false) => {
  let productIds;

  if (sequential) {
    const randId = randomInt(10000000, 99999999);

    productIds = Array(count).fill()
      .map((x, index) => randId + index);
  } else {
    productIds = Array.from(Array(count), () => randomInt(10000000, 99999999));
  }

  return productIds;
};

const downloadUrl = async (url, filename = `${process.cwd()}/download/${randomText(5)}`) => {
  const filePath = path.resolve(__dirname, filename);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => writer.close(resolve(filePath)));

    writer.on('error', (err) => {
      fs.unlink(filePath);
      reject(err);
    });
  });
};

const parseXml = (xmlPath, isObject = false) => {
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  if (isObject) {
    return JSON.parse(convert.xml2json(xmlContent, {
      compact: true,
      spaces: 4
    }));
  }

  return convert.xml2json(xmlContent, {
    compact: true,
    spaces: 4
  });
};

module.exports = {
  sleep,
  asyncSleep,
  retryAsync,
  getDate,
  normalizeRabbitDate,
  randomInt,
  randomText,
  isKuber,
  isTest,
  isDev,
  isPreprod,
  calculatePartition,
  getNewProductIds,
  checkDuring,
  downloadUrl,
  parseXml
};
