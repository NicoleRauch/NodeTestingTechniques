'use strict';

process.chdir(__dirname);

var nconf = require('nconf');
nconf.file('superusers', './config/superusers.json');
module.exports = nconf;

