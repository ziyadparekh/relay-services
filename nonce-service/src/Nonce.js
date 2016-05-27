"use strict";

var NonceLib = require("../lib/Nonce"),
    Encryptor = require("libencrypt"),
    config = {
      passphrase: new Buffer('so long and thanks for all the fish', "utf8"),
      privKeyPath: './keys/privatekey.txt',
      pubKeyPath: './keys/publickey.txt'
    };
    Nonce = {};


Nonce.create = function (req, res) {
  NonceLib.create().then(function (payload) {
    return res.status(200).json(payload);
  }).catch(function (err) {
    return res.status(500).json({err: err});
  });
};

Nonce.verify = function (req, res) {
  var nonce = req.body.nonce;
  var signature = req.body.signature;
  if (!nonce) {
    return res.status(403).json({err: "Please Provide a Nonce"});
  }
  if (!signature) {
    return res.status(403).json({err: "Fuck off"});
  }

  NonceLib.verify(nonce).then(function (payload) {
    return res.status(200).json(payload);
  }).catch(function (err) {
    return res.status(500).json(err);
  });
};

// Verification process:
// 
// Nonce Encryptor will be passed a full config
var nonceEncryptor = new Encryptor(nonce_config);
// Core Encryptor will be passed partial config
var coreEncrytpor = new Encryptor(core_config);
// Flow
var encryptedMsg = req.body.payload;
nonceEncryptor.loadKeyManager().then((km) => {
  return nonceEncryptor.unlockKeyManager(km);
}).then((km) => {
  this.nonceKM = km;
  return coreEncrytpor.loadKeyManager();
}).then((km) => {
  this.coreKM = km;
  return nonceEncryptor.decrypt(encryptedMsg, this.nonceKM, this.coreKM);
}).then((decrypted) => {
  return NonceLib.verify(decrypted);
}).then((payload) => {
  return res.status(200).json(payload);
}).catch((err) {
  return res.status(500).json(err);
});




module.exports = Nonce;