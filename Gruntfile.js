module.exports = function(grunt) {

    /* Projectile project configuration */
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                build: {
                    src: '<%= pkg.name %>.js',
                    dest: 'build/<%= pkg.name %>.min.js'
                }
            }
        });
    /* Loads the plugin that provides the 'uglify' task */
    grunt.loadNpmTasks('grunt-contrib-uglify');

    /* Default tasks */
    grunt.registerTask('default', ['uglify']);
};