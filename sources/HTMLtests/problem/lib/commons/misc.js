'use strict';

var _ = require('lodash');
var express = require('express');
var path = require('path');

function asWholeWordEscaped(string) {
  return '^' + string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '$';
}

module.exports = {
  toObject: function (Constructor, callback, err, jsobject) {
    if (err) {return callback(err); }
    if (jsobject) { return callback(null, new Constructor(jsobject)); }
    callback(null, null);
  },

  toObjectList: function (Constructor, callback, err, jsobjects) {
    if (err) { return callback(err); }
    callback(null, _.map(jsobjects, function (each) { return new Constructor(each); }));
  },

  toLowerCaseRegExp: function (string) {
    return new RegExp(asWholeWordEscaped(string), 'i');
  },

  arrayToLowerCaseRegExp: function (stringsArray) {
    var escapedStrings = _.chain(stringsArray).compact().map(function (string) { return asWholeWordEscaped(string); }).value();
    return new RegExp(escapedStrings.join('|'), 'i');
  },

  expressAppIn: function (directory) {
    var app = express();
    app.set('views', path.join(directory, 'views'));
    app.set('view engine', 'jade');
    return app;
  }

};

