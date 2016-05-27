// These methods handle the 'payment' routes.
// Methods of the form 'handleX' return promises and are intended to
// be used with the PromiseRouter.

var CoreError = require('libutil').Errors,
    Write = require('./Write');
    PromiseRouter = require('libutil').PromiseRouter;

var router = new PromiseRouter();

function handleTokenize(req) {
  var write = new Write(req.body, '_Card');
  return write.create();
}

function handleAuthorize(req) {
  var write = new Write(req.body, '_Card');
  return write.authorize();
}

// Returns a promise for a {status, response, location} object.
function handleCreate(req) {
  
};

function handleVerify(req) {
  
}

function handleStatus(req) {

}

router.route('POST', '/payment/tokenize', handleTokenize);
router.route('POST', '/payment/authorize', handleAuthorize);

module.exports = router;