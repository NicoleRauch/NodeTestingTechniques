'use strict';

var express = require('express');
var http = require('http');

var members = require('./lib/members');

module.exports = {
  start: function () {
    var app = express();
    var port = 17999;
    
    app.set('view engine', 'jade');
    app.get('/', function (req, res) {
      res.redirect('/members/');
    });
    app.use('/members/', members);

    var server = http.createServer(app);
    server.listen(port, function () {
      console.log('Server running at port ' + port);
    });
  }
};
