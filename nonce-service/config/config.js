"use strict";

var fs = require("fs");
var Keys = require('libutil').Keys; 

module.exports = {
	ssl: {
		key: fs.readFileSync(__dirname + '/../cert/file.pem', 'utf8'),
		cert: fs.readFileSync(__dirname + '/../cert/file.crt', 'utf8'),
		requestCert: false,
		rejectUnauthorized: true
	},
    encrypt: {
        pubKeyPath: Keys.paymentPublic,
        privKeyPath: __dirname + '/../keys/private.txt',
        passphrase: 'this is for the nonce service'
    },
    core: {
        pubKeyPath: Keys.corePublic
    },
    db: {
        DB_HOST: "localhost",
        DB_USER: "root",
        DB_PASSWORD: "",
        DB_PORT: 3306,
        DB_DB: "nonce_db",
        DB_CHARSET: "UTF8MB4_GENERAL_CI",
        DB_CONNECTION_LIMIT: 10,
        DB_QUEUE_LIMIT: 0,
    },
	httpPort: 8000,
	httpsPort: 3000,
    nonceSecret: "dune$#9875fifty6gui45",
    nonceDuration: 100
};