'use strict';
var conf = require('nconf');
var Member = conf.get('beans').get('member');

module.exports = function accessrights(req, res, next) {
  res.locals.accessrights = {
    req: req,

    member: function () {
      return this.req.user.member;
    },

    memberId: function () {
      return this.isRegistered() ? this.member().id() : null;
    },

    isAuthenticated: function () {
      return !!this.req.isAuthenticated && this.req.isAuthenticated();
    },

    isRegistered: function () {
      return this.isAuthenticated() && !!this.member();
    },

    isSuperuser: function () {
      return Member.isSuperuser(this.memberId());
    },

    canEditMember: function (member) {
      return this.isSuperuser() || this.isMember(member);
    },

    isMember: function (member) {
      return this.isAuthenticated() && this.memberId() === member.id();
    }

  };
  next();
};
