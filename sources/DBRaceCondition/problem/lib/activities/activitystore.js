/*global emit */
'use strict';

var beans = require('nconf').get('beans');
var _ = require('lodash');
var misc = beans.get('misc');
var moment = require('moment-timezone');

var persistence = beans.get('activitiesPersistence');
var Activity = beans.get('activity');

var toActivity = _.partial(misc.toObject, Activity);
var toActivityList = _.partial(misc.toObjectList, Activity);

module.exports = {
  allActivities: function (callback) {
    persistence.list({startUnix: 1}, _.partial(toActivityList, callback));
  },

  getActivity: function (url, callback) {
    persistence.getByField({url: url}, _.partial(toActivity, callback));
  },

  saveActivity: function (activity, callback) {
    persistence.save(activity.state, callback);
  }

};
