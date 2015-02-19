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
            },
            cssmin: {
                dist: {
                    src: '<%= pkg.name %>.css',
                    dest: 'build/<%= pkg.name %>.min.css'
                }
            }
        });
    /* Loads the plugins that provides the tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    /* Default tasks */
    grunt.registerTask('default', ['uglify', 'cssmin']);
};