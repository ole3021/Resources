module.exports = function () {
  "use strict";

  return {
    options: {
      browsers: '<%= config.autoprefixerBrowsers %>'
    },
    css: {
      options: {
        map: false
      },
      src: ['<%= config.destination.css %>/**/*.css', '!<%= config.destination.css %>/**/*.min.css']
    },
    fonts: {
      options: {
        map: false
      },
      src: ['<%= config.destination.fonts %>/*/*.css', '!<%= config.destination.fonts %>/*/*.min.css']
    },
    vendor: {
      options: {
        map: false
      },
      src: ['<%= config.destination.vendor %>/*/*.css', '!<%= config.destination.vendor %>/*/*.min.css']
    }
  };
};
