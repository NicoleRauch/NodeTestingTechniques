/*global emit */
'use strict';

var beans = require('nconf').get('beans');
var _ = require('lodash');
var misc = beans.get('misc');
var moment = require('moment-timezone');

var persistence = beans.get('activitiesPersistence');
var Activity = beans.get('activity');

var toActivityList = _.partial(misc.toObjectList, Activity);

var allActivitiesByDateRange = function (rangeFrom, rangeTo, sortOrder, callback) {
  persistence.listByField({ $and: [
    {endUnix: { $gt: rangeFrom }},
    {endUnix: { $lt: rangeTo }}
  ]}, sortOrder, _.partial(toActivityList, callback));
};

var allActivitiesByDateRangeInAscendingOrder = function (rangeFrom, rangeTo, callback) {
  allActivitiesByDateRange(rangeFrom, rangeTo, {startUnix: 1}, callback);
};

var allActivitiesByDateRangeInDescendingOrder = function (rangeFrom, rangeTo, callback) {
  allActivitiesByDateRange(rangeFrom, rangeTo, {startUnix: -1}, callback);
};


module.exports = {
  allActivities: function (callback) {
    persistence.list({startUnix: 1}, _.partial(toActivityList, callback));
  },

  allActivitiesByDateRangeInAscendingOrder: allActivitiesByDateRangeInAscendingOrder,

  allActivitiesByDateRangeInDescendingOrder: allActivitiesByDateRangeInDescendingOrder,

  upcomingActivities: function (callback) {
    var start = moment().unix();
    var end = moment().add('years', 10).unix();
    allActivitiesByDateRangeInAscendingOrder(start, end, callback);
  },

  pastActivities: function (callback) {
    var start = 0;
    var end = moment().unix();
    allActivitiesByDateRangeInDescendingOrder(start, end, callback);
  }

};
