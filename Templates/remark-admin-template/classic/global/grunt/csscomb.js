module.exports = function () {
  "use strict";

  return {
    options: {
      config: '<%= config.source.less %>/.csscomb.json'
    },
    css: {
      expand: true,
      cwd: '<%= config.destination.css %>',
      src: ['*.css', '!*.min.css'],
      dest: '<%= config.destination.css %>/'
    },
    fonts: {
      expand: true,
      cwd: '<%= config.destination.fonts %>',
      src: ['*/*.css', '!*/*.min.css'],
      dest: '<%= config.destination.fonts %>'
    },
    vendor: {
      expand: true,
      cwd: '<%= config.destination.vendor %>',
      src: ['*/*.css', '!*/*.min.css'],
      dest: '<%= config.destination.vendor %>'
    }
  };
};
