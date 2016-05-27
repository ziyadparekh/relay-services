"use strict";

var mkDeferred = require("./lib/deferred");
var redis = require("redis");
var _ = require("underscore");

var client = redis.createClient();

// var events = ["error", "ready", "connect", "reconnecting", "end", "drain", "idle"];
// events.forEach(function (evt, i) {
//   client.on(evt, function (msg) {
//     console.log("Redis Emit: ", evt);
//     console.log(msg);
//   });
// });

function formatError() {
  var args = [];
  _.each(arguments[0], function (val, indx) {
    args.push(val);
  });
  var msg = args.shift();
  var space = " ";
  args.forEach(function (arg, idx) {
    msg = msg + space + arg;
  });
  return msg;
}

var Redis = function (client) {
  this.client = client;
};

Redis.prototype.setExpires = function(key, seconds) {
  var def = mkDeferred();
  this.client.expire(key, seconds, function (err, reply) {
    if (err) {
      console.log(err);
      var msg = formatError("Redis error when trying to setExpires:", key, seconds);
      def.reject(new Error(msg));
    } else {
      def.resolve();
    }
  });
  return def.getPromise();
};

Redis.prototype.setHash = function(key, obj) {
  var def = mkDeferred();
  this.client.hmset(key, obj, function (err, reply) {
    if (err) {
      console.log(err);
      var msg = formatError("Redis error when trying to setHash:", key, obj);
      def.reject(new Error(msg));
    } else {
      def.resolve();
    }
  });
  return def.getPromise();
};

Redis.prototype.getHash = function(key) {
  var def = mkDeferred();
  this.client.hgetall(key, function (err, reply) {
    if (err) {
      console.log(err);
      var msg = formatError("Redis error when trying to getHash:", key);
      def.reject(new Error(msg));
    } else {
      def.resolve(reply);
    }
  });
  return def.getPromise();
};

Redis.prototype.set = function(key, val) {
  var def = mkDeferred();
  this.client.set(key, val, function (err, reply) {
    if (err) {
      console.log(err);
      var msg = formatError("Redis error when trying to set:", key, val);
      def.reject(new Error(msg));
    } else {
      def.resolve();
    }
  });
  return def.getPromise();
};

Redis.prototype.get = function(key) {
  var def = mkDeferred();
  this.client.get(key, function (err, reply) {
    if (err) {
      console.log(err);
      var msg = formatError("Redis error when trying to get:", key);
      def.reject(new Error(msg));
    } else {
      def.resolve(reply);
    }
  });
  return def.getPromise();
};


Redis.prototype.remove = function(key) {
  var def = mkDeferred();
  this.client.del(key, function (err, reply) {
    if (err) {
      console.log(err);
      var msg = formatError("Redis error when trying to del:", key);
      def.reject(new Error());
    } else {
      console.log(reply);
      def.resolve();
    }
  });
  return def.getPromise();
};

Redis.prototype.exists = function(key) {
  var def = mkDeferred();
  this.client.exists(key, function (err, reply) {
    if (err || reply !== 1) {
      var msg = formatError("Redis error, key does not exist:", key);
      def.reject(new Error(msg));
    } else {
      def.resolve();
    }
  });
  return def.getPromise();
};

/*
 * For Testing only
 */
Redis.prototype.formatError = function() {
  return formatError(arguments);
};

module.exports = new Redis(client);
