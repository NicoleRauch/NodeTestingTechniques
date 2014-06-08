'use strict';
var request = require('supertest');
var nconf = require('../../configure');
var app = require('../../testutil/testHelper')('../lib/members').createApp();

describe('Members application', function () {

  beforeEach(function (done) {
    nconf.set('superuser', 'Bobby', function () {
      done();
    });
  });

  it('lists all members', function (done) {

    request(app)
      .get('/')
      .expect(200)
      .expect(/Members Overview/)
      .expect(/Bobby Charlton \(Bobby\) is a SUPERUSER/, done);

  });
});
