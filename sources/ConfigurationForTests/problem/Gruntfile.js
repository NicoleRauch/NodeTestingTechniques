module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    mocha_istanbul: {
      test: {
        src: 'lib', // the folder, not the files,
        options: {
          root: 'lib',
          mask: '**/*.js',
          reporter: 'dot' // set to 'spec' if you like it more verbose
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('test', ['mocha_istanbul']);
  grunt.registerTask('default', ['test']);
};
