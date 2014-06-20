'use strict';

var async = require('async');
var _ = require('lodash');
var conf = require('nconf');
var beans = conf.get('beans');

var validation = beans.get('validation');
var Member = beans.get('member');
var api = beans.get('membersAPI');
var memberstore = beans.get('memberstore');
var misc = beans.get('misc');

function memberForNew(req) {
  return new Member().initFromSessionUser(req.user);
}

function saveMember(persistentMember, req, res, next) {
  if (persistentMember && !res.locals.accessrights.canEditMember(persistentMember)) {
    return res.redirect('/members');
  }
  var member = persistentMember || memberForNew(req);
  member.addAuthentication(req.body.id);
  member.fillFromUI(req.body);
  memberstore.saveMember(member, function (err) {
    if (err) { return next(err); }
    if (!req.user.member || req.user.member.id() === member.id()) {
      req.user.member = member;
      delete req.user.profile;
    }
    return res.redirect('/members/' + encodeURIComponent(member.nickname()));
  });
}

function memberSubmitted(req, res, next) {
  memberstore.getMember(req.body.previousNickname, function (err, member) {
    if (err) { return next(err); }
    saveMember(member, req, res, next);
  });
}

var app = misc.expressAppIn(__dirname);

app.get('/', function (req, res, next) {
  memberstore.allMembers(function (err, members) {
    if (err) { return next(err); }
    res.render('index', { members: members });
  });
});

app.get('/checknickname', function (req, res) {
  misc.validate(req.query.nickname, req.query.previousNickname, api.isValidNickname, res.end);
});

app.get('/checkemail', function (req, res) {
  misc.validate(req.query.email, req.query.previousEmail, api.isValidEmail, res.end);
});

app.get('/new', function (req, res, next) {
  if (req.user.member) {
    return res.redirect('/members/');
  }
  res.render('edit', { member: memberForNew(req)});
});

app.get('/edit/:nickname', function (req, res, next) {
  var nicknameOfEditMember = req.params.nickname;
  memberstore.getMember(nicknameOfEditMember, function (err, member) {
    if (!res.locals.accessrights.canEditMember(member)) {
      return res.redirect('/members/' + encodeURIComponent(member.nickname()));
    }
    if (err || !member) { return next(err); }
    res.render('edit', { member: member});
  });
});

app.post('/submit', function (req, res, next) {
  return memberSubmitted(req, res, next);
});

app.get('/:nickname', function (req, res, next) {
  memberstore.getMember(req.params.nickname, function (err, member, subscribedGroups) {
    if (err || !member) { return next(err); }
    res.render('get', { member: member});
  });
});

module.exports = app;
