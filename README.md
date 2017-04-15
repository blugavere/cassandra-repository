# Cassandra Repository 
[![NPM version][npm-image]][npm-url][![Coverage Status](https://coveralls.io/repos/github/blugavere/cassandra-repository/badge.svg?branch=master)](https://coveralls.io/github/blugavere/cassandra-repository?branch=master)[![dependencies Status](https://david-dm.org/blugavere/cassandra-repository/status.svg)](https://david-dm.org/blugavere/cassandra-repository) [![NPM Downloads](https://img.shields.io/npm/dm/cassandra-repository.svg?style=flat)](https://www.npmjs.com/package/cassandra-repository)[![Build Status](https://travis-ci.org/blugavere/cassandra-repository.svg?branch=master)](https://travis-ci.org/blugavere/cassandra-repository)[![Patreon](https://img.shields.io/badge/patreon-support%20the%20author-blue.svg)](https://www.patreon.com/blugavere)

## Installation 

```sh
$ npm install --save cassandra-repository
```

## Usage

```js
const CassandraRepository = require('cassandra-repository');

class CatRepository extends CassandraRepository {
  constructor(cassandra, modelName) {
    super(cassandra, modelName);
  }
}

// or if you dont need custom functionality

const repo = new CassandraRepository(cassandra, modelName);

```

## Getting Started

```js

'use strict';

const Cassandra = require('express-cassandra');
const CassandraRepository = require('cassandra-repository');

const cassandra = Cassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'mykeyspace',
    queryOptions: { consistency: Cassandra.consistencies.one }
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

export const modelName = 'Cats';

// configure a schema
export const schema = {
  fields: {
    _id: 'text',
    name: 'text'
  },
  key: ['_id']
};

let cassandraRepo;

// json object
const cat = { name : 'Fido' };

cassandra.connect(() => {

  // register it to cassandra
  cassandra.loadSchema(modelName, schema);
  repo = new CassandraRepository(cassandra, modelName);
  
  repo.add(cat, (err, data) => {
    console.log(data);
    repo.disconnect();
  });
});

```


## License

MIT © [Ben Lugavere](http://benlugavere.com/)


[npm-image]: https://badge.fury.io/js/cassandra-repository.svg
[npm-url]: https://npmjs.org/package/cassandra-repository
[travis-image]: https://travis-ci.org/blugavere/cassandra-repository.svg?branch=master
[travis-url]: https://travis-ci.org/blugavere/cassandra-repository
[daviddm-image]: https://david-dm.org/blugavere/cassandra-repository.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/cassandra-repository
[coveralls-image]: https://coveralls.io/repos/blugavere/cassandra-repository/badge.svg
[coveralls-url]: https://coveralls.io/r/blugavere/cassandra-repository
