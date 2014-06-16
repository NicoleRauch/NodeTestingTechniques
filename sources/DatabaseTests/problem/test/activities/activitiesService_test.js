'use strict';

var sinon = require('sinon').sandbox.create();
var expect = require('must');
var _ = require('lodash');

var beans = require('../../testutil/configureForTest').get('beans');

var activitiesService = beans.get('activitiesService');
var activitystore = beans.get('activitystore');

var Activity = beans.get('activity');

var dummyActivity = new Activity({title: 'Title of the Activity', description: 'description', assignedGroup: 'assignedGroup',
  location: 'location', direction: 'direction', startDate: '01.01.2013', url: 'urlOfTheActivity', color: 'aus Gruppe' });

describe('Activities Service', function () {

  beforeEach(function () {
    sinon.stub(activitystore, 'allActivities', function (callback) {callback(null, [dummyActivity]); });
  });

  afterEach(function () {
    sinon.restore();
  });

  it('returns all activities', function (done) {
    activitiesService.getActivitiesForDisplay(activitystore.allActivities, function (err, activities) {
      expect(activities.length).to.equal(1);
      var activity = activities[0];
      expect(activity.title()).to.equal('Title of the Activity');
      done(err);
    });
  });

});
