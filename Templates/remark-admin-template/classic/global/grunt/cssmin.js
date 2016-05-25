module.exports = function () {
  "use strict";

  return {
    options: {
      // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
      //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
      compatibility: 'ie8',
      keepSpecialComments: '*',
      advanced: false
    },
    css: {
      files: [
        {
          expand: true,
          cwd: '<%= config.destination.css %>',
          src: ['**/*.css', '!**/*.min.css'],
          dest: '<%= config.destination.css %>',
          ext: '.min.css',
          extDot: 'last'
        }
      ]
    },
    fonts: {
      files: [
        {
          expand: true,
          cwd: '<%= config.destination.fonts %>',
          src: ['*/*.css', '!*/*.min.css'],
          dest: '<%= config.destination.fonts %>',
          ext: '.min.css',
          extDot: 'last'
        }
      ]
    },
    vendor: {
      files: [
        {
          expand: true,
          cwd: '<%= config.destination.vendor %>',
          src: ['*/*.css', '!*/*.min.css'],
          dest: '<%= config.destination.vendor %>',
          ext: '.min.css',
          extDot: 'last'
        }
      ]
    }
  };
};
