'use strict';

// This file contains helpers for running operations in REST format.
// The goal is that handlers that explicitly handle an express route
// should just be shallow wrapers around things in this file, but 
// these functions should not explicitly depend on the request
// object.
// This means that one of these handlers can support multiple
// routes. That's useful for the routes that do similar
// things.
var deepcopy = require('deepcopy');
var CoreError = require('libutil').Errors;
var Encryptor = require('libencrypt');
var Payments = require('./Payments');
var Cache = require('libutil').Cache;
var cryptoUtils = require('libutil').cryptoUtils;

function Write(restObject, className) {
  if (!restObject.payload) {
    throw new CoreError(CoreError.OBJECT_NOT_FOUND,
                        'Missing required payload');
  }
  this.config = Cache.getConfig();
  this.restObject = deepcopy(restObject);
  this.className = className;
  // Full config encryptor for paymentEncryptor to decrypt
  // payload
  this.paymentEncryptor = new Encryptor(this.config.encrypt);
  // Partial config encryptor with only public key to
  // verify that the request came from Core Service
  this.coreEncryptor = new Encryptor(this.config.core);
  // Placeholder for Payment KeyManager we will use
  // for encrypting and decrypting payment data
  this.paymentKM;
  // The timestamp we'll use for this whole operation
  this.updatedAt = (new Date()).toJSON();
};

Write.prototype.authorize = function() {
  return Promise.resolve().then(() => {
    // Load and unlock KeyMangers for both instances
    // and decrypt the payload into a token object
    // that can be used to retrieve the encrypted
    // card object from the database
    return this.loadAndDecrypt();
  }).then((blob) => {
    return this.parseDecrypted(blob);
  }).then((decrypted) => {
    this.data = decrypted;
    let query = {
      objectId: this.data.objectId,
      token: this.data.token
    };
    return this.runQueryOperation(query);
  }).then((result) => {
    return this.paymentEncryptor.decrypt(result.data,
                          this.paymentKM, this.paymentKM);
  }).then((blob) => {
    return this.parseDecrypted(blob);
  }).then((decrypted) => {
    let restPayload = {
      number: decrypted.number,
      expiry: decrypted.exp_month + decrypted.exp_year,
      amount: this.data.amount
    };
    return this.authorizeAndChargeCard(restPayload);
  }).then((response) => {
    return this.response;
  }).catch((err) => {
    console.error(err.stack ? err.stack : err);
    throw new CoreError(CoreError.INTERNAL_SERVER_ERROR,
                        "Unable to authorize charge");
  });
};

Write.prototype.create = function() {
  return Promise.resolve().then(() => {
    // Load and unlock KeyManagers for both instances
    // and decrypt the payload into the card object
    return this.loadAndDecrypt();
  }).then((decrypted) => {
    return this.validate(decrypted);
  }).then((cardObject) => {
    this.data = cardObject;
    return this.setRequiredFieldsIfNeeded();
  }).then(() => {
    // Prevent duplicate cards from entering the vault
    // to keep data consistent and reduce redundancy
    // Use card hash to query database
    return this.avoidDuplicateCards(
      { hash: this.data.hash }
    );
  }).then(() => {
    return this.encryptDataForStorage();
  }).then((databaseObject) => {
    return this.runDatabaseOperation(databaseObject);
  }).then(() => {
    return this.response;
  }).catch((err) => {
    console.error(err.stack ? err.stack : err);
    throw new CoreError(CoreError.INTERNAL_SERVER_ERROR,
                        "Unable to tokenize card");
  });
};

// Loads KeyManagers for both Payment Service and
// Core Service and decrypts the restObject to 
// ensure that the payload was encrypted for our
// Payment Service and signed by our Core Service
Write.prototype.loadAndDecrypt = function() {
  return this.paymentEncryptor.loadKeyManager()
    .then((pkm) => {
      return this.paymentEncryptor.unlockKeyManager(pkm);
    }).then((pkm) => {
      this.paymentKM = pkm;
      return this.coreEncryptor.loadKeyManager();
    }).then((ckm) => {
      // Decrypt the message
      return this.paymentEncryptor.decrypt(this.restObject.payload,
                              this.paymentKM, ckm);
    });
};

Write.prototype.parseDecrypted = function(blob) {
  // Try parse the decrypted blob into
  // JSON object
  let decrypted;
  try {
    decrypted = JSON.parse(blob);
  } catch (e) {
    throw new CoreError(CoreError.CARD_INVALID, 
              'Malformed JSON');
  }
  return decrypted;
};

Write.prototype.validate = function(blob) {
  let decrypted = this.parseDecrypted(blob);
  this.payment = new Payments({
    card: decrypted.payload
  });
  if (this.payment.isCardValid()) {
    // Validate the card for correctness and 
    // format it in PCI compliant way
    return this.payment.presentCard();
  } else {
    return Promise.resolve().then(() => {
      throw new CoreError(CoreError.CARD_INVALID, 
                          'Invalid Card Attributes');
    });
  }
};

// Submits request to payment gateway to authorize and
// charge card. Currently does nothing.
// TODO: Complete implementation of this method
Write.prototype.authorizeAndChargeCard = function(payload) {
  return Promise.resolve().then(() => {
    this.response = {
      status: 201,
      response: payload
    };
  });
};

Write.prototype.encryptDataForStorage = function() {
  // Remove card cvv before encryption since it is not
  // advisable to store it
  delete this.data.cvv;
  // Encrypt the data before saving it
  let params = {
    msg: JSON.stringify(this.data),
    encrypt_for: this.paymentKM,
    sign_with: this.paymentKM
  };
  return this.paymentEncryptor.encrypt(params)
    .then((encrypted) => {
      return {
        token: this.data.token,
        hash: this.data.hash,
        objectId: this.data.objectId,
        data: encrypted
      };
    });
};

Write.prototype.setRequiredFieldsIfNeeded = function() {
  if (this.data) {
    // Calculate one-way hash
    let hash = cryptoUtils.hmac(this.config.secret, this.data.number)
    // Add default fields
    this.data.updatedAt = this.updatedAt;
    if (!this.query) {
      this.data.createdAt = this.updatedAt;
      this.data.hash = hash,
      this.data.objectId = cryptoUtils.newObjectId();
    }
  }
  return Promise.resolve();
};

Write.prototype.avoidDuplicateCards = function(query) {
  return this.config.database.find(this.className, query)
    .then((results) => {
      if (results && results.length > 0) {
        throw new CoreError(CoreError.DUPLICATE_VALUE,
                            'Duplicate value cannot be saved');
      }
      return;
    });
};

Write.prototype.runQueryOperation = function(query) {
  return this.config.database.find(this.className, query)
    .then((results) => {
      if (!results || results.length === 0) {
        throw new CoreError(CoreError.OBJECT_NOT_FOUND,
                            'Object not found.');
      }
      return results[0];
    });
};

Write.prototype.runDatabaseOperation = function(databaseObject) {
  if (this.response) {
    return;
  }
  // Run a create
  return this.config.database.create(this.className, databaseObject)
    .then(() => {
      delete this.data.number;
      delete this.data.hash;
      var resp = {
        cardObject: this.data
      };
      this.response = {
        status: 201,
        response: resp
      };
    });
};

module.exports = Write;