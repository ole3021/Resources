module.exports = function () {
  "use strict";

  return {
    options: {
      strictMath: false,
      paths: [
        '<%= config.source.less %>',
        '<%= config.bootstrap.less %>',
        '<%= config.bootstrap.mixins %>'
      ]
    },
    compileBootstrap: {
      options: {
        strictMath: true
      },
      src: '<%= config.source.less %>/bootstrap.less',
      dest: '<%= config.destination.css %>/bootstrap.css'
    },
    compileExtend: {
      options: {
        strictMath: true
      },
      src: '<%= config.source.less %>/bootstrap-extend.less',
      dest: '<%= config.destination.css %>/bootstrap-extend.css'
    },
    fonts: {
      expand: true,
      cwd: '<%= config.source.fonts %>',
      src: ['*/*.less', '!*/_*.less'],
      dest: '<%= config.destination.fonts %>',
      ext: '.css',
      extDot: 'last'
    },
    vendor: {
      expand: true,
      cwd: '<%= config.source.vendor %>',
      src: ['*/*.less', '!*/settings.less'],
      dest: '<%= config.destination.vendor %>',
      ext: '.css',
      extDot: 'last'
    }
  };
};
