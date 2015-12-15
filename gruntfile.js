module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            dev: {
                src: ['src/scripts/**/*.ts'],
                dest: 'public/js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    sourceMap: false,
                    declaration: false
                }
            },
            prod: {
                src: ['src/scripts/**/*.ts'],
                out: 'public/game.js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    sourceMap: false,
                    declaration: false
                }
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'bower_components/webfontloader/webfontloader.js',
                    'bower_components/phaser/build/custom/phaser-arcade-physics.js',
                    'public/game.js'
                ],
                dest: 'public/game.js'
            }
        },

        uglify: {
            prod: {
                files: {
                    'public/game.min.js': ['public/game.js']
                }
            }
        },

        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: [
                            'assets/**'
                        ],
                        dest: 'public/'
                    },
                    {
                        src: 'src/index.html',
                        dest: 'public/index.html'
                    },
                    {
                        src: 'src/credits.html',
                        dest: 'public/credits.html'
                    },
                    {
                        src: 'bower_components/phaser/build/custom/phaser-arcade-physics.js',
                        dest: 'public/vendor/phaser/phaser.js'
                    },
                    {
                        src: 'bower_components/webfontloader/webfontloader.js',
                        dest: 'public/vendor/webfontloader/webfontloader.js'
                    }
                ]
            },
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: [
                            'assets/**'
                        ],
                        dest: 'public/'
                    },
                    {
                        src: 'src/index-prod.html',
                        dest: 'public/index.html'
                    },
                    {
                        src: 'src/credits.html',
                        dest: 'public/credits.html'
                    }
                ]
            }

        },

        clean: {
            dev: ['public/**/*'],
            prod: ['public/**/*']
        },

        watch: {
            scripts: {
                files: ['src/**/*'],
                tasks: ['dev'],
                options: {
                    spawn: false,
                    debounceDelay: 250
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', [
        'clean:dev',
        'ts:dev',
        'copy:dev'
    ]);

    grunt.registerTask('prod', [
        'clean:prod',
        'ts:prod',
        'concat',
        'uglify:prod',
        'copy:prod'
    ]);
};
