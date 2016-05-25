
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

  // HTML validation task
  grunt.registerTask('validate-html', ['bootlint', 'htmllint']);

  // lint task
  grunt.registerTask('lint', ['csslint', 'jshint']);

  // Clean task.
  grunt.registerTask('clean-dist', ['clean:html', 'clean:css', 'clean:js', 'clean:skins', 'clean:examples']);

  // Html distribution task.
  grunt.registerTask('dist-html', ['clean:html', 'hb', 'prettify', 'notify:html']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['clean:js', 'concat:js', 'uglify:js', 'notify:js']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileSite']);
  grunt.registerTask('dist-css', ['clean:css', 'less-compile', 'autoprefixer:css', 'csscomb:css', 'cssmin:css', 'notify:css']);

  // Skins distribution task.
  grunt.registerTask('dist-skins', ['clean:skins', 'less:skins', 'autoprefixer:skins', 'csscomb:skins', 'cssmin:skins', 'notify:skins']);

  // Examples distribution task.
  grunt.registerTask('dist-examples-js',  ['concat:examples', 'uglify:examples']);
  grunt.registerTask('dist-examples-css', ['less:examples', 'autoprefixer:examples', 'csscomb:examples', 'cssmin:examples', 'notify:examples']);
  grunt.registerTask('dist-examples',  ['clean:examples', 'dist-examples-js', 'dist-examples-css']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-html', 'dist-css', 'dist-js', 'dist-skins', 'dist-examples', 'notify:all']);

  // Default task.
  grunt.registerTask('default', ['dist-css']);
};
