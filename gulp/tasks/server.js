const gulp = require('gulp');
const htmlbuild = require('./htmlbuild');
const stylesbuild = require('./stylesbuild');
const imagesbuild = require('./imagesbuild');
const jsbuild = require('./jsbuild');
const browserSync = require('browser-sync'); // перезагрузка страницы после сохранения изменений
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

module.exports = function server(cb) {
	browserSync({
		server: {
			baseDir: 'dist/' // Директория для сервера - app
		},
		notify: false, // Отключаем уведомления
		online: true
	});

	gulp.watch(path.watch.img, gulp.series(imagesbuild))
	gulp.watch(path.watch.img).on('change', browserSync.reload);

	gulp.watch(path.watch.style, gulp.series(stylesbuild))
	gulp.watch(path.watch.style).on('change', browserSync.reload);

	gulp.watch(path.watch.js, gulp.series(jsbuild))
	gulp.watch(path.watch.js).on('change', browserSync.reload);

	gulp.watch(path.watch.html, gulp.series(htmlbuild))
	gulp.watch(path.watch.html).on('change', browserSync.reload);
	return cb()
};