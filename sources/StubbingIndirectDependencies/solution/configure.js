"use strict";

process.chdir(__dirname);
var nconf = require('nconf');

function createConfiguration() {
// create an nconf object, and initialize it with given values from
// the environment variables and/or from the command line
  nconf.argv().env();
  nconf.defaults({
    mongoHost: 'localhost',
    mongoPort: '27017'
  });

  return nconf;
}
module.exports = createConfiguration;

