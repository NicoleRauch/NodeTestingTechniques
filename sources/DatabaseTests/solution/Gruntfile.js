module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    mocha_istanbul: {
      testWithDB: {
        src: 'testWithDB', // the folder, not the files,
        options: {
          root: 'testWithDB', // to make istanbul _not instrument_ our production code
          mask: '**/*.js',
          reporter: 'dot' // set to 'spec' if you like it more verbose
        }
      },
      test: {
        src: 'test', // the folder, not the files,
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
