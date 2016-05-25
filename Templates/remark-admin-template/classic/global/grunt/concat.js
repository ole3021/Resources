module.exports = function (grunt) {
  "use strict";

  var components = grunt.file.readJSON('components.json');
  var componentsSrc = [];

  for(var component in components) {
    if(components[component]){
      componentsSrc.push('<%= config.source.js %>/components/'+component+'.js');
    }
  }

  return {
    options: {
      banner: '<%= banner %>',
      stripBanners: false
    },
    components: {
      src: componentsSrc,
      dest: '<%= config.destination.js %>/components.js'
    },
    js: {
      expand: true,
      cwd: '<%= config.source.js %>',
      src: ['**/*.js'],
      dest: '<%= config.destination.js %>',
    }
  };
};
