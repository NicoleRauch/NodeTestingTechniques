'use strict';

process.chdir(__dirname);
var nconf = require('nconf');
var Beans = require('CoolBeans');

function createConfiguration() {
  nconf.argv().env();
  nconf.defaults({
    adminListName: "admins",
    port: '17124',
    mongoHost: 'localhost',
    mongoPort: '27017',
    mongoDB: 'swk-spa',
    publicUrlPrefix: 'http://localhost:17124',
    securedByLoginURLPattern: '/members',
    secret: 'secret',
    beans: new Beans('./config/beans.json')
  });

  return nconf;
}
module.exports = createConfiguration();

