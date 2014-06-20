'use strict';

var conf = require('nconf');

module.exports = function redirectIfNotSuperuser(req, res, next) {
  var startsWithAdministration = /^\/administration\//;
  var originalUrl = req.originalUrl;

  if (startsWithAdministration.test(originalUrl)) {
    if (!res.locals.accessrights.isSuperuser()) {
      return res.redirect('/mustBeSuperuser?page=' + encodeURIComponent(conf.get('publicUrlPrefix') + originalUrl));
    }
  }
  next();
};
