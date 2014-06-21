'use strict';

var beans = require('nconf').get('beans');
var activitystore = beans.get('activitystore');

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
  }

};
