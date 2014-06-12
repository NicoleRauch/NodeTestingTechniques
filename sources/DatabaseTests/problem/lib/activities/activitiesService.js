'use strict';

var async = require('async');
var _ = require('lodash');

var conf = require('nconf');
var beans = conf.get('beans');

var activitystore = beans.get('activitystore');

module.exports = {
  getActivitiesForDisplay: function (activitiesFetcher, callback) {
    async.parallel(
      {
        activities: activitiesFetcher
      },

      function (err, results) {
        if (err) { callback(err); }
        callback(null, results.activities);
      }
    );
  }

};
