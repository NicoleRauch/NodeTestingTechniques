/*global describe, it */
"use strict";
var request = require('supertest');
var sinon = require('sinon').sandbox.create();

var beans = require('../../configure').get('beans');
var Member = beans.get('member');
var membersPersistence = beans.get('membersPersistence');

var testMember = new Member(
  { nickname: 'Nickinick',
    firstname: 'Peter',
    lastname: 'Miller'
  });

var app = require('../../testutil/testHelper')('membersApp').createApp();

describe('Members application (3 layers)', function () {

  beforeEach(function () {
    sinon.stub(membersPersistence, 'list', function (sortOrder, callback) {
      callback(null, [testMember]);
    });
  });

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
