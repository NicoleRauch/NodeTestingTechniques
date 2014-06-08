'use strict';

process.chdir(__dirname);
var nconf = require('nconf');

function createConfiguration() {
  nconf.defaults({
    mongoHost: 'localhost',
    mongoPort: '27017'
  });
  return nconf;
}

module.exports = createConfiguration();

