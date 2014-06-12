'use strict';

var moment = require('moment-timezone');
var _ = require('lodash');

var conf = require('nconf');
var beans = conf.get('beans');
var misc = beans.get('misc');
var activitiesService = beans.get('activitiesService');
var groupsService = beans.get('groupsService');
var activitystore = beans.get('activitystore');

var statusmessage = beans.get('statusmessage');

var app = misc.expressAppIn(__dirname);

function activitiesForDisplay(activitiesFetcher, next, res, title) {
  return activitiesService.getActivitiesForDisplay(activitiesFetcher, function (err, activities) {
    if (err) { next(err); }
    res.render('index', { activities: activities, range: title, webcalURL: conf.get('publicUrlPrefix').replace('http', 'webcal') + '/activities/ical' });
  });
}

app.get('/', function (req, res, next) {
  activitiesForDisplay(activitystore.allActivities, next, res, req.i18n.t('general.all'));
});

app.get('/upcoming', function (req, res, next) {
  activitiesForDisplay(activitystore.upcomingActivities, next, res, req.i18n.t('activities.upcoming'));
});

app.get('/past', function (req, res, next) {
  activitiesForDisplay(activitystore.pastActivities, next, res, req.i18n.t('activities.past'));
});

module.exports = app;
