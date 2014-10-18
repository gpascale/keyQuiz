var path = require('path');
var shell = require('shelljs');

module.exports = function(grunt) {

    /*************************************************************************/
    // Clean
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.config('clean', [ 'www' ]);

    /*************************************************************************/
    // Less - Compile less files and move to the intermediates folder
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.config('less', {
        all: {
            files: {
                'www/intermediates/css/KeyQuiz.css': 'src/client/less/*.less',
            }   
        },
        options: {
            cleancss: true,
            paths: ['src/client/less']
        }
    });

    /*************************************************************************/
    // Compile React
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-react');
    grunt.config('react', {
        dynamic_mappings: {
            files: [ {
                expand: true,
                cwd: 'src/client/js',
                src: ['**/*.{js,jsx}'],
                dest: 'www/intermediates/js/client',
                ext: '.js'
            } ]
        }
    });

    /*************************************************************************/
    // Compile underscore templates
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.config('jst', {
        compile: {
            options: {
                namespace: 'KeyQuiz.Templates',
                processName: function(filename) {
                    return path.basename(filename, '.tmpl');
                },
                prettify: true,
                templateSettings: { variable: 'data' }
            },
            files: {
                "www/intermediates/js/client/templates.js": ["src/client/templates/*.tmpl"]
            }
        }
    });

    /*************************************************************************/
    // Copy fonts
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.config('copy', {
        fonts: {
            src: 'ext/fonts/*',
            dest: 'www/intermediates/fonts/',
            expand: true,
            flatten: true
        },
        srcmaps: {
            src: 'ext/js/*.map',
            dest: 'www/intermediates/js/client/',
            expand: true,
            flatten: true
        },
        sharedjs: {
            src: 'src/shared/js/**/*.js',
            dest: 'www/intermediates/js/server/',
            expand: true,
            flatten: true  
        }
    });

    /*************************************************************************/
    // Concat
    /*************************************************************************/    
    grunt.loadNpmTasks('grunt-contrib-concat');
    var banner = ';(function(exports) {\n';
    var footer = '})((typeof exports === "undefined") ? (window.KeyQuiz = window.KeyQuiz || { }) : exports);\n';
    grunt.config('concat', {
        extjs: {
            src: [ 'ext/js/jquery.min-1.10.2.js',
                   'ext/js/underscore-min-1.6.0.js',
                   'ext/js/backbone-min.js',
                   'ext/js/backbone.marionette.min.js',
                   'ext/js/react-0.11.1.min.jsq' ],
            dest: 'www/intermediates/js/client/KeyQuiz.external.js'
        },
        extCss: {
            src: [ 'ext/css/bootstrap.min.css',
                   'ext/css/bootstrap-theme.min.css',
                   'ext/css/bootstrap.min.css.map',
                   'ext/css/bootstrap-theme.min.css.map',
                   'ext/css/font-awesome.min.css' ],
            dest: 'www/intermediates/css/KeyQuiz.external.css'
        },
        js: {
            src: ['www/intermediates/js/client/templates.js', 'src/shared/js/**/*.js', 'src/client/js/**/*.js',],
            dest: 'www/intermediates/js/client/KeyQuiz.js',
            options: {
                banner: banner,
                separator: '\n' + footer + banner,
                footer: footer
            }
        }
    });

    /*************************************************************************/
    // App Packaging
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('packageApp', function() {
        var packageRoot = 'www/appPackage/'
        grunt.config.set('copy.app', {
            src: [ 'src/server/app.js', 'src/server/package.json', 'www/intermediates/js/server/*.js' ],
            dest: packageRoot,
            expand: true,
            flatten: true
        });
        grunt.config.set('copy.appNodeModules', {
            cwd: 'src/server/',
            src: 'node_modules/**/*',
            dest: packageRoot,
            expand: true
        });
        grunt.config.set('copy.appHtml', {
            src: 'src/server/**/*.html',
            dest: packageRoot + 'public/html',
            expand: true,
            flatten: true
        });
        grunt.config.set('copy.appJs', {
            src: 'www/intermediates/js/client/*',
            dest: packageRoot + 'public/js',
            expand: true,
            flatten: true
        });
        grunt.config.set('copy.appCss', {
            src: 'www/intermediates/**/*{.css,.css.map}',
            dest: packageRoot + 'public/css',
            expand: true,
            flatten: true
        });
        grunt.config.set('copy.appFonts', {
            src: 'www/intermediates/fonts/**/*',
            dest: packageRoot + 'public/fonts',
            expand: true,
            flatten: true
        });
        
        grunt.task.run(['copy:app', 'copy:appNodeModules', 
                        'copy:appHtml', 'copy:appJs', 'copy:appCss',
                        'copy:appFonts']);
    });

    /*************************************************************************/
    // Node
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-express-server');
    grunt.config.set('express', {
        dev: {
            options: {
                script: 'www/appPackage/app.js',
                port: 3000,
                background: true
            },
        },
    });

    /*************************************************************************/
    // Watch
    /*************************************************************************/
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.config('watch', {
        local: {
            files: ['src/client/js/**/*', 'src/client/less/**/*', 'src/client/templates/**/*',
                    'src/shared/js/**/*', 'ext/**/*', 'Gruntfile.js'],
            tasks: ['clean', 'www'],
            options: {
                atBegin: true
            }
        },
        app: {
            files: ['src/server/**/*'],
            tasks: ['packageApp', 'express:dev'],
            options: {
                atBegin: true,
                nospawn: true
            }
        }
    });

    /*************************************************************************/
    // Github Pages                                                           
    /*************************************************************************/

    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.config('gh-pages', {
        options: {
            base: 'public'
        },
        src: ['**']
    });

    /*************************************************************************/

    grunt.registerTask('www', ['less', 'copy', 'jst', 'react', 'concat', 'packageApp'])
    grunt.registerTask('default', ['clean', 'www']);
};
