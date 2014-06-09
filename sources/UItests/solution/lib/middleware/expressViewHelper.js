'use strict';

var beans = require('nconf').get('beans');

module.exports = function expressViewHelper(req, res, next) {
  res.locals.language = 'en-gb';
  if (req.session) {
    res.locals.language = req.session.language || 'en-gb';
  }
  res.locals.user = req.user;
  res.locals.currentUrl = req.url;
  req.i18n.setLng(res.locals.language);
  next();
};
