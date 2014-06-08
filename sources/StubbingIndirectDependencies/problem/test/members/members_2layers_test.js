'use strict';
var request = require('supertest');
var proxyquire = require('proxyquire');

var Member = require('../../lib/members/member');

var testMember = new Member(
  { nickname: 'Nickinick',
    firstname: 'Peter',
    lastname: 'Miller'
  });

var memberstoreStub = {
  allMembers: function (callback) {
    callback(null, [testMember]);
  }
};

var membersServiceStub = proxyquire('../../lib/members/membersService', {
  './memberstore': memberstoreStub
});

var app = proxyquire('../../lib/members', {
  './membersService': membersServiceStub
});

describe('Members application (2 layers)', function () {

  it('lists all members', function (done) {

    request(app)
      .get('/')
      .expect(200)
      .expect(/Members Overview/)
      .expect(/Peter Miller \(Nickinick\)/, done);

  });

});
