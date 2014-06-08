var express = require('express');
var http = require('http');
var jade = require('jade');
var serveStatic = require('serve-static');

var members = require('./lib/members');

function useApp(parent, url, child) {
  function ensureRequestedUrlEndsWithSlash(req, res, next) {
    if (!(/\/$/).test(req.url)) { return res.redirect(req.url + '/'); }
    next();
  }

  parent.get('/' + url, ensureRequestedUrlEndsWithSlash);
  parent.use('/' + url + '/', child);
  return child;
}

module.exports = function (conf) {

  return {
    create: function () {
      var app = express();

      app.set('view engine', 'jade');
      app.use(serveStatic('public'));

      app.get('/', function (req, res) {
        res.redirect('/members/');
      });
      useApp(app, 'members', members);

      return app;
    },

    start: function (done) {
      var app = this.create();
      this.server = http.createServer(app);
      var port = 17999;
      this.server.listen(port, function () {
        console.log('Server running at port ' + port);
        if (done) { done(); }
      });
    }
  };
};
