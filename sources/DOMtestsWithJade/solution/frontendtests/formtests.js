(function () {
  'use strict';

  describe('The Form', function () {
    beforeEach(function (done) {
      $(function () { done();}); // just to wait for the form to be loaded
    });

    var checkFieldMandatory = function (fieldname) {
      var field = $(fieldname);
      field.val('');
      expect(form_validator.element(field)).toBe(false);
      expect(form_validator.errorList[0].message).toBe('This field is required.');
      field.val('.');
      expect(form_validator.element(field)).toBe(true);
    };

    it('checks that "text" is mandatory', function () {
      checkFieldMandatory('#theform [name=text]');
    });

  });
}());
