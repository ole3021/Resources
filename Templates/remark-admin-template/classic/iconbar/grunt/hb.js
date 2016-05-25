module.exports = function () {
  "use strict";

  return {
    options: {
      data: [
        '<%= config.templates.data %>/**/*.{js,json}'
      ],
      helpers: [
        './node_modules/handlebars-layouts/index.js',
        '<%= config.templates.helpers %>/*.js'
      ],
      partials: '<%= config.templates.partials %>/**/*.hbs',
      debug: false
    },
    html: {
      files: [{
        expand: true,
        cwd: '<%= config.templates.pages %>',
        src: [
        '**/*.html',
        ],
        dest: '<%= config.html %>'
      }]
    },
    hb: {
      files: [{
        expand: true,
        cwd: '<%= config.templates.pages %>',
        src: [
        '**/*.tpl',
        ],
        dest: '<%= config.html %>'
      }]
    }
  };
};
