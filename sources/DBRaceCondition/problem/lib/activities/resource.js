'use strict';

var _ = require('lodash');
var moment = require('moment-timezone');

function Resource(resourceObject, resourceName) {
  this.resourceName = resourceName;
  this.state = resourceObject || {}; // this must be *the* object that is referenced by activity.resources[resourceName]
  return this;
}

Resource.prototype.fillFromUI = function (uiInputObject) {
  this.state._position = uiInputObject.position;
  return this;
};

Resource.prototype.registeredMembers = function () {
  if (!this.state._registeredMembers) {
    this.state._registeredMembers = [];
  }
  return _.pluck(this.state._registeredMembers, 'memberId');
};

Resource.prototype.addMemberId = function (memberId, momentOfRegistration) {
  if (this.registeredMembers().indexOf(memberId) === -1) {
    this.state._registeredMembers.push({
      memberId: memberId,
      registeredAt: (momentOfRegistration || moment()).toDate()
    });
  }
};

Resource.prototype.isAlreadyRegistered = function (memberId) {
  return this.registeredMembers().indexOf(memberId) > -1;
};

Resource.prototype.removeMemberId = function (memberId) {
  var index = this.registeredMembers().indexOf(memberId);
  if (index > -1) {
    this.state._registeredMembers.splice(index, 1);
  }
};

// registration states
Resource.registered = 'registered';
Resource.registrationPossible = 'registrationPossible';

Resource.prototype.registrationStateFor = function (memberId) {
  if (this.registeredMembers().indexOf(memberId) > -1) {
    return Resource.registered;
  }
  return Resource.registrationPossible;
};

module.exports = Resource;
