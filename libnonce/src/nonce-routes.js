// These methods handle the 'nonce' routes.
// Methods of the form 'handleX' return promises and are intended to
// be used with the PromiseRouter.

var CoreError = require('libutil').Errors,
    Nonce = require('./Nonce'),
    PromiseRouter = require('libutil').PromiseRouter;

var router = new PromiseRouter();

// Returns a promise for a {status, response, location} object.
function handleCreate(req) {
  return Nonce.create(req.body);
};

function handleVerify(req) {
  return Nonce.verify(req.body);
}

function handleStatus(req) {

}

router.route('POST', '/nonce/create', handleCreate);
router.route('POST', '/nonce/verify', handleVerify);
router.route('GET', '/status', handleStatus);

module.exports = router;