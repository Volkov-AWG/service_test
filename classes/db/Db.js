class Db {
  constructor(client) {
    this.client = client;
  }

  connect(database) {
    return this.client.connect(database);
  }

  select(query) {
    return this.client.select(query);
  }

  insert(query) {
    return this.client.insert(query);
  }

  update(query) {
    return this.client.update(query);
  }

  delete(query) {
    return this.client.delete(query);
  }

  disconnect() {
    return this.client.disconnect();
  }
}

module.exports = Db;
