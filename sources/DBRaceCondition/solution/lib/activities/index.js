'use strict';

var moment = require('moment-timezone');
var _ = require('lodash');

var beans = require('nconf').get('beans');
var misc = beans.get('misc');
var activitiesService = beans.get('activitiesService');
var activitystore = beans.get('activitystore');
var resourceRegistrationRenderer = beans.get('resourceRegistrationRenderer');
var CONFLICTING_VERSIONS = beans.get('constants').CONFLICTING_VERSIONS;

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

app.post('/submit', function (req, res, next) {
  activitystore.getActivity(req.body.previousUrl, function (err, activity) {
    if (err) { return next(err); }
    if (!activity) { activity = new Activity({owner: req.user.member.id()}); }
    activity.fillFromUI(req.body);
    activitystore.saveActivity(activity, function (err) {
      if (err && err.message === CONFLICTING_VERSIONS) {
        // we try again because of a racing condition during save:
        return res.redirect('/activities/edit/' + encodeURIComponent(activity.url()));
      }
      if (err) { return next(err); }
      res.redirect('/activities/' + encodeURIComponent(activity.url()));
    });
  });
});

app.get('/subscribe/:url/:resource', function (req, res, next) {
  var resourceName = req.params.resource;
  var activityUrl = req.params.url;
  activitiesService.addVisitorTo("memberId", activityUrl, resourceName, moment(), function (err) {
    if (err) { return next(err); }
    res.redirect('/activities/' + encodeURIComponent(activityUrl));
  });
});

app.get('/unsubscribe/:url/:resource', function (req, res, next) {
  var resourceName = req.params.resource;
  var activityUrl = req.params.url;
  activitiesService.removeVisitorFrom("memberId", activityUrl, resourceName, function (err) {
    if (err) { return next(err); }
    res.redirect('/activities/' + encodeURIComponent(activityUrl));
  });
});

module.exports = app;
