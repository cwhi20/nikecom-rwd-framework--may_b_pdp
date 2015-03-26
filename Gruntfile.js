/*!
 *
 * Nike.com RWD Framework config.
 *
 * Grunt Nautilus:
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Available grunt-nautilus tasks:
 * grunt nautilus:build [, flags...]
 * grunt nautilus:deploy [, flags...]
 * grunt nautilus:module [, flags...]
 *
 */
module.exports = function ( grunt ) {


    "use strict";


    // Default project paths.
    var pubRoot = "./source",
        jsRoot = "./source/javascripts",
        appRoot = jsRoot + "/app",
        libRoot = jsRoot + "/lib",
        distRoot = jsRoot + "/dist";


    // Project configuration.
    grunt.initConfig({
        // Project meta.
        meta: {
            version: "0.1.0"
        },


        // Nautilus config. ( required options )
        nautilus: {
            options: {
                jsAppRoot: appRoot,
                jsDistRoot: distRoot,
                jsLibRoot: libRoot,
                jsRoot: jsRoot,
                pubRoot: pubRoot,
                jsGlobals: {
                    $: true,
                    jQuery: true,
                    Hammer: true,
                    Spinner: true,
                    require: true,
                    provide: true,
                    Draggable: true
                },
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ]
            }
        },


        jshint: {
            options: {
                unused: false
            }
        }


    });


    // Load the nautilus plugin.
    grunt.loadNpmTasks( "grunt-nautilus" );


    // Register default task.
    grunt.registerTask( "default", ["nautilus:build"] );


};