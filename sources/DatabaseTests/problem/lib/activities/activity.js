'use strict';

var moment = require('moment-timezone');
var _ = require('lodash');

var beans = require('nconf').get('beans');

var standardName = 'Veranstaltung';

function Activity(object) {
  if (object) {
    this.state = object;
  } else {
    this.state = {};
  }
  return this;
}

Activity.standardName = standardName;

Activity.prototype.id = function () {
  return this.state.id;
};

Activity.prototype.url = function () {
  return this.state.url ? this.state.url.trim() : undefined;
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

Activity.prototype.direction = function () {
  return this.state.direction;
};

Activity.prototype.startUnix = function () {
  return this.state.startUnix || moment().unix();
};

Activity.prototype.endUnix = function () {
  return this.state.endUnix || moment().add(2, 'hours').unix();
};

Activity.prototype.assignedGroup = function () {
  return this.state.assignedGroup;
};

Activity.prototype.owner = function () {
  return this.state.owner;
};

// display Markdown
Activity.prototype.descriptionHTML = function () {
  return this.description();
};

Activity.prototype.descriptionPlain = function () {
  return this.descriptionHTML().replace(/<(?:\S|\s)*?>/gm, '');
};

Activity.prototype.hasDirection = function () {
  var isFilled = function (someValue) {
    return someValue !== undefined && someValue !== null && someValue !== 'undefined' &&
      (typeof someValue === 'string' ? someValue.trim().length > 0 : true);
  };

  return isFilled(this.direction());
};

Activity.prototype.directionHTML = function () {
  return this.direction();
};

Activity.prototype.groupName = function () {
  return this.group ? this.group.longName : '';
};

Activity.prototype.groupFrom = function (groups) {
  this.group = _.find(groups, {id: this.assignedGroup()});
};


// Display Dates and Times

Activity.prototype.isMultiDay = function () {
  return this.endMoment().dayOfYear() !== this.startMoment().dayOfYear();
};

Activity.prototype.startMoment = function () {
  return moment.unix(this.startUnix()).tz('Europe/Berlin');
};

Activity.prototype.endMoment = function () {
  return moment.unix(this.endUnix()).tz('Europe/Berlin');
};

Activity.prototype.month = function () {
  return this.startMoment().month();
};

Activity.prototype.year = function () {
  return this.startMoment().year();
};

module.exports = Activity;
