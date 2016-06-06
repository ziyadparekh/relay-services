// These methods handle the 'payment' routes.
// Methods of the form 'handleX' return promises and are intended to
// be used with the PromiseRouter.

var CoreError = require('libutil').Errors,
    PromiseRouter = require('libutil').PromiseRouter;

var router = new PromiseRouter();

// Returns a promise for a {status, response, location} object.
function handleCreate(req) {
  console.log('made it here');
  return Promise.resolve();
};

function handleVerify(req) {
  console.log('made it here');
  return Promise.resolve();
}

function handleStatus(req) {

}

router.route('GET', '/hyper/create', handleCreate);
router.route('GET', '/hyper/verify', handleVerify);

module.exports = router;