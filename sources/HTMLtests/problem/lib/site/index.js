'use strict';

var beans = require('nconf').get('beans');
var misc = beans.get('misc');

var app = misc.expressAppIn(__dirname);
app.locals.pretty = true;

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/goodbye.html', function (req, res) {
  if (req.user && req.user.member) {
    res.redirect('/');
  }
  res.render('goodbye');
});

app.get('/login', function (req, res) {
  res.render('authenticationRequired');
});

app.get('/language/:isoCode', function (req, res) {
  req.session.language = req.params.isoCode;
  res.redirect(req.query.currentUrl);
});

module.exports = app;
