// asyncHandler is a wrapper function that eliminates the need
// to write try/catch in every single controller function
//
// Instead of this in every controller:
//   async (req, res) => { try { ... } catch(err) { next(err) } }
//
// You write this:
//   asyncHandler(async (req, res) => { ... })
//
// If an error occurs, asyncHandler catches it and passes it to next()
// which triggers the central error handler middleware

const asyncHandler = (fn) => {
  return function asyncHandlerWrapper(req, res, next) {
    fn(req, res, next).catch(function(err) {
      next(err);
    });
  };
};

module.exports = asyncHandler;

