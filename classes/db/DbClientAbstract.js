class DbClientAbstract {
  connect() {
    throw new Error(`Method connect() should be implemented in ${this.constructor.name}`);
  }

  select() {
    throw new Error(`Method select() should be implemented in ${this.constructor.name}`);
  }

  insert() {
    throw new Error(`Method insert() should be implemented in ${this.constructor.name}`);
  }

  update() {
    throw new Error(`Method update() should be implemented in ${this.constructor.name}`);
  }

  delete() {
    throw new Error(`Method delete() should be implemented in ${this.constructor.name}`);
  }

  disconnect() {
    throw new Error(`Method disconnect() should be implemented in ${this.constructor.name}`);
  }
}

module.exports = DbClientAbstract;
