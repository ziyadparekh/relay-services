var deepcopy = require('deepcopy');
var CoreError = require('./errors');

var cache = require('./cache')

// An Auth object tells you who is requesting something and whether
// the master key was used.
// userObject is a Core.User and can be null if there is not user.
// Most probably will be null since most requests will be server to server
function Auth(config, isMaster, userObject) {
  this.config = config;
  this.isMaster = master;
  this.user = userObject;

  // Assuming a users roles won't change during a single request, we'll
  // only load them once.
  this.userRoles = [];
  this.fetchedRoles = false;
  this.rolePromise = null;
}

function master(config) {
  return new Auth(config, true, null);
}

function nobody(config) {
  return new Auth(config, false, null);
}

// Returns a promise that resolves to an Auth object
var getAuthForSessionToken = function(config, sessionToken) {
  var cachedUser = cache.getUser(sessionToken);
  if (cachedUser) {
    return Promise.resolve(new Auth(config, false, cachedUser));
  }
  var restOptions = {
    limit: 1,
    include: 'user'
  };
  var restWhere = {
    _session_token: sessionToken
  };
  var query = new RestQuery(config, master(config), '_Session',
                            restWhere, restOptions);
  // TODO: fill out method
  return query.execute().then((response) => {
    var results = response.results;
    if (results.length !== 1 || !results[0]['user']) {
      return nobody(config);
    }
    var obj = results[0]['user'];
    delete obj.password;
    obj['className'] = '_User';
    var userObject = obj;
    return new Auth(config, false, userObject);
  });
};

module.exports = {
  Auth: Auth,
  getAuthForSessionToken: getAuthForSessionToken
};