const pg = require('pg');
const config = require('config.js');

const DbClientAbstract = require('classes/db/DbClientAbstract');

class PostgresClient extends DbClientAbstract {
  constructor(params = config.db) {
    super();

    let connectionString = `postgres://${params.user}:${params.pass}@${params.host}`;

    if (undefined !== params.port) {
      connectionString += `:${params.port}`;
    }

    if (undefined !== params.dbName) {
      connectionString += `/${params.dbName}`;
    }

    this.client = new pg.Client(connectionString);
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (e) {
      console.error(`Unable to connect to postgres ${e}`); // eslint-disable-line no-console
      process.exit(1);
    }
  }

  async insert(query) {
    try {
      await this.client.query(query);
    } catch (e) {
      console.error(`Unable to insert to postgres ${e}`); // eslint-disable-line no-console
    }
  }

  async select(query) {
    try {
      return await this.client.query(query); // eslint-disable-line consistent-return
    } catch (e) {
      console.error(`Unable to select from postgres${e}`);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
    } catch (e) {
      console.error(`Unable to disconnect from postgres ${e}`); // eslint-disable-line no-console
    }
  }
}

module.exports = PostgresClient;
