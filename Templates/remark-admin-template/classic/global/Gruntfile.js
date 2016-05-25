
module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  require('load-grunt-config')(grunt, {
    // path to task.js files, defaults to grunt dir
    configPath: path.join(process.cwd(), 'grunt'),

    // auto grunt.initConfig
    init: true,

    // data passed into config.  Can use with <%= test %>
    data: {
      pkg: grunt.file.readJSON('package.json'),
      config: grunt.file.readJSON('config.json'),
      color: grunt.file.readYAML('color.yml'),
      banner: '/*!\n' +
            ' * <%= pkg.name %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
            ' * Licensed under the <%= pkg.license %>\n' +
            ' */\n'
    },

    // can optionally pass options to load-grunt-tasks.
    // If you set to false, it will disable auto loading tasks.
    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: ['devDependencies' ,'dependencies']
    }
  });

  // lint task
  grunt.registerTask('lint', ['csslint', 'jshint']);

  // Clean task.
  grunt.registerTask('clean-dist', ['clean:css', 'clean:js', 'clean:fonts', 'clean:vendor']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['clean:js', 'concat:components', 'concat:js', 'uglify:min', 'notify:js']);

  // CSS distribution task.
   // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileBootstrap', 'less:compileExtend']);
  grunt.registerTask('dist-css', ['clean:css', 'less-compile', 'autoprefixer:css', 'csscomb:css', 'cssmin:css', 'notify:css']);

  // Vendor distribution task.
  grunt.registerTask('dist-vendor', ['clean:vendor', 'less:vendor', 'autoprefixer:vendor', 'csscomb:vendor', 'cssmin:vendor', 'notify:vendor']);

  // Fonts distribution task.
  grunt.registerTask('dist-fonts', ['clean:fonts', 'less:fonts', 'autoprefixer:fonts', 'csscomb:fonts', 'cssmin:fonts', 'notify:fonts']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-js', 'dist-css', 'dist-vendor', 'dist-fonts', 'notify:all']);

  // Default task.
  grunt.registerTask('default', ['dist-css', 'dist-vendor']);
};
