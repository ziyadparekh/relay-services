'use strict';

let mongodb = require('mongodb');
let Schema = require('./Schema');
let CoreError = require('libutil').Errors

class DatabaseController {
  constructor(adapter, collectionPrefix) {
    this.adapter = adapter;

    this.collectionPrefix = collectionPrefix || '';

    this.schemaPromise = null;

    this.connect();
  }

  connect() {
    return this.adapter.connect();
  }

  // Returns a promise for a Mongo Collection.
  // Generally just for internal use.
  collection(className) {
    if (!Schema.classNameIsValid(className)) {
      throw new CoreError(CoreError.INVALID_CLASS_NAME,
                          'invalid className: ' + className);
    }
    return this.rawCollection(className);
  }

  rawCollection(className) {
    return this.adapter.collection(className);
  }

  // Inserts an object into the database.
  // Returns a promise that resolves successfully iff the object saved.
  create(className, object, options) {
    return this.collection(className).then((coll) => {
      return coll.insert([object]);
    });
  }

  // Runs a query on the database
  // Returns a promise that resolves to a list of items.
  find(className, query) {
    return this.collection(className).then((coll) => {
      return coll.find(query).toArray();
    }).then((results) => {
      return results;
    });
  }
}

module.exports = DatabaseController;