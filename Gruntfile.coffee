module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jade:
      options:
        pretty: true
      "index.html": ["jade-template/index.jade"]

  # Load the plugin.
  grunt.loadNpmTasks 'grunt-contrib-jade'

  # Default task(s).
  grunt.registerTask 'default', ['jade']
