// A RestWrite encapsulates everything we need to run an operation 
// that writes to the database.
// This could be weither a "create" or an "update".

var crypto = require('crypto');
var deepcopy = require('deepcopy');

var CoreError = require("./errors");
var util = require('./util');

// query and data are both provided in REST API format. So data
// types are encoded by plain old objects.
// If query is null, this is a "create" and the data in data should be
// created.
// Otherwise this is an "update" - the object matching the query
// should get updated with data.
// RestWrite will handle objectId, createdAt and updatedAt for
// everything. It also knows to use triggers and special modifications
// for the _User class.
function RestWrite(config, auth, className, query, data, originalData) {
  this.config = config;
  this.auth = auth;
  this.className = className;
  this.storage = {};

  if (!query && data.objectId) {
    throw new CoreError(CoreError.INVALID_KEY_NAME, 'objectId ' +
                        'is an invalid field name.');
  }

  // When the operation is complete, this.response may have several
  // fields.
  // response: the actual data to be returned
  // status: the http status code. if not present, treated like a 200
  // location: the location header. if not present, no location header
  this.response = null;

  // Processing this operation may mutate our data, so we operate on a
  // copy
  this.query = deepcopy(query);
  this.data = deepcopy(data);
  // We never change originalData, so we do not need a deep copy
  this.originalData = originalData;

  // The timestamp we'll use for this whole operation
  this.updatedAt = util.encode(new Date()).iso;

  if (this.data) {
    // Add default fields
    this.data.updatedAt = this.updatedAt;
    if (!this.query) {
      this.data.createdAt = this.updatedAt;
      this.data.objectId = newObjectId();
    }
  }
}

// A convenient method to perform all the steps of processing the 
// write, in order.
// Returns a promise for {response, status, location} object.
// status and location are optional.
RestWrite.prototype.execute = function() {
  return Promise.resolve().then(() => {
    return this.validateSchema();
  })
};

RestWrite.prototype.validateSchema = function() {
  return this.config.database.validateObject(this.className, this.data);
  // return Promise.resolve().then(() => {
  //   return {response: this.data};
  // });
};

// Returns a unique string that's usable as an object id.
function newObjectId() {
  var chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
               'abcdefghijklmnopqrstuvwxyz' +
               '0123456789');
  var objectId = '';
  var bytes = crypto.randomBytes(10);
  for (var i = 0; i < bytes.length; ++i) {
    // Note: there is a slight modulo bias, because chars length
    // of 62 doesn't divide the number of all bytes (256) evenly.
    // It is acceptable for our purposes.
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }
  return objectId;
}

module.exports = RestWrite;
