const gulp = require('gulp');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const path = {
	dist: { //Куда складывать готовые после сборки файлы
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/',
	},
	app: { //Пути откуда брать файлы
		html: 'app/*.html',
		js: ['app/js/main.js', 'app/js/script.js'],
		style: 'app/sass/main.sass',
		stylelibs: 'app/sass/libs.sass',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*',
	},
	watch: { //За изменением каких файлов мы хотим наблюдать
		html: 'app/**/*.html',
		js: 'app/js/**/*.js',
		style: 'app/sass/**/*.sass',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*',
	},
	clean: 'dist/'
};

const libsScripts = [
	// 'node_modules/slick-carousel/slick/slick.min.js'
];

module.exports = function vendors(cb) {
	return libsScripts.length
		? gulp.src(libsScripts)
			.pipe(concat('libs.min.js'))
			.pipe(terser())
			.pipe(gulp.dest(path.dist.js))
		: cb();
};