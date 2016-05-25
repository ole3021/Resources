module.exports = function () {
  "use strict";

  return {
    options: {
      jshintrc: '.jshintrc'
    },
    // src: {
    //   src: ['<%= config.source.js %>/**/*.js']
    // },
    grunt: {
      options: {
        jshintrc: 'grunt/.jshintrc'
      },
      src: ['Gruntfile.js', 'package.js', 'grunt/*.js']
    }
  };
};
