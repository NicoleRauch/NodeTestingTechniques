module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    clean: ['frontendtests/fixtures/*.html'],
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      once: {
        browsers: ['PhantomJS'],
        runnerPort: 6666,
        singleRun: true
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true,
          data: function () {
            return require('./frontendtests/fixtures/locals');
          }
        },
        files: {
          'frontendtests/fixtures/forms.html': 'frontendtests/fixtures/forms.jade'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['clean', 'jade', 'karma:once']);
  grunt.registerTask('default', ['test']);

};
