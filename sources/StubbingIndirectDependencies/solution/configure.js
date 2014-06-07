"use strict";
var Beans = require('CoolBeans');

process.chdir(__dirname);
var nconf = require('nconf');

function createConfiguration() {
// create an nconf object, and initialize it with given values from
// the environment variables and/or from the command line
  nconf.argv().env();
  nconf.file('dummy', './config/dummy.json'); // to make the defaults read/write *wtf*
  nconf.defaults({
    mongoHost: 'localhost',
    mongoPort: '27017',
    beans: new Beans('./config/beans.json')
  });

  return nconf;
}
module.exports = createConfiguration();

