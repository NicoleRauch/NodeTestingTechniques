'use strict';

var moment = require('moment-timezone');

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

Activity.prototype.startUnix = function () {
  return this.state.startUnix || moment().unix();
};

Activity.prototype.startMoment = function () {
  return moment.unix(this.startUnix()).tz('Europe/Berlin');
};

Activity.prototype.url = function () {
  return this.state.url ? this.state.url.trim() : undefined;
};

module.exports = Activity;
