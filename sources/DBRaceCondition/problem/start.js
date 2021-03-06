'use strict';

require('./configure');
var express = require('express');
var http = require('http');
var bodyparser = require('body-parser');

var activities = require('nconf').get('beans').get('activitiesApp');

var app = express();
var port = 17999;

app.set('view engine', 'jade');
app.use(bodyparser.urlencoded());

app.get('/', function (req, res) {
  res.redirect('/activities/');
});
app.use('/activities/', activities);

this.server = http.createServer(app);
this.server.listen(port, function () {
  console.log('Server running at port ' + port);
});
