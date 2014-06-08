"use strict";

var express = require('express');
var path = require('path');
var service = require('./membersService');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.get('/', function (req, res, next) {
  service.allMembers(function (err, members) {
    if (err) { return next(err); }
    res.render('index', { members: members });
  });
});

module.exports = app;
