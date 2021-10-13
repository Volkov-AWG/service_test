const fs = require('fs');
const config = require('config.js');

const { MongoClient: MongoDb } = require('mongodb');
const DbClientAbstract = require('classes/db/DbClientAbstract');

const certFile = fs.readFileSync(`${config.mongo.certPath}/${config.mongo.certFileName}`);
const keyFile = fs.readFileSync(`${config.mongo.certPath}/${config.mongo.keyFileName}`);

class MongoClient extends DbClientAbstract {
  constructor() {
    super();

    this.client = new MongoDb(
      `mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.host}`,
      {
        sslValidate: false,
        tlsCertificateKeyFile: keyFile + certFile,
        loggerLevel: 'error',
        useUnifiedTopology: true,
        readPreference: 'secondaryPreferred'
      }
    );
  }

  async connect(dbName) {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
    } catch (e) {
      console.error(`Unable to connect to mongo ${e}`);
    }
  }

  async select(query) {
    return this.db.collection(query.collection)
      .find(query.filter || {})
      .project(query.project || {})
      .sort(query.sort || {})
      .limit(query.limit || 10)
      .toArray();
  }

  async insert(query) {
    return this.db.collection(query.collection).insertMany(query.values);
  }

  async update(query) {
    return this.db.collection(query.collection).updateOne(query.filter, { $set: query.values });
  }

  async delete(query) {
    return this.db.collection(query.collection).deleteMany(query.filter);
  }

  async disconnect() {
    try {
      await this.client.close();
    } catch (e) {
      console.error(`Unable to disconnect from mongo ${e}`);
    }
  }
}

module.exports = MongoClient;
