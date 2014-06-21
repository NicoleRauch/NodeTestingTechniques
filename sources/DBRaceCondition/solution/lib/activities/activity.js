'use strict';

var moment = require('moment-timezone');
var beans = require('nconf').get('beans');
var fieldHelpers = beans.get('fieldHelpers');
var Resources = beans.get('resources');

function Activity(object) {
  if (object) {
    this.state = object;
  } else {
    this.state = {};
  }
  return this;
}

Activity.prototype.id = function () {
  return this.state.id;
};

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

Activity.prototype.fillFromUI = function (object) {
  var self = this;
  self.state.url = object.url;

  self.state.title = object.title;
  self.state.description = object.description;
  self.state.location = object.location;
  // currently we only support MEZ/MESZ for events
  self.state.startUnix = fieldHelpers.parseToUnixUsingDefaultTimezone(object.startDate, object.startTime);

  // these are the resource definitions in the edit page:
  if (object.resources) {
    this.resources().fillFromUI(object.resources);
  }
  return self;
};

module.exports = Activity;
