'use strict';
var Beans = require('CoolBeans');

process.chdir(__dirname);
var nconf = require('nconf');

function createConfiguration() {
  nconf.defaults({
    mongoHost: 'localhost',
    mongoPort: '27017',
    beans: new Beans('./config/beans.json')
  });
  return nconf;
}

module.exports = createConfiguration();

