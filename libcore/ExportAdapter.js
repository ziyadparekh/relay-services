// A database adapter that works with data exported from the hosted
// Core database.

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var CoreError = require('./errors');

var Schema = require('./Schema');

// options can contain:
//   collectionPrefix: the string to put in front of every collection name.
function ExportAdapter(mongoURI, options) {
  this.mongoURI = mongoURI;
  options = options || {};

  this.collectionPrefix = options.collectionPrefix;

  // We don't want a mutable this.schema, because then you could have
  // one request that uses different schemas for different parts of
  // it. Instead, use loadSchema to get a schema.
  this.schemaPromise = null;

  this.connect();
}

// Connects to the database. Returns a promise that resolves when the 
// connection is successful.
// this.db will be populated with a Mongo "Db" object when the
// promise resolves successfully.
ExportAdapter.prototype.connect = function() {
  if (this.connectionPromise) {
    // There's already a connection in progress.
    return this.connectionPromise;
  }

  //http://regexr.com/3cncm
  if (!this.mongoURI.match(/^mongodb:\/\/((.+):(.+)@)?([^:@]+):{0,1}([^:]+)\/(.+?)$/gm)) {
    throw new Error("Invalid mongoURI: " + this.mongoURI)
  }
  var usernameStart = this.mongoURI.indexOf('://') + 3;
  var lastAtIndex = this.mongoURI.lastIndexOf('@');
  var encodedMongoURI = this.mongoURI;
  var split = null;
  if (lastAtIndex > 0) {
    split = this.mongoURI.slice(usernameStart, lastAtIndex).split(':');
    encodedMongoURI = this.mongoURI.slice(0, usernameStart) + encodeURIComponent(split[0]) + ':' + encodeURIComponent(split[1]) + this.mongoURI.slice(lastAtIndex);
  }

  this.connectionPromise = Promise.resolve().then(() => {
    return MongoClient.connect(this.mongoURI);
  }).then((db) => {
    this.db = db;
  });
  return this.connectionPromise;
};

// Returns a promise for a Mongo collection.
// Generally just for internal use.
var joinRegex = /^_JOIN:[A-Za-z0-9_]+:[A-Za-z0-9_]+/;
var otherRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
ExportAdapter.prototype.collection = function(className) {
  if (className !== '_User' &&
      className !== '_Session' &&
      className !== '_SCHEMA' &&
      className !== '_ROLE' &&
      !joinRegex.test(className) &&
      !otherRegex.test(className)) {
    throw new CoreError(CoreError.INVALID_CLASS_NAME,
                        'invalid className: ' + className);
  }
  return this.connect().then(() => {
    return this.db.collection(this.collectionPrefix + className);
  });
};

function returnsTrue() {
  return true;
}

// Returns a promise for a schema object.
// If we are provided an acceptor, then we run it on the schema.
// If the schema isn't accepted, we reload it at most once.
ExportAdapter.prototype.loadSchema = function(acceptor) {
  acceptor = acceptor || returnsTrue;

  if (!this.schemaPromise) {
    this.schemaPromise = this.collection('_SCHEMA').then((coll) => {
      delete this.schemaPromise;
      return Schema.load(coll);
    });
    return this.schemaPromise;
  }

  return this.schemaPromise.then((schema) => {
    if (acceptor(schema)) {
      return schema;
    }
    this.schemaPromise = this.collection('_SCHEMA').then((coll) => {
      delete this.schemaPromise;
      return Schema.load(coll);
    });
    return this.schemaPromise;
  })
};


// Uses the schema to validate the object (REST API format).
// Returns a promise that resolves to the new schema.
// This does not update this.schema, becuase in a situation like 
// a batch request, that could confuse other users of the schema.
ExportAdapter.prototype.validateObject = function(className, object) {
  return this.loadSchema().then((schema) => {
    return schema.validateObject(className, object);
  });
};

module.exports = ExportAdapter;