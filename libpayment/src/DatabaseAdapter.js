'use strict';
// Database Adapter
//
// Allows you to change the underlying database.
//
// Adapter classes must implement the following methods:
// * a constructor with signature (connectionString, optionsObject)
// * connect()
// * loadSchema()
// * create(className, object)
// * find(className, query, options)
// * update(className, query, update, options)
// * destroy(className, query, options)
// * This list is incomplete and the database process is not fully modularized.
//
// Default is MongoStorageAdapter.

let DatabaseController = require('./DatabaseController');
let MongoStorageAdapter = require('./MongoStorageAdapter');

const DefaultDatabaseURI = 'mongodb://localhost:27017/payments';
let adapter = MongoStorageAdapter;
let databaseURI = DefaultDatabaseURI;
let dbConnection;

function setAdapter(databaseAdapter) {
  adapter = databaseAdapter;
}

function setDatabaseURI(uri) {
  databaseURI = uri;
}

//Used by tests
function clearDatabaseURIs() {
  dbConnection = null;
}

function getDatabaseConnection(collectionPrefix) {
  if (dbConnection) {
    return dbConnection;
  }

  var dbURI = databaseURI;

  let storageAdapter = new adapter(dbURI);
  dbConnection = new DatabaseController(storageAdapter, {
    collectionPrefix: collectionPrefix
  });
  return dbConnection;
}

module.exports = {
  dbConnection: dbConnection,
  getDatabaseConnection: getDatabaseConnection,
  setAdapter: setAdapter,
  setDatabaseURI: setDatabaseURI,
  clearDatabaseURIs: clearDatabaseURIs,
  defaultDatabaseURI: databaseURI
};
