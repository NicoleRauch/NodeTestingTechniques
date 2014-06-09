'use strict';
var expect = require('must');

require('../../testutil/configureForTest');
var beans = require('nconf').get('beans');
var validation = beans.get('validation');

describe('Validation', function () {

  describe('isValidAnnouncement', function () {
    var result = function (object) {
      return validation.isValidAnnouncement(object);
    };

    it('performs many checks simultaneously', function () {
      expect(result({}).length).to.equal(3);
    });

    it('checks that title is set', function () {
      expect(result({})).to.contain('Titel ist ein Pflichtfeld.');
      expect(result({title: null})).to.contain('Titel ist ein Pflichtfeld.');
      expect(result({title: 'n'})).to.not.contain('Titel ist ein Pflichtfeld.');
    });

    it('checks that thruDate is set', function () {
      expect(result({})).to.contain('"Anzeigen bis einschliesslich" ist ein Pflichtfeld.');
      expect(result({thruDate: null})).to.contain('"Anzeigen bis einschliesslich" ist ein Pflichtfeld.');
      expect(result({thruDate: 'n'})).to.not.contain('"Anzeigen bis einschliesslich" ist ein Pflichtfeld.');
    });

    it('checks that url is set', function () {
      expect(result({})).to.contain('URL ist ein Pflichtfeld.');
      expect(result({url: null})).to.contain('URL ist ein Pflichtfeld.');
      expect(result({url: 'n'})).to.not.contain('URL ist ein Pflichtfeld.');
    });

  });

  describe('isValidForMember', function () {
    var result = function (object) {
      return validation.isValidForMember(object);
    };

    it('performs many checks simultaneously', function () {
      expect(result({}).length).to.equal(9);
    });

    it('checks that nickname is set', function () {
      expect(result({})).to.contain('Nickname ist ein Pflichtfeld.');
      expect(result({nickname: null})).to.contain('Nickname ist ein Pflichtfeld.');
      expect(result({nickname: 'n'})).to.not.contain('Nickname ist ein Pflichtfeld.');
    });

    it('checks that nickname is longer than 2 letters', function () {
      expect(result({nickname: null})).to.contain('Nickname muss mindestens 2 Zeichen enthalten.');
      expect(result({nickname: 'n'})).to.contain('Nickname muss mindestens 2 Zeichen enthalten.');
      expect(result({nickname: 'nn'})).to.not.contain('Nickname muss mindestens 2 Zeichen enthalten.');
    });

    it('checks that firstname is set', function () {
      expect(result({firstname: null})).to.contain('Vorname ist ein Pflichtfeld.');
      expect(result({firstname: 'nn'})).to.not.contain('Vorname ist ein Pflichtfeld.');
    });

    it('checks that lastname is set', function () {
      expect(result({lastname: null})).to.contain('Nachname ist ein Pflichtfeld.');
      expect(result({lastname: 'nn'})).to.not.contain('Nachname ist ein Pflichtfeld.');
    });

    it('checks that email is set', function () {
      expect(result({})).to.contain('E-Mail ist ein Pflichtfeld.');
      expect(result({email: null})).to.contain('E-Mail ist ein Pflichtfeld.');
      expect(result({email: 'n'})).to.not.contain('E-Mail ist ein Pflichtfeld.');
    });

    it('checks that email is valid', function () {
      expect(result({email: null})).to.contain('E-Mail muss gültig sein.');
      expect(result({email: 'n'})).to.contain('E-Mail muss gültig sein.');
      expect(result({email: 'n@b'})).to.contain('E-Mail muss gültig sein.');
      expect(result({email: 'n@b.d'})).to.not.contain('E-Mail muss gültig sein.');
    });

    it('checks that location is set', function () {
      expect(result({location: null})).to.contain('Ort / Region ist ein Pflichtfeld.');
      expect(result({location: 'nn'})).to.not.contain('Ort / Region ist ein Pflichtfeld.');
    });

    it('checks that reference is set', function () {
      expect(result({reference: null})).to.contain('Wie ich von... ist ein Pflichtfeld.');
      expect(result({reference: 'nn'})).to.not.contain('Wie ich von... ist ein Pflichtfeld.');
    });

    it('checks that profession is set', function () {
      expect(result({profession: null})).to.contain('Beruf ist ein Pflichtfeld.');
      expect(result({profession: 'nn'})).to.not.contain('Beruf ist ein Pflichtfeld.');
    });

    it('is array with no errors for a correct member', function () {
      var memberObject = {
        nickname: 'nn',
        firstname: 'nn',
        lastname: 'nn',
        email: 'n@b.d',
        location: 'n',
        reference: 'n',
        profession: 'n'
      };
      expect(result(memberObject).length).to.equal(0);
    });

  });

});
