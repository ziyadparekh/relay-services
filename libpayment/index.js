// Payment Services - PCI DSS compatible express router for Payment Relay services
var bodyParser = require('body-parser'),
  express = require('express'),
  middlewares = require('./src/middlewares'),
  PromiseRouter = require('libutil').PromiseRouter,
  Cache = require('libutil').Cache,
  Config = require('./src/Config');

function PaymentService(args) {

  var api = express();

  var config = new Config(args);

  Cache.setConfig(config);

  api.use(bodyParser.urlencoded({ extended: false }))
  api.use(bodyParser.json({ 'type': '*/*' }));
  api.use(middlewares.allowCrossDomain);
  api.use(middlewares.allowMethodOverride);

  var router = new PromiseRouter();
  router.merge(require('./src/Routes'));

  router.mountOnto(api);

  api.use(middlewares.handlePaymentErrors);

  return api;
}

module.exports = {
  PaymentService: PaymentService
};
