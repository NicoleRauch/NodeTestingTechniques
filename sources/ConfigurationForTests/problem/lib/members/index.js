'use strict';

var express = require('express');
var path = require('path');
var nconf = require('nconf');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  var members = [
    {firstname: 'Michael', lastname: 'Ballack', nickname: 'Balli'},
    {firstname: 'Karlheinz', lastname: 'Rummenigge', nickname: 'Rums'},
    {firstname: 'Bobby', lastname: 'Charlton', nickname: 'Bobby'}
  ];
  res.render('index', { members: members, superusers: nconf.get('superuser') });
});

module.exports = app;
