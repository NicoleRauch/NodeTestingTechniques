'use strict';

process.chdir(__dirname);
var nconf = require('nconf');

function createConfiguration() {
  nconf.file('superusers', './config/superusers.json');
  nconf.defaults({
    port: '17124',
    publicUrlPrefix: 'http://localhost:17124',
    secret: 'secret',
    mongoHost: 'localhost',
    mongoPort: '27017'
  });

  return nconf;
}
module.exports = createConfiguration();

