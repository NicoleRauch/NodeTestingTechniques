'use strict';

require('./configure');
var express = require('express');
var http = require('http');

var members = require('nconf').get('beans').get('membersApp');

var app = express();
var port = 17999;

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.redirect('/members/');
});
app.use('/members/', members);

this.server = http.createServer(app);
this.server.listen(port, function () {
  console.log('Server running at port ' + port);
});
