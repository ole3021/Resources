module.exports = function () {
  "use strict";

  return {
    options: {
      browsers: '<%= config.autoprefixerBrowsers %>'
    },
    css: {
      options: {
        map: true
      },
      src: '<%= config.destination.css %>/**/*.css'
    },
    skins: {
      options: {
        map: false
      },
      src: ['<%= config.destination.skins %>/*.css', '!<%= config.destination.skins %>/*.min.css']
    },
    examples: {
      options: {
        map: false
      },
      src: ['<%= config.destination.examples %>/**/*.css', '!<%= config.destination.examples %>/**/*.min.css']
    }
  };
};
