module.exports = function () {
  "use strict";

  return {
    options: {
      csslintrc: '<%= config.source.less %>/.csslintrc'
    },
    css: ['<%= config.destination.css %>/*.css', '!<%= config.destination.css %>/*.min.css']
  };
};
