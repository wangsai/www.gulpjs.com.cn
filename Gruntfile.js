module.exports = function( grunt ) {

grunt.initConfig({
	connect: {
      server: {
        options: {
          port: 9000,
          base: './_site',
          keepalive: true
        }
      }
    },

    copy: {
    	resources: {
    		files: [
    			{
    				expand: true,
    				cwd: 'assets/',
    				src: '**',
    				dest: '_site/',
    				filter: 'isFile'
    			}
    		]
    	}
    },

    exec: {
		metalsmith: {
			cmd: 'node index'
		},
    },

    clean: ['_site']
});

grunt.registerTask( "default", ['clean', 'exec', 'copy']);

grunt.loadNpmTasks( "grunt-contrib-connect" );
grunt.loadNpmTasks( "grunt-contrib-clean" );
grunt.loadNpmTasks( "grunt-contrib-copy" );
grunt.loadNpmTasks( "grunt-exec" );


};
