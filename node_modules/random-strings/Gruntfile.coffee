module.exports = (grunt) ->
    require('load-grunt-tasks') grunt
    
    grunt.initConfig
	    coffee:
	    	compile:
	    		expand: true
	    		flatten: true
	    		src: ['src/*.coffee']
	    		dest: 'dist'
	    		ext: '.js'


   	grunt.registerTask 'default', ['coffee']