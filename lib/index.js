
'use strict';

const uuid = require('uuid');

class CassandraRepository {
  constructor(client, modelType) {
    this.client = client;
    if (modelType === undefined) {throw new Error('Postgre model type cannot be null.');}

    this.collection = client.instance[modelType];

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);

    this.disconnect = this.disconnect.bind(this);
  }

  /**
   * Truncates a collection.
   * @param {function} cb - callback
   * @returns {void}
   */
  clear(cb) {
    this.collection.delete({}, err => {
      if(cb) {
        if(err) {
          return cb(err);
        }
        return cb(null, true);
      }
    });
  }

  /**
   * Closes the database connection.
   * @param {function} cb - callback
   * @returns {void}
   */
  disconnect() {
    this.client.close();
  }

  /**
   * Finds all instances in the collection.
   * @param {function} cb - callback
   * @returns {void}
   */
  findAll(cb) {
    this.collection.find({}, {raw: true}, (err, data) => {
      if (err) {return cb(err);}
      cb(null, data);
    });
  }

  /**
   * Finds an instance in the collection by id.
   * @param {string} id - callback
   * @param {function} cb - callback
   * @returns {void}
   */
  findOne(id, cb) {
    this.collection.findOne({_id: id}, {raw: true}, (err, data) => {
      if (err) {return cb(err);}
      cb(null, data);
    });
  }

  /**
   * Create an entity.
   * @param {object} entity - Object to create.
   * @param {function} cb - callback
   * @returns {void}
   */
  add(entity, cb) {
    entity._id = uuid.v4();

    const model = new this.collection(entity);
    model.save(err => {
      if (err) {return cb(err);}
      cb(null, model.toJSON());
    });
  }

  /**
   * Update an entity.
   * @param {object} data - Object to update.
   * @param {function} cb - callback
   * @returns {void} - async
   */
  update(data, cb) {
    this.collection.findOne({_id: data._id}, (err, model) => {
      if (err) {return cb(err);}
      const entity = Object.assign(model, data);
      entity.save(err => {
        if (err) {return cb(err);}
        cb(null, entity.toJSON());
      });
    });
  }

  /**
   * Delete an entity.
   * @param {string} id - Entity Id
   * @param {function} cb - callback
   * @returns {void} - async
   */
  remove(id, cb) {
    const self = this;
    self.findOne(id, (err, data) => {
      if(err) {
        return cb(err);
      }
      self.collection.delete({_id: id}, err => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      });
    });
  }
}

module.exports = CassandraRepository;
