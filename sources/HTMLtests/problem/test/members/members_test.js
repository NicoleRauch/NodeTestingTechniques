'use strict';

var request = require('supertest');
var sinon = require('sinon').sandbox.create();
var expect = require('must');
var express = require('express');

var beans = require('../../testutil/configureForTest').get('beans');
var Member = beans.get('member');
var memberstore = beans.get('memberstore');

describe('Members application', function () {
  var app;
  var dummymember;
  var allMembers;
  var getMember;

  var t_fake = function (req, res, next) {
    res.locals.t = function (string) { return string; };
    next();
  };

  var accessrights_fake = function (req, res, next) {
    res.locals.accessrights = {
      isRegistered: function () { return true; },
      canEditMember: function (member) {
        return res.locals.user.member.isSuperuser() || member.nickname() === res.locals.user.member.nickname();
      }
    };
    next();
  };

  var member_fake = {
    nickname: function () { return 'hada'; },
    isSuperuser: function () { return false; }
  };

  var user_fake = function (req, res, next) {
    res.locals.user = {
      member: member_fake
    };
    next();
  };

  beforeEach(function () {
    app = express();
    app.use(t_fake);
    app.use(user_fake);
    app.use(accessrights_fake);
    app.use('/', beans.get('membersApp'));
    dummymember = new Member({id: 'memberID', nickname: 'hada', email: 'a@b.c', site: 'http://my.blog', firstname: 'Hans', lastname: 'Dampf', authentications: []});
    allMembers = sinon.stub(memberstore, 'allMembers', function (callback) {
      callback(null, [dummymember]);
    });
    getMember = sinon.stub(memberstore, 'getMember', function (nickname, callback) {
      callback(null, dummymember);
    });
  });

  afterEach(function () {
    sinon.restore();
  });

  it('shows the list of members as retrieved from the membersstore if the user is registered', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .expect(/href="\/members\/hada"/)
      .expect(/Hans Dampf/, function (err) {
        expect(allMembers.calledOnce).to.be(true);
        done(err);
      });
  });

  it('shows the details of one member as retrieved from the membersstore', function (done) {
    request(app)
      .get('/hada')
      .expect(200)
      .expect(/http:\/\/my\.blog/, function (err) {
        expect(getMember.calledWith(dummymember.nickname())).to.be(true);
        done(err);
      });
  });

  it('allows a member to edit her own data', function (done) {
    request(app)
      .get('/edit/hada')
      .expect(200)
      .expect(/members\.edit/, done);
  });

  it('does not allow a member to edit another member\'s data', function (done) {
    member_fake.nickname = function () { return 'another user'; };
    request(app)
      .get('/edit/hada')
      .expect(302)
      .expect('location', /members/, done);
  });

  it('allows a superuser member to edit another member\'s data', function (done) {
    member_fake.isSuperuser = function () { return true; };
    request(app)
      .get('/edit/hada')
      .expect(200)
      .expect(/members\.edit/, done);
  });

});
