const gulp        	 = require( 'gulp' );
const htmlbuild   	 = require( './gulp/tasks/htmlbuild' );
const stylesbuild 	 = require( './gulp/tasks/stylesbuild' );
const styleslibsbuild = require( './gulp/tasks/styleslibsbuild' );
const fontsbuild  	 = require( './gulp/tasks/fontsbuild' );
const imagesbuild 	 = require( './gulp/tasks/imagesbuild' );
const jsbuild     	 = require( './gulp/tasks/jsbuild' );
const jslibsbuild 	 = require( './gulp/tasks/jslibsbuild' );
const clean       	 = require( './gulp/tasks/clean' );
const server      	 = require( './gulp/tasks/server' );

function setMode( isProduction = false ) {
	return res => {
   	process.env.NODE_ENV = isProduction ? 'production' : 'development'
   	res()
  }
}

const app   = gulp.parallel( htmlbuild, stylesbuild, styleslibsbuild, jsbuild, jslibsbuild, fontsbuild, imagesbuild )
const build = gulp.series( clean, app )

module.exports.start = gulp.series( setMode(), build, server )
module.exports.build = gulp.series( setMode( true ), build )