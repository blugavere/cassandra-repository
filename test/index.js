'use strict';

const Repo = require('../lib');
const Cassandra = require('express-cassandra');
const Assertions = require('../lib/test/Assertions');

/**
 * NODE_ENV=test mocha test/index.js --watch
 */

let host = '127.0.0.1';
const port = 9042;
if (process.env.NODE_ENV === 'docker') {
  console.log('Using docker configuration!');
  host = 'cassandra';
}

const models = Cassandra.createClient({
  clientOptions: {
    contactPoints: [host],
    protocolOptions: {
      port
    },
    keyspace: 'mykeyspace',
    queryOptions: {
      consistency: Cassandra.consistencies.one
    }
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1
    },
    migration: 'safe',
    createKeyspace: true
  }
});

const modelName = 'clients';

const schema = {
  fields: {
    _id: 'text',
    name: 'text'
  },
  key: ['_id']
};

// mocha test/index.js --watch

describe('Cassandra Repository', () => {
  let repo;
  before(function (done) {
    this.timeout(40000);
    console.time('waiting');
    setTimeout(() => {
      console.timeEnd('waiting');
      models.connect(err => {
        if (err) {
          console.log(err);
          return done(err);
        }
        models.loadSchema(modelName, schema);
        repo = new Repo(models, modelName);
        done();
      }, 50000);
    });
  });
  after(done => {
    models.close(() => {
      done();
    });
  });
  describe('generic assertions', () => {
    const client = {
      name: 'foo'
    };
    const bag = {
      client
    };
    Assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });
});
