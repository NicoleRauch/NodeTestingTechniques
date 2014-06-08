'use strict';

var express = require('express');
var serveStatic = require('serve-static');
var bodyparser = require('body-parser');

var app = express();

app.set('view engine', 'jade');
app.use(bodyparser.urlencoded());
app.use(serveStatic('public'));

app.get('/', function (req, res) {
  res.render('index', {val: {words: 'Hallo'}});  
});

app.post('/submit', function (req, res) {
  res.end(JSON.stringify(req.body));
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
