'use strict';

var beans = require('nconf').get('beans');
var activitystore = beans.get('activitystore');
var CONFLICTING_VERSIONS = beans.get('constants').CONFLICTING_VERSIONS;

module.exports = {
  getActivitiesForDisplay: function (activitiesFetcher, callback) {
    activitiesFetcher(callback);
  },

  isValidUrl: function (reservedURLs, url, callback) {
    var isReserved = new RegExp(reservedURLs, 'i').test(url);
    if (isReserved) { return callback(null, false); }
    activitystore.getActivity(url, function (err, result) {
      if (err) { return callback(err); }
      callback(null, result === null);
    });
  },

  addVisitorTo: function (memberId, activityUrl, resourceName, moment, callback) {
    var self = this;
    activitystore.getActivity(activityUrl, function (err, activity) {
      if (err || !activity) { return callback(err); }
      var resource = activity.resourceNamed(resourceName);
      resource.addMemberId(memberId, moment);
      return activitystore.saveActivity(activity, function (err) {
        if (err && err.message === CONFLICTING_VERSIONS) {
          // we try again because of a racing condition during save:
          return self.addVisitorTo(memberId, activityUrl, resourceName, moment, callback);
        }
        return callback(err);
      });
    });
  },

  removeVisitorFrom: function (memberId, activityUrl, resourceName, callback) {
    var self = this;
    activitystore.getActivity(activityUrl, function (err, activity) {
      if (err) {return callback(err); }
      activity.resourceNamed(resourceName).removeMemberId(memberId);
      activitystore.saveActivity(activity, function (err) {
        if (err && err.message === CONFLICTING_VERSIONS) {
          // we try again because of a racing condition during save:
          return self.removeVisitorFrom(memberId, activityUrl, resourceName, callback);
        }
        return callback(err);
      });
    });
  }
};
