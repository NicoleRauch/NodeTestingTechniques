'use strict';

function Member(object) {
  this.firstname = object.firstname;
  this.lastname = object.lastname;
  this.nickname = object.nickname;
}

module.exports = Member;
