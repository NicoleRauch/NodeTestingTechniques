'use strict';

var express = require('express');
var beans = require('../configure').get('beans');

module.exports = function (internalAppName) {
  return {
    createApp: function () {
      var app = express();
      app.enable('view cache');
      app.use('/', beans.get(internalAppName));
      return app;
    }
  };
};

