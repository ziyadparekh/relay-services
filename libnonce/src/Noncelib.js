'use strict';

// This Class Handles Creation and Validation of Single Time
// Use Nonce keys. Nonces are Time Sensitive and have an Expiry
// Date that can be configured by passing in a `nonceDuration`
// param to the constructor. Nonces are secured using hashes 
// The Created Nonces are Stored in Redis until they are verified
// at which point they are discarded. Nonces stored in Redis
// also have an expiry time to automatically discard themselves
// incase the nonce is not redeemed at any point

var CoreError = require('libutil').Errors;
var mkDeferred = require("../helpers/deferred");
var crypto = require("crypto");
var LibRedis = require('libredis');

class Noncelib {
  /**
   * Instantiate the Noncelib instance by
   * passing it a hash of params
   * args.nonceSecret is required
   * args.nonceDuration is required
   * args.payload is optional
   * @param  {Object} args hash
   * @return {this}
   */
  constructor(args) {
    if (args.nonceSecret) {
      this.secret = args.nonceSecret;
    }

    if (args.nonceDuration) {
      this.duration = args.nonceDuration;
    }
    if (!this.duration ||
        !this.secret ||
        typeof(this.secret) !== 'string' ||
        typeof(this.duration) !== 'number')
    {
      throw new CoreError(CoreError.INVALID_QUERY,
                          "Invalid arguments to constructor");
    }

    if (args.payload) {
      this.payload = args.payload;
    }
  }

  execute() {
    var def = mkDeferred();

    this.create().then((nonce) => {
      return this.objectify(nonce, true);
    }).then(() => {
      return this.storeNonce();
    }).then(() => {
      return this.setExpiry();
    }).then(() => {
      def.resolve(this.nonce);
    }).catch((err) => {
      def.reject(err);
    });

    return def.getPromise();
  }

  verify(nonceString) {
    var def = mkDeferred(); 

    this.validate(nonceString).then(() => {
      return this.fetch(nonceString);
    }).then((response) => {
      if (response) this.result = response;
      return this.discard(nonceString);
    }).then(() => {
      if (!this.result) {
        throw new CoreError(CoreError.NONCE_USED,
                    "This nonce has already been redeemed");
      } else {
        def.resolve({ 
          payload: this.result
        });
      }
    }).catch((err) => {
      def.reject(err);
    });

    return def.getPromise();
  }

  fetch(nonce) {
    return LibRedis.get(nonce);
  }

  discard(nonce) {
    return LibRedis.remove(nonce);
  }

  validate(nonce) {
    var def = mkDeferred();
    var components = nonce.split(",");
    if (components.length !== 3) {
      def.reject(new CoreError(CoreError.NONCE_INVALID,
                      "Hash Mismatch"));
    } else {
      var salt = components[0];
      var maxTime = components[1];
      var hash = components[2];
      var time = (Math.floor(Date.now() / 1000));
      var calcHash = this.hmac(salt, this.secret, maxTime);
      if (hash !== calcHash) {
        def.reject(new CoreError(CoreError.NONCE_INVALID,
                      "Hash Mismatch"));
      } else if (time > maxTime) {
        def.reject(new CoreError(CoreError.NONCE_EXPIRED,
                      "Nonce Expired"));
      } else {
        def.resolve();
      }
    }
    return def.getPromise();
  }

  setExpiry() {
    if (!this.payload) {
      return Promise.resolve();
    }
    var key = this.nonce.nonce;
    var time = (Math.floor(Date.now() / 1000));
    var maxTime = time + this.duration;
    
    return LibRedis.setExpires(key, maxTime);
  }

  storeNonce() {
    if (!this.payload) {
      return Promise.resolve();
    }
    var key = this.nonce.nonce;
    return LibRedis.set(key, this.payload);
  }

  create() {
    var def = mkDeferred();
    
    var salt = this.salt(10);
    var time = (Math.floor(Date.now() / 1000));
    var maxTime = time + this.duration;
    var hash = this.hmac(salt, this.secret, maxTime);
    var nonce = salt + ',' + maxTime + ',' + hash;
    
    def.resolve(nonce);
    return def.getPromise();
  }

  objectify(nonce, status) {
    this.nonce = {
      nonce: nonce.toString('hex'),
      status: status
    }
  }

  salt(length) {
    return crypto.randomBytes(length).toString('base64');
  }

  hmac(salt, secret, maxTime) {
    var hmac = crypto.createHmac('sha512', secret);
    hmac.update(salt + maxTime + secret);
    return hmac.digest('hex');
  }
}

module.exports = Noncelib;