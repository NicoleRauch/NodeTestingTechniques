'use strict';

process.chdir(__dirname);
var nconf = require('nconf');

function createConfiguration() {
  nconf.defaults({
    mongoHost: 'localhost',
    mongoPort: '27017',
    mongoDB: 'swk-spa'
  });
  return nconf;
}

module.exports = createConfiguration();

