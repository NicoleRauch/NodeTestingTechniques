var form_validator;
(function () {
  'use strict';

  var initValidator = function () {

    form_validator = $('#theform').validate({
      rules: {
        text: 'required'
      },
      errorElement: 'span'
    });

    form_validator.form();

    var handler = function (each) {
      return function () {
        form_validator.element(each);
      };
    };

    ['#theform [name=text]'].forEach(function (each) {
      $(each).on('change', handler(each));
      $(each).keyup(handler(each));
    });
  };

  $(document).ready(initValidator);
}());
