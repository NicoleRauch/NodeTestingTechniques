"use strict";

var path = require('path');
var api = require('./membersAPI');

module.exports = function () {
  return {
    create: function (app) {
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'jade');


      app.get('/', function (req, res, next) {
        api.allMembers(function (err, members) {
          if (err) { return next(err); }
          res.render('index', { members: members });
        });
      });

      return app;
    }
  };
};
