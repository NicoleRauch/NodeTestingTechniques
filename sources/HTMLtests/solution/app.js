'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var favicon = require('static-favicon');
var bodyparser = require('body-parser');
var compress = require('compression');
var serveStatic = require('serve-static');
var i18n = require('i18next');
var jade = require('jade');

function useApp(parent, url, child) {
  function ensureRequestedUrlEndsWithSlash(req, res, next) {
    if (!(/\/$/).test(req.url)) { return res.redirect(req.url + '/'); }
    next();
  }

  if (process.env.NODE_ENV !== 'production') {
    child.locals.pretty = true;
  }
  parent.get('/' + url, ensureRequestedUrlEndsWithSlash);
  parent.use('/' + url + '/', child);
  return child;
}

var conf = require('nconf');
var beans = conf.get('beans');

// initialize i18n
i18n.init({
  ignoreRoutes: ['clientscripts/', 'fonts/', 'images/', 'img/', 'stylesheets/'],
  supportedLngs: ['de', 'en'],
  preload: ['de', 'en'],
  fallbackLng: 'de',
  resGetPath: 'locales/__ns__-__lng__.json'
});

module.exports = {
  create: function () {
    var app = express();
    app.set('view engine', 'jade');
    app.set('views', path.join(__dirname, 'views'));
    app.use(favicon(path.join(__dirname, 'public/img/Softwerkskammer16x16.ico')));
    app.use(cookieParser());
    app.use(bodyparser.urlencoded());
    app.use(compress());
    app.use(serveStatic(path.join(__dirname, 'public')));

    app.use(beans.get('expressSessionConfigurator'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(i18n.handle);
    app.use(beans.get('accessrights'));
    app.use(beans.get('secureByLogin'));
    app.use(beans.get('secureSuperuserOnly'));
    app.use(beans.get('expressViewHelper'));
    app.use(beans.get('redirectRuleForNewUser'));

    app.use('/', beans.get('siteApp'));
    useApp(app, 'members', beans.get('membersApp'));
    useApp(app, 'auth', beans.get('authenticationApp'));

    i18n.registerAppHelper(app);
    i18n.addPostProcessor('jade', function (val, key, opts) {
      return jade.compile(val, opts)();
    });

    return app;
  },

  start: function () {
    var port = conf.get('port');
    var app = this.create();

    this.server = http.createServer(app);
    this.server.listen(port, function () {
      console.log('Server running at port ' + port + ' in ' + process.env.NODE_ENV + ' MODE');
    });
  }

};
