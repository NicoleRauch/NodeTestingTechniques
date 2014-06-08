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

var persistenceStub = function () {
  return {
    list: function (sortOrder, callback) {
      callback(null, [testMember]);
    }
  };
};

var memberstoreStub = proxyquire('../../lib/members/memberstore', {
  '../persistence/persistence': persistenceStub
});

var membersServiceStub = proxyquire('../../lib/members/membersService', {
  './memberstore': memberstoreStub
});

var app = proxyquire('../../lib/members', {
  './membersService': membersServiceStub
});


describe('Members application', function () {

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
