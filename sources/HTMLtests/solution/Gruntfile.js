module.exports = function (grunt) {
  'use strict';

  var jsLintStandardOptions = { edition: 'latest', errorsOnly: true, failOnError: true };

  var serverDirectives = function () {
    return { indent: 2, node: true, nomen: true, todo: true, unparam: true, vars: true };
  };
  var jsLintServerDirectives = serverDirectives();
  var jsLintServerTestDirectives = serverDirectives();
  jsLintServerTestDirectives.ass = true;
  jsLintServerTestDirectives.predef = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'];

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    clean: ['coverage'],
    jslint: {
      server: {
        src: [
          '*.js',
          'lib/**/*.js'
        ],
        directives: jsLintServerDirectives,
        options: jsLintStandardOptions
      },
      servertests: {
        src: [
          'test/**/*.js',
          'testWithDB/**/*.js',
          'testutil/**/*.js',
          'frontendtests/fixtures/locals.js'
        ],
        directives: jsLintServerTestDirectives,
        options: jsLintStandardOptions
      }
    },
    less: {
      minify: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          'public/stylesheets/screen.css': [
            'public/stylesheets/vendor/fullcalendar.css',
            'public/stylesheets/less/bootstrap.less',
            'public/stylesheets/vendor/datepicker3.css',
            'public/stylesheets/less/bootstrap-markdown-patched.less',
            'public/stylesheets/vendor/font-awesome.min.css',
            'public/stylesheets/less/pick-a-color-patched.less',
            'public/stylesheets/vendor/shCoreDefault-patched.css',
            'public/stylesheets/vendor/jquery.dataTables.css',
            'public/stylesheets/partials/agora.less'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      de: {
        src: [
          'locales/frontend_de.js',
          'node_modules/jquery/dist/jquery.js',
          'public/clientscripts/global/bootstrap.js',
          'public/clientscripts/global/bootstrap-datepicker.js',
          'public/clientscripts/global/bootstrap-markdown.js',
          'node_modules/moment-timezone/node_modules/moment/min/moment.min.js',
          'public/clientscripts/global/fullcalendar-patched.js',
          'public/clientscripts/global/de.js', // for fullcalendar
          'public/clientscripts/global/tinycolor-0.9.15.min.js', // for pick-a-color
          'public/clientscripts/global/pick-a-color.js',
          'public/clientscripts/global/bootstrap-datepicker.de.js',
          'node_modules/jquery-validation/jquery.validate.js',
          'node_modules/jquery-validation/additional-methods.js',
          'node_modules/jquery-validation/localization/messages_de.js',
          'node_modules/jquery-validation/localization/methods_de.js',
          'node_modules/bootstrap-timepicker/js/bootstrap-timepicker.js',
          'node_modules/URIjs/src/URI.min.js',
          'public/clientscripts/global/agora.js'
        ],
        dest: 'public/clientscripts/global_de.js'
      },
      en: {
        src: [
          'locales/frontend_en.js',
          'node_modules/jquery/dist/jquery.js',
          'public/clientscripts/global/bootstrap.js',
          'public/clientscripts/global/bootstrap-datepicker.js',
          'public/clientscripts/global/bootstrap-markdown.js',
          'node_modules/moment-timezone/node_modules/moment/min/moment.min.js',
          'public/clientscripts/global/fullcalendar-patched.js',
          'public/clientscripts/global/en-gb.js', // for fullcalendar
          'public/clientscripts/global/tinycolor-0.9.15.min.js', // for pick-a-color
          'public/clientscripts/global/pick-a-color.js',
          'node_modules/jquery-validation/jquery.validate.js',
          'node_modules/jquery-validation/additional-methods.js',
          'node_modules/bootstrap-timepicker/js/bootstrap-timepicker.js',
          'node_modules/URIjs/src/URI.min.js',
          'public/clientscripts/global/agora.js'
        ],
        dest: 'public/clientscripts/global_en.js'
      }
    },
    mocha_istanbul: {
      test: {
        src: 'test', // the folder, not the files,
        options: {
          root: 'lib',
          mask: '**/*.js',
          reporter: 'dot', // set to 'spec' if you like it more verbose
          check: {
            lines: 78,
            statements: 74
          }
        }
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-jslint');

  // Default task.
  grunt.registerTask('default', ['clean', 'less', 'concat', 'jslint', 'mocha_istanbul']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
};
