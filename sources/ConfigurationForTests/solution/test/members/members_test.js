'use strict';
var request = require('supertest');

require('../../testutil/configureForTest');

var app = require('../../testutil/testHelper')('../lib/members').createApp();

describe('Members application', function () {

  it('lists all members', function (done) {

    request(app)
      .get('/')
      .expect(200)
      .expect(/Members Overview/)
      .expect(/Bobby Charlton \(Bobby\) is a SUPERUSER/, done);

  });
});
