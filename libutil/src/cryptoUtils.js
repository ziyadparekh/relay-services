'use strict';

let crypto = require('crypto');

function salt(length) {
  return crypto.randomBytes(length).toString('base64');
}

function hmac(secret, data) {
  var hmac = crypto.createHmac('sha512', secret);
  hmac.update(data);
  return hmac.digest('hex');
}

// Returns a new random hex string of the given even size.
function randomHexString(size) {
  if (size === 0) {
    throw new Error('Zero-length randomHexString is useless.');
  }
  if (size % 2 !== 0) {
    throw new Error('randomHexString size must be divisible by 2.')
  }
  return crypto.randomBytes(size/2).toString('hex');
}

// Returns a new random alphanumeric string of the given size.
//
// Note: to simplify implementation, the result has slight modulo bias,
// because chars length of 62 doesn't divide the number of all bytes
// (256) evenly. Such bias is acceptable for most cases when the output
// length is long enough and doesn't need to be uniform.
function randomString(size) {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }
  let chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
               'abcdefghijklmnopqrstuvwxyz' +
               '0123456789');
  let objectId = '';
  let bytes = crypto.randomBytes(size);
  for (let i = 0; i < bytes.length; ++i) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }
  return objectId;
}

// Returns a new random alphanumeric string suitable for object ID.
function newObjectId() {
  //TODO: increase length to better protect against collisions.
  return randomString(10);
}

// Returns a new random hex string suitable for secure tokens.
function newToken() {
  return randomHexString(32);
}

module.exports = {
  randomHexString: randomHexString,
  randomString: randomString,
  newToken: newToken,
  newObjectId: newObjectId,
  hmac: hmac
};