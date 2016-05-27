'use strict';

// This file contains helpers for running operations in REST format.
// The goal is that handlers that explicitly handle an express route
// should just be shallow wrapers around things in this file, but 
// these functions should not explicitly depend on the request
// object.
// This means that one of these handlers can support multiple
// routes. That's useful for the routes that do similar
// things.

var CoreError = require('libutil').Errors;
var Noncelib = require('./Noncelib');
var Encryptor = require('libencrypt');
var Cache = require('libutil').Cache;

function create(restObject) {
  if (!restObject.payload) {
    throw new CoreError(CoreError.OBJECT_NOT_FOUND,
                        'Missing required payload');
  }

  var config = Cache.getConfig();
  var params = {
    nonceSecret: config.nonceSecret,
    nonceDuration: config.nonceDuration,
    payload: restObject.payload
  };
  
  var nonceLib = new Noncelib(params);
  return nonceLib.execute().then((nonce) => {
    return {response: nonce};
  });
}

function verify(restObject) {
  if (!restObject.payload) {
    throw new CoreError(CoreError.OBJECT_NOT_FOUND,
                        'Missing required params');
  }
  var config = Cache.getConfig();
  var payload = restObject.payload;

  var nonceEncryptor = new Encryptor(config.encrypt);
  var coreEncryptor = new Encryptor(config.core);
  var nonceKM;

  var nonceLib = new Noncelib(config);

  return nonceEncryptor.loadKeyManager().then((nKm) => {
    return nonceEncryptor.unlockKeyManager(nKm);
  }).then((nKm) => {
    nonceKM = nKm;
    return coreEncryptor.loadKeyManager();
  }).then((cKm) => {
    return nonceEncryptor.decrypt(payload, nonceKM, cKm);
  }).then((blob) => {
    return nonceLib.verify(blob);
  }).then((result) => {
    return {response: result};
  }).catch((err) => {
    console.error(err.stack ? err.stack : err);
    throw new CoreError(CoreError.VALIDATION_ERROR,
                        "Unauthorized access or invalid nonce");
  });
}

module.exports = {
  create: create,
  verify: verify
};