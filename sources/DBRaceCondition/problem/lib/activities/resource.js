'use strict';

var _ = require('lodash');
var moment = require('moment-timezone');

function Resource(resourceObject, resourceName) {
  this.resourceName = resourceName;
  this.state = resourceObject || {}; // this must be *the* object that is referenced by activity.resources[resourceName]
  return this;
}

Resource.prototype.fillFromUI = function (uiInputObject) {
  this.state._registrationOpen = uiInputObject.isRegistrationOpen === 'yes';
  this.state._canUnsubscribe = uiInputObject.canUnsubscribe === 'yes';
  this.state._position = uiInputObject.position;

  // adjust the limit
  var intLimit = parseInt(uiInputObject.limit, 10);
  if (intLimit >= 0) {
    this.state._limit = intLimit;
  } else {
    delete this.state._limit;
  }

  return this;
};

Resource.prototype.registeredMembers = function () {
  if (!this.state._registeredMembers) {
    this.state._registeredMembers = [];
  }
  return _.pluck(this.state._registeredMembers, 'memberId');
};

Resource.prototype.registrationDateOf = function (memberId) {
  var self = this;
  if (!self.state._registeredMembers) {
    self.state._registeredMembers = [];
  }
  var registration = _.find(self.state._registeredMembers, {'memberId': memberId});
  return registration ? moment(registration.registeredAt) : undefined;
};

Resource.prototype.addMemberId = function (memberId, momentOfRegistration) {
  if (this.isFull()) { return; }

  if (this.registeredMembers().indexOf(memberId) === -1) {
    this.state._registeredMembers.push({
      memberId: memberId,
      registeredAt: (momentOfRegistration || moment()).toDate()
    });
  }
  if (this.isFull()) { this.state._registrationOpen = false; }
};

Resource.prototype.isAlreadyRegistered = function (memberId) {
  return this.registeredMembers().indexOf(memberId) > -1;
};

Resource.prototype.removeMemberId = function (memberId) {
  if (this.canUnsubscribe()) {
    var index = this.registeredMembers().indexOf(memberId);
    if (index > -1) {
      this.state._registeredMembers.splice(index, 1);
    }
  }
};

Resource.prototype.copyFrom = function (originalResource) {
  this.state._registeredMembers = [];
  this.state._limit = originalResource.limit();
  this.state._registrationOpen = true;
  return this;
};

Resource.prototype.limit = function () {
  return this.state._limit;
};

Resource.prototype.isFull = function () {
  return (this.limit() >= 0) && (this.limit() <= this.registeredMembers().length);
};

Resource.prototype.numberOfFreeSlots = function () {
  if (this.limit() >= 0) {
    return Math.max(0, this.limit() - this.registeredMembers().length);
  }
  return 'unbegrenzt';
};

Resource.prototype.isRegistrationOpen = function () {
  return this.state._registrationOpen;
};

Resource.prototype.canUnsubscribe = function () {
  return (this.state._canUnsubscribe === undefined) || this.state._canUnsubscribe;
};

// registration states

Resource.fixed = 'fixed'; // registered and locked (no unsubscribe possible)
Resource.registered = 'registered';
Resource.registrationPossible = 'registrationPossible';
Resource.registrationElsewhere = 'registrationElsewhere';
Resource.registrationClosed = 'registrationClosed';
Resource.full = 'full';

Resource.prototype.registrationStateFor = function (memberId) {
  if (this.registeredMembers().indexOf(memberId) > -1) {
    return this.canUnsubscribe() ? Resource.registered : Resource.fixed;
  }
  if (this.isRegistrationOpen() && !this.isFull()) {
    return Resource.registrationPossible;
  }
  if (this.limit() === 0) {
    return Resource.registrationElsewhere;
  }
  if ((!this.isRegistrationOpen() && !this.limit()) || (this.limit() && this.registeredMembers().length === 0)) {
    return Resource.registrationClosed;
  }
  return Resource.full;
};

module.exports = Resource;
