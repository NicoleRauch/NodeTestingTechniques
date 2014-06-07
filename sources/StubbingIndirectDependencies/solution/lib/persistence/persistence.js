"use strict";

module.exports = function (connectionName) {
  var conn = connectionName;
  var Db = require('mongodb').Db;
  var Server = require('mongodb').Server;

  function newDB() {
    var conf = require('nconf');
    var host = conf.get('mongoHost');
    var port = parseInt(conf.get('mongoPort'), 10);
    return new Db('swk', new Server(host, port), {safe: false});
  }

  function performInDB(callback) {
    var conf = require('nconf');
    var user = conf.get('mongoUser');
    var pass = conf.get('mongoPass');

    newDB().open(function (err, db) {
      if (user) {
        db.authenticate(user, pass, function (e) {
          if (e) {
            return callback(e);
          }
          callback(err, db);
        });
      } else {
        callback(err, db);
      }
    });
  }

  return {
    list: function (sortOrder, callback) {
      this.listByField({}, sortOrder, callback);
    },

    listByField: function (searchObject, sortOrder, callback) {
      performInDB(function (err, db) {
        if (err) {
          return callback(err);
        }
        db.collection(conn).find(searchObject).sort(sortOrder).toArray(function (error, result) {
          db.close();
          if (error) {
            return callback(error);
          }
          callback(null, result);
        });
      });
    }
  };
};
