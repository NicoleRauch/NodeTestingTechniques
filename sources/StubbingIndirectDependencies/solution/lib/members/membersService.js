'use strict';

var store = require('nconf').get('beans').get('memberstore');

module.exports = {

  allMembers: function (callback) {
    store.allMembers(callback);
  }

};

