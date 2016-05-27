// This file contains helpers for running operations in REST format.
// The goal is that handlers that explicitly handle an express route
// should just be shallow wrapers around things in this file, but 
// these functions should not explicitly depend on the request
// object.
// This means that one of these handlers can support multiple
// routes. That's useful for the routes that do similar
// things.

var CoreError = require('./errors');

var cache = require('./cache');
var RestWrite = require('./RestWrite');

// Returns a promise for a {response, status, location} object.
function create(config, auth, className, restObject) {
  enforceRoleSecurity('create', className, auth);

  var write = new RestWrite(config, auth, className, null, restObject);
  return write.execute();
}

function enforceRoleSecurity(method, className, auth) {
  if (className === '_ROLE' && !auth.isMaster) {
    throw new CoreError(CoreError.OPERATION_FORBIDDEN,
                        'Clients aren\'t allowed to perform the ' +
                        method + ' operation on the role collection.');
  }
  if (method === 'delete' && className === '_Installation' && !auth.isMaster) {
    throw new CoreError(CoreError.OPERATION_FORBIDDEN,
                        'Clients aren\'t allowed to perform the ' +
                        'delete operation on the installation collection.');
  }
}

module.exports = {
  create: create
}