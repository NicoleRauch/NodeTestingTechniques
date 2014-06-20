'use strict';
var conf = require('../../testutil/configureForTest');

var request = require('supertest');
var sinonSandbox = require('sinon').sandbox.create();
var expect = require('must');
var moment = require('moment-timezone');

var beans = conf.get('beans');
var Announcement = beans.get('announcement');
var Member = beans.get('member');

var dummyAnnouncement = new Announcement({
  title: 'title',
  url: 'url',
  message: 'text',
  author: 'author',
  fromUnix: 1375056000, // 29.07.2013
  thruUnix: 1388448000 // 31.12.2013
});

var announcementstore = beans.get('announcementstore');
var memberstore = beans.get('memberstore');

var createApp = require('../../testutil/testHelper')('announcementsApp').createApp;

describe('Announcement application', function () {
  var allAnnouncementsUntilToday;
  var getAnnouncement;

  beforeEach(function () {
    sinonSandbox.stub(announcementstore, 'allAnnouncements', function (callback) {
      return callback(null, [dummyAnnouncement]);
    });
    allAnnouncementsUntilToday = sinonSandbox.stub(announcementstore, 'allAnnouncementsUntilToday', function (callback) {
      return callback(null, [dummyAnnouncement]);
    });
    getAnnouncement = sinonSandbox.stub(announcementstore, 'getAnnouncement', function (url, callback) {
      callback(null, (url === 'url') ? dummyAnnouncement : null);
    });
  });

  afterEach(function () {
    sinonSandbox.restore();
  });

  it('shows the list of announcements as retrieved from the store', function (done) {
    request(createApp())
      .get('/')
      .expect(200)
      .expect(/News/)
      .expect(/href="url"/)
      .expect(/title/, function (err) {
        expect(allAnnouncementsUntilToday.calledOnce).to.be(true);
        done(err);
      });
  });

  it('shows the details of one announcement as retrieved from the store', function (done) {
    var dummyMember = new Member({nickname: "nickname", id: "member ID"});
    sinonSandbox.stub(memberstore, 'getMemberForId', function (id, callback) {
      callback(null, dummyMember);
    });
    var url = 'url';

    request(createApp())
      .get('/' + url)
      .expect(200)
      .expect(/<small>29 July 2013/)
      .expect(/<h2>title/, function (err) {
        expect(getAnnouncement.calledWith(url)).to.be(true);
        done(err);
      });
  });

  it('shows a thruDate when editing an announcement having a thruDate for a registered member being the author', function (done) {
    dummyAnnouncement.id = 1234;
    var url = 'url';

    request(createApp('author'))
      .get('/edit/' + url)
      .expect(200)
      .expect(/<input id="thruDate" type="text" name="thruDate" value="31\/12\/2013"/)
      .expect(/<legend>Edit announcement/, function (err) {
        expect(getAnnouncement.calledWith(url)).to.be(true);
        done(err);
      });
  });

  it('shows a 404 if the url cannot be found in the store for the detail page', function (done) {
    var link = dummyAnnouncement.url + '-does-not-exist';
    request(createApp()).get('/' + link).expect(404, function (err) { done(err); });

  });

  it('allows to create a new announcement for a registered member', function (done) {
    request(createApp('somebody'))
      .get('/new')
      .expect(200)
      .expect(/announcements/, function (err) {
        done(err);
      });
  });

  it('keeps a unix timestamp, if thruDate is already a unix timestamp', function () {
    var dummyAnnouncement = new Announcement({
      title: 'title',
      url: 'url',
      message: 'text',
      author: 'author',
      fromUnix: 1388448000,
      thruUnix: 1388448000
    });
    expect(dummyAnnouncement.thruUnix).to.equal(1388448000);
  });

  it('sets fromDate to current timestamp, when a new Announcement gets created', function () {
    var dummyAnnouncement = new Announcement();
    var now = moment.utc().unix();
    expect(dummyAnnouncement.fromUnix).to.equal(now);
  });

  describe('url check', function () {

    it('returns false for checkurl when the url already exists', function (done) {
      request(createApp())
        .get('/checkurl?url=url&previousUrl=x')
        .expect(200)
        .expect(/false/, done);
    });

    it('returns true for checkurl when the url does not exist', function (done) {
      request(createApp())
        .get('/checkurl?url=UnknownURL&previousUrl=x')
        .expect(200)
        .expect(/true/, done);
    });
  });

});
