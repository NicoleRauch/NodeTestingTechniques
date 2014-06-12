'use strict';

var moment = require('moment-timezone');
var _ = require('lodash');

var conf = require('nconf');
var beans = conf.get('beans');
var misc = beans.get('misc');
var activitiesService = beans.get('activitiesService');
var activitystore = beans.get('activitystore');

var app = misc.expressAppIn(__dirname);

function activitiesForDisplay(activitiesFetcher, next, res, title) {
  return activitiesService.getActivitiesForDisplay(activitiesFetcher, function (err, activities) {
    if (err) { next(err); }
    res.render('index', { activities: activities, range: title });
  });
}

app.get('/', function (req, res, next) {
  activitiesForDisplay(activitystore.allActivities, next, res, 'All');
});

app.get('/upcoming', function (req, res, next) {
  activitiesForDisplay(activitystore.upcomingActivities, next, res, 'Upcoming');
});

app.get('/past', function (req, res, next) {
  activitiesForDisplay(activitystore.pastActivities, next, res, 'Past');
});

module.exports = app;
