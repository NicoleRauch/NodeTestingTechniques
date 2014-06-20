'use strict';

module.exports = function () {
  return function (error, req, res, next) {
    if (!error) {
      return next(); // we need four method params in order to get the error message, and JSHint complains if the fourth one is not used...
    }

    var status = error.status || 500;
    res.status(status);
    if (/InternalOpenIDError|BadRequestError|InternalOAuthError/.test(error.name)) {
      return res.render('errorPages/authenticationError.jade', {error: error, status: status});
    }
    res.render('errorPages/500.jade', {error: error, status: status});
  };
};
