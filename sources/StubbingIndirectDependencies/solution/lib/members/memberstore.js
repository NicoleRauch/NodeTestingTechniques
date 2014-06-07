"use strict";

var async = require('async');

var beans = require('nconf').get('beans');
var persistence = beans.get('membersPersistence');
var Member = beans.get('member');

var toMemberList = function (callback, err, result) {
  if (err) { return callback(err); }
  async.map(result, function (each, cb) { cb(null, new Member(each)); }, callback);
};

module.exports = {
  allMembers: function (callback) {
    persistence.list({lastname: 1, firstname: 1}, async.apply(toMemberList, callback));
  }
};


