var express = require('express');
var jade = require('jade');
var path = require('path');
var serveStatic = require('serve-static');

var app = express();

app.set('view engine', 'jade');
app.use(serveStatic('public'));

app.get('/', function (req, res) {
  res.render('index', {val: {bool: true}});  
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
