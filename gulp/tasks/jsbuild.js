const gulp = require('gulp');
const fs = require('fs');
const rigger = require('gulp-rigger'); // для подключение к скрипту его частей( //= scripts/dom.js )
const terser = require('gulp-terser'); // сжатие
const plumber = require('gulp-plumber'); // отслеживание ошибок без прерывания GULP
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
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
	clean: 'dist/',
	eslintFile: '.eslintrc.json'
};

module.exports = function jsbuild() {
	let pathPipes = gulp.src(path.app.js).pipe(plumber());
	try {
		if (fs.accessSync(path.eslintFile)) {
			pathPipes = pathPipes.pipe(eslint()).pipe(eslint.format());
		}
		pathPipes = pathPipes.pipe(eslint()).pipe(eslint.format());
	} catch (e) {
		console.log('Eslint not found')
	}
	pathPipes = pathPipes.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(terser())
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.dist.js));
	return pathPipes;
};