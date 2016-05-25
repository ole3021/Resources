module.exports = function () {
  "use strict";

  return {
    options: {
      csslintrc: '<%= config.source.less %>/.csslintrc'
    },
    dist: ['<%= config.destination.css %>/*.css', '!<%= config.destination.css %>/*.min.css']
  };
};
