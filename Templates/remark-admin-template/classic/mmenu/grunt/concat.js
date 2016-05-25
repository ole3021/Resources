module.exports = function (grunt) {
  "use strict";

  return {
    options: {
      banner: '<%= banner %>',
      stripBanners: false
    },
    js: {
      expand: true,
      cwd: '<%= config.source.js %>',
      src: ['**/*.js'],
      dest: '<%= config.destination.js %>',
    },
    examples: {
      expand: true,
      cwd: '<%= config.source.examples %>/js',
      src: ['**/*.js'],
      dest: '<%= config.destination.examples %>/js',
    }
  };
};
