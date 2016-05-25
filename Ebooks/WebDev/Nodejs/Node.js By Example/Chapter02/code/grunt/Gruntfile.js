module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			javascript: {
				src: 'src/**/*.js',
				dest: 'build/scripts.js'
			}
		},
		uglify: {
			javascript: {
				files: {
					'build/scripts.min.js': '<%= concat.javascript.dest %>'
				}
			}
		},
		watch: {
			javascript: {
				files: ['<%= concat.javascript.src %>'],
				tasks: ['concat', 'uglify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'uglify', 'watch']);
}
