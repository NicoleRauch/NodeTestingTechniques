'use strict';

var _ = require('lodash');
var express = require('express');
var path = require('path');

module.exports = {
  toObjectList: function (Constructor, callback, err, jsobjects) {
    if (err) { return callback(err); }
    callback(null, _.map(jsobjects, function (each) { return new Constructor(each); }));
  },

  expressAppIn: function (directory) {
    var app = express();
    app.set('views', path.join(directory, 'views'));
    app.set('view engine', 'jade');
    return app;
  }
};

