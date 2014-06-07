module.exports = function (grunt) {
  // See http://www.jshint.com/docs/#strict
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
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
          "frontendtests/fixtures/forms.html": "frontendtests/fixtures/forms.jade"
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-karma');

  // Combo task for frontendtests
  grunt.registerTask('frontendtests', ['clean', 'jade', 'karma:once']);

  // Default task.
  grunt.registerTask('default', ['frontendtests']);

};
