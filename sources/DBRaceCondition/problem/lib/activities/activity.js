'use strict';

var moment = require('moment-timezone');
var beans = require('nconf').get('beans');
var Resources = beans.get('resources');

function Activity(object) {
  if (object) {
    this.state = object;
  } else {
    this.state = {};
  }
  return this;
}

Activity.prototype.title = function () {
  return this.state.title;
};

Activity.prototype.description = function () {
  return this.state.description;
};

Activity.prototype.location = function () {
  return this.state.location;
};

Activity.prototype.startUnix = function () {
  return this.state.startUnix || moment().unix();
};

Activity.prototype.startMoment = function () {
  return moment.unix(this.startUnix()).tz('Europe/Berlin');
};

Activity.prototype.url = function () {
  return this.state.url ? this.state.url.trim() : undefined;
};

Activity.prototype.resources = function () {
  return new Resources(this.state.resources);
};

Activity.prototype.resourceNamed = function (resourceName) {
  return this.resources().named(resourceName);
};

Activity.prototype.resourceNames = function () {
  return this.resources().resourceNames();
};

module.exports = Activity;
