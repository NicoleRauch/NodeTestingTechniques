'use strict';

var express = require('express');

module.exports = function (internalAppName) {
  var beans = require('./configureForTest').get('beans');

  return {
    createApp: function () {
      var app = express();
      app.enable('view cache');
      app.use('/', beans.get(internalAppName));
      return app;
    }
  };
};

