'use strict';

var conf = require('../../testutil/configureForTest');
var sinon = require('sinon');
var expect = require('must');

var beans = conf.get('beans');
var secureSuperuserOnly = beans.get('secureSuperuserOnly');
var accessrights = beans.get('accessrights');
var Member = beans.get('member');

describe('exceptions to the admin guard', function () {

  it('allows anonymous users to create their profile', function () {
    var req = {
      isAuthenticated: function () {return true; },
      originalUrl: '/members/new',
      user: {}
    };
    var res = {locals: {}};
    accessrights(req, res, function () { return undefined; });
    var next = sinon.spy();
    secureSuperuserOnly(req, res, next);
    expect(next.called).to.be(true);
  });

  it('allows anonymous users to save their profile', function () {
    var req = {
      isAuthenticated: function () {return true; },
      originalUrl: '/members/submit',
      user: {}
    };
    var res = {locals: {}};
    accessrights(req, res, function () { return undefined; });
    var next = sinon.spy();
    secureSuperuserOnly(req, res, next);
    expect(next.called).to.be(true);
  });

  it('allows registered users to edit their profile', function () {
    var req = {
      isAuthenticated: function () {return true; },
      originalUrl: '/members/edit/nick',
      user: {
        member: new Member({nickname: 'nick'})
      }
    };
    var res = {locals: {}};
    accessrights(req, res, function () { return undefined; });
    var next = sinon.spy();
    secureSuperuserOnly(req, res, next);
    expect(next.called).to.be(true);
  });

  it('allows registered users to edit their profile even with blanks in nickname', function () {
    var req = {
      isAuthenticated: function () {return true; },
      originalUrl: '/members/edit/nick%20name',
      user: {
        member: new Member({nickname: 'nick name'})
      }
    };
    var res = {locals: {}};
    accessrights(req, res, function () { return undefined; });
    var next = sinon.spy();
    secureSuperuserOnly(req, res, next);
    expect(next.called).to.be(true);
  });

  it('allows registered users to save their profile', function () {
    var req = {
      isAuthenticated: function () {return true; },
      originalUrl: '/members/submit',
      user: {
        member: new Member({id: 'id'})
      },
      body: {id: 'id'}
    };
    var res = {locals: {}};
    accessrights(req, res, function () { return undefined; });
    var next = sinon.spy();
    secureSuperuserOnly(req, res, next);
    expect(next.called).to.be(true);
  });

});
