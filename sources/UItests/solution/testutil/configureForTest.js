'use strict';

var nconf = require('nconf');
var merge = require('utils-merge');
var Beans = require('CoolBeans');

// beans:
var productionBeans = require('../config/beans.json');
var testBeans = require('../config/testbeans.json');
merge(productionBeans, testBeans);

nconf.overrides({
  port: '17125',
  swkTrustedAppName: null,
  swkTrustedAppPwd: null,
  swkRemoteAppUser: null,
  dontUsePersistentSessions: true,
  superuser: 'superuserID',
  wikipath: '.',
  beans: new Beans(productionBeans),
  transport: null,
  'transport-options': null,
  'sender-address': null,
  publicUrlPrefix: 'http://localhost:17125',
  secret: 'secret',
  githubClientID: null,
  githubClientSecret: null,
  publicPaymentKey: null,
  secretPaymentKey: null,
  paymentBic: 'paymentBic',
  paymentIban: 'paymentIban',
  paymentReceiver: 'paymentReceiver'

});

module.exports = require('../configure');
