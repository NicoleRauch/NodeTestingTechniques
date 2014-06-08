'use strict';

var nconf = require('nconf');
nconf.overrides({
  superuser: ['Bobby']
});

module.exports = require('../configure');
