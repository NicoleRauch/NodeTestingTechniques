"use strict";

var persistence = require('../persistence/persistence')('memberstore');
var async = require('async');
var Member = require('./member');

var toMemberList = function (callback, err, result) {
  if (err) {
    return callback(err);
  }
  async.map(result, function (each, cb) {
    cb(null, new Member({object: each}));
  }, callback);
};

module.exports = {
  allMembers: function (callback) {
    persistence.list({lastname: 1, firstname: 1}, async.apply(toMemberList, callback));
  }
};


