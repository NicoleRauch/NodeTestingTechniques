"use strict";

var store = require('./memberstore');

module.exports = {

  allMembers: function (callback) {
    store.allMembers(callback);
  }

};

