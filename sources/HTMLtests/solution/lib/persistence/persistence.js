'use strict';
var conf = require('nconf');
var async = require('async');
var ourDB;

var DBSTATE = { OPEN: 'OPEN', CLOSED: 'CLOSED', OPENING: 'OPENING' };
var ourDBConnectionState = DBSTATE.CLOSED;

module.exports = function (collectionName) {
  var persistence;

  function performInDB(callback) {
    if (ourDBConnectionState === DBSTATE.OPEN) {
      return callback(null, ourDB);
    }
    persistence.openDB();
    setTimeout(function () {performInDB(callback); }, 5);
  }

  persistence = {
    list: function (sortOrder, callback) {
      this.listByField({}, sortOrder, callback);
    },

    listByIds: function (list, sortOrder, callback) {
      this.listByField({ 'id': { $in: list } }, sortOrder, callback);
    },

    listByField: function (searchObject, sortOrder, callback) {
      this.listByFieldWithOptions(searchObject, {}, sortOrder, callback);
    },

    listByFieldWithOptions: function (searchObject, options, sortOrder, callback) {
      performInDB(function (err, db) {
        if (err) { return callback(err); }
        db.collection(collectionName).find(searchObject, options).sort(sortOrder).toArray(function (err, result) {
          if (err) { return callback(err); }
          callback(null, result);
        });
      });
    },

    getById: function (id, callback) {
      this.getByField({id: id}, callback);
    },

    getByField: function (fieldAsObject, callback) {
      performInDB(function (err, db) {
        if (err) { return callback(err); }
        db.collection(collectionName).find(fieldAsObject).toArray(function (err, result) {
          if (err) { return callback(err); }
          callback(null, result[0]);
        });
      });
    },

    mapReduce: function (map, reduce, options, callback) {
      performInDB(function (err, db) {
        if (err) { return callback(err); }
        db.collection(collectionName).mapReduce(map, reduce, options, callback);
      });
    },

    save: function (object, callback) {
      this.update(object, object.id, callback);
    },

    update: function (object, storedId, callback) {
      if (object.id === null || object.id === undefined) {
        return callback(new Error('Given object has no valid id'));
      }
      performInDB(function (err, db) {
        if (err) { return callback(err); }
        var collection = db.collection(collectionName);
        collection.update({id: storedId}, object, {upsert: true}, function (err) {
          if (err) { return callback(err); }
          callback(null);
        });
      });
    },

    saveAll: function (objects, outerCallback) {
      var self = this;
      async.each(objects, function (each, callback) { self.save(each, callback); }, outerCallback);
    },

    drop: function (callback) {
      performInDB(function (err, db) {
        if (err) { return callback(err); }
        db.dropCollection(collectionName, function (err) {
          callback(err);
        });
      });
    },

    openDB: function () {
      if (ourDBConnectionState !== DBSTATE.CLOSED) {
        return;
      }

      ourDBConnectionState = DBSTATE.OPENING;
      var Db = require('mongodb').Db;
      var Server = require('mongodb').Server;

      var host = conf.get('mongoHost');
      var port = parseInt(conf.get('mongoPort'), 10);
      var user = conf.get('mongoUser');
      var pass = conf.get('mongoPass');

      var theDB = new Db(conf.get('mongoDB'), new Server(host, port), {w: 1, safe: false});
      theDB.open(function (err, db) {
        if (err) { return; }
        if (user) {
          return db.authenticate(user, pass, function (err) {
            if (err) { return; }
            ourDB = db;
            ourDBConnectionState = DBSTATE.OPEN;
          });
        }
        ourDB = db;
        ourDBConnectionState = DBSTATE.OPEN;
      });
    },

    closeDB: function () {
      if (ourDBConnectionState === DBSTATE.CLOSED) {
        return;
      }
      performInDB(function () {
        ourDB.close();
        ourDB = undefined;
        ourDBConnectionState = DBSTATE.CLOSED;
      });
    }
  };

  persistence.openDB();
  return persistence;
};
