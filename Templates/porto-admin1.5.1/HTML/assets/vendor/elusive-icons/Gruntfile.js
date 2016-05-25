
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            fonts: {
                files: ['svg/*.svg'],
                tasks: ['webfont']
            }
        },
        rename: {
            renameEOT: {
                src: 'src/assets/elusive-icons/fonts/elusiveicons.eot',
                dest: 'src/assets/elusive-icons/fonts/elusiveicons-webfont.eot',
            },
            renameTTF: {
                src: 'src/assets/elusive-icons/fonts/elusiveicons.ttf',
                dest: 'src/assets/elusive-icons/fonts/elusiveicons-webfont.ttf',
            },
            renameSVG: {
                src: 'src/assets/elusive-icons/fonts/elusiveicons.svg',
                dest: 'src/assets/elusive-icons/fonts/elusiveicons-webfont.svg',
            },
            renameWOFF: {
                src: 'src/assets/elusive-icons/fonts/elusiveicons.woff',
                dest: 'src/assets/elusive-icons/fonts/elusiveicons-webfont.woff',
            },
            //renameWOFF2: {
            //    src: 'src/assets/elusive-icons/fonts/elusiveicons.woff2',
            //    dest: 'src/assets/elusive-icons/fonts/elusiveicons-webfont.woff2',
            //},
        },
        webfont: {
            iconsLESS: {
                src: 'dev/icons-svg/*.svg',
                dest: 'src/assets/elusive-icons/fonts',
                destCss: "dev/",
                engine: "node",
                options: {
                    fontHeight: 1200,
                    descent: 125,
                    font: 'elusiveicons',
                    types: "eot,woff,ttf,svg",
                    templateOptions: {
                        baseClass: 'el',
                        classPrefix: 'el-',
                        //mixinPrefix: 'el-'
                    },
                    //htmlDemo: false,
                    //ligatures: true,
                    template: 'dev/templates/template.css',
                    stylesheet: "css",
                    destHtml: false
                    //htmlDemoTemplate: "fusion-icon/template/template.html",
                    //ie7: true,
                }
            }
        },

        shell: {
            remove: {
                command: 'rm -fr src/assets/elusive-icons/fonts && rm dev/elusiveicons.css'
            },
            buildYAML: {
                command: 'cd dev && php build.php'
            }

        }
    });

    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-rename');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['shell:remove', 'webfont', 'rename', 'shell:buildYAML']);

};
