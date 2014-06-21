'use strict';

var moment = require('moment-timezone');

module.exports = {
  parseToUnixUsingDefaultTimezone: function (dateString, timeString) {
    var result = this.parseToMomentUsingDefaultTimezone(dateString, timeString);
    return result ? result.unix() : undefined;
  },

  parseToMomentUsingDefaultTimezone: function (dateString, timeString) {
    return this.parseToMomentUsingTimezone(dateString, timeString, this.defaultTimezone());
  },

  parseToMomentUsingTimezone: function (dateString, timeString, timezoneName) {
    if (dateString) {
      var timeStringOrDefault = timeString || '00:00';
      return moment.tz(dateString + ' ' + timeStringOrDefault, 'D.M.YYYY H:m', timezoneName);
    }
  },

  defaultTimezone: function () {
    return 'Europe/Berlin';
  }
};
