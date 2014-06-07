'use strict';

module.exports = function (testBeansFilename) {

  var nconf = require('../configure');
  var merge = require('utils-merge');
  var Beans = require('CoolBeans');

  // beans:
  var productionBeans = require('../config/beans.json');
  var testBeans = require('../config/' + testBeansFilename);
  merge(productionBeans, testBeans);

  nconf.set('beans', new Beans(productionBeans));

  return nconf;

};
