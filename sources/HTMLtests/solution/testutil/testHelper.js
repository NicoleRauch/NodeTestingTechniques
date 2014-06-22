'use strict';

var express = require('express');
var userStub = require('./userStub');
var i18n = require('i18next');
var jade = require('jade');

module.exports = function (internalAppName) {
  var appName = internalAppName;
  var beans = require('./configureForTest').get('beans');

  i18n.init({
    supportedLngs: ['de', 'en'],
    preload: ['de', 'en'],
    fallbackLng: 'de',
    resGetPath: 'locales/__ns__-__lng__.json'
  });

  return {
    createApp: function (memberID) {
      var app = express();
      app.locals.pretty = true;
      app.enable('view cache');
      app.use(i18n.handle);

      if (memberID) {
        var Member = beans.get('member');
        app.use(userStub({member: new Member({id: memberID})}));
      }
      app.use(beans.get('accessrights'));
      app.use(beans.get('expressViewHelper'));
      app.use('/', beans.get(appName));

      i18n.registerAppHelper(app);
      i18n.addPostProcessor('jade', function (val, key, opts) {
        return jade.compile(val, opts)();
      });
      return app;
    }
  };
};

