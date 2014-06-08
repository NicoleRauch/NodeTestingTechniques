'use strict';

var nconf = require('nconf');
nconf.overrides({
  superuser: ['Charli']
});

module.exports = require('../configure');
