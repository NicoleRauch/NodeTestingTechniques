'use strict';

var conf = require('../../testutil/configureForTest');
var beans = conf.get('beans');
var accessrights = beans.get('accessrights');
var Announcement = beans.get('announcement');
var Member = beans.get('member');
var expect = require('must');

function guest() {
  var req = {  };
  var res = { locals: {} };
  accessrights(req, res, function () { return undefined; });
  return res.locals.accessrights;
}

function standardMember(member) {
  var memberOfUser = member || {};
  var req = { isAuthenticated: function () { return true; }, user: {member: new Member(memberOfUser)} };
  var res = { locals: {} };
  accessrights(req, res, function () { return undefined; });
  return res.locals.accessrights;
}

function superuser() {
  // 'superuserID' is set in configureForTest as one valid superuser Id
  return standardMember({id: 'superuserID'});
}

describe('Accessrights for Announcements', function () {
  it('disallows the creation for members', function () {
    expect(standardMember().canCreateAnnouncement()).to.be(true);
  });

  it('allows the creation for superusers', function () {
    expect(superuser().canCreateAnnouncement()).to.be(true);
  });

  it('disallows editing for members', function () {
    expect(standardMember().canEditAnnouncement(new Announcement({url: 'url', author: 'author'}))).to.be(false);
  });

  it('allows editing for authors', function () {
    expect(standardMember({id: 'authorX'}).canEditAnnouncement(new Announcement({url: 'url', author: 'authorX'}))).to.be(true);
  });

  it('allows editing for superusers', function () {
    expect(superuser().canEditAnnouncement()).to.be(true);
  });
});

describe('Accessrights for Members', function () {
  it('disallows editing others for members', function () {
    var member = {id: 'id'};
    var otherMember = new Member({id: 'other'});
    expect(standardMember(member).canEditMember(otherMember)).to.be(false);
  });

  it('allows editing herself for members', function () {
    var member = {id: 'id'};
    expect(standardMember(member).canEditMember(new Member(member))).to.be(true);
  });

  it('allows editing others for superusers', function () {
    var otherMember = new Member({id: 'other'});
    expect(superuser().canEditMember(otherMember)).to.be(true);
  });
});

