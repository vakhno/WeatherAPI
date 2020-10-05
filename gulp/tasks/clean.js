const del = require('del')
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

module.exports = function clean(cb) {
	return del(path.clean).then(() => {
		cb()
	})
}