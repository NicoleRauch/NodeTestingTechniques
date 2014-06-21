'use strict';

var moment = require('moment-timezone');
var _ = require('lodash');

var conf = require('nconf');
var beans = conf.get('beans');
var misc = beans.get('misc');
var activitiesService = beans.get('activitiesService');
var activitystore = beans.get('activitystore');
var resourceRegistrationRenderer = beans.get('resourceRegistrationRenderer');

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

app.get('/:url', function (req, res, next) {
  activitystore.getActivity(req.params.url, function (err, activity) {
    var canEditAddon = false;
    var addonAlreadyFilled = false;
    var hasToBePaid = false;
    var paymentAlreadyDone = false;
    if (err || !activity) { return next(err); }
    if (req.user) {
      var memberID = req.user.member.id();
      addonAlreadyFilled = validation.isValidForAddon(activity.addonForMember(memberID).state, activity.addonConfig()).length === 0;
      canEditAddon = activity.hasAddonConfig() && _.find(activity.participants, function (participant) {
        return participant.id() === memberID;
      });
      hasToBePaid = canEditAddon && !!activity.addonConfig().deposit();
      paymentAlreadyDone = activity.addonForMember(memberID).paymentDone();
    }

    res.render('get', { activity: activity, resourceRegistrationRenderer: resourceRegistrationRenderer,
      canEditAddon: canEditAddon, addonAlreadyFilled: addonAlreadyFilled,
      hasToBePaid: hasToBePaid, paymentAlreadyDone: paymentAlreadyDone});
  });
});

app.get('/edit/:url', function (req, res, next) {
  activitystore.getActivity(req.params.url, function (err, activity) {
    if (err || activity === null) { return next(err); }
    res.render('edit', { activity: activity });
  });
});

module.exports = app;
