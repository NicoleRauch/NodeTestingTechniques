'use strict';

var express = require('express');

module.exports = function (modulename) {

  return {
    createApp: function () {
      var app = express();
      app.enable('view cache');
      app.use('/', require(modulename));
      return app;
    }
  };
};

