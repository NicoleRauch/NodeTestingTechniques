/*global describe, it */
"use strict";
var request = require('supertest');
var sinon = require('sinon').sandbox.create();
var proxyquire = require('proxyquire');

var Member = require('../../lib/members/member');

var testMember = new Member(
  { nickname: 'Nickinick',
    firstname: 'Peter',
    lastname: 'Miller'
  });

var membersServiceStub = {
  allMembers: function (callback) {
    callback(null, [testMember]);
  }
};

var app = proxyquire('../../lib/members', {
  './membersService': membersServiceStub
});


describe('Members application (1 layer)', function () {

  it('lists all members', function (done) {

    request(app)
      .get('/')
      .expect(200)
      .expect(/Members Overview/)
      .expect(/Peter Miller \(Nickinick\)/, done);

  });

  afterEach(function () {
    sinon.restore();
  })
});
