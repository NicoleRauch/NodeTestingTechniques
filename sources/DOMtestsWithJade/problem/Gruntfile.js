module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      once: {
        browsers: ['PhantomJS'],
        runnerPort: 6666,
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['karma:once']);
  grunt.registerTask('default', ['test']);

};
