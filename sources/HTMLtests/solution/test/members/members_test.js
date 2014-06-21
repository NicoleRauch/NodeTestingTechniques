'use strict';

var request = require('supertest');
var sinon = require('sinon').sandbox.create();
var expect = require('must');

var beans = require('../../testutil/configureForTest').get('beans');
var Member = beans.get('member');
var memberstore = beans.get('memberstore');

var createApp = require('../../testutil/testHelper')('membersApp').createApp;

describe('Members application', function () {
  var dummymember;
  var allMembers;
  var getMember;

  beforeEach(function () {
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
    request(createApp('hada'))
      .get('/')
      .expect(200)
      .expect(/href="\/members\/hada"/)
      .expect(/Hans Dampf/, function (err) {
        expect(allMembers.calledOnce).to.be(true);
        done(err);
      });
  });

  it('shows the details of one member as retrieved from the membersstore', function (done) {
    request(createApp('hada'))
      .get('/hada')
      .expect(200)
      .expect(/http:\/\/my\.blog/, function (err) {
        expect(getMember.calledWith(dummymember.nickname())).to.be(true);
        done(err);
      });
  });

  it('allows a member to edit her own data', function (done) {
    request(createApp('memberID'))
      .get('/edit/hada')
      .expect(200)
      .expect(/Edit Profile/, done);
  });

  it('does not allow a member to edit another member\'s data', function (done) {
    request(createApp('memberID1'))
      .get('/edit/hada')
      .expect(302)
      .expect('location', /members/, done);
  });

  it('allows a superuser member to edit another member\'s data', function (done) {
    request(createApp('superuserID'))
      .get('/edit/hada')
      .expect(200)
      .expect(/Edit Profile/, done);
  });

});
