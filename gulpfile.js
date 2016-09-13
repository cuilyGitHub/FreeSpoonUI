"use strict";

var gulp = require('gulp'),
	connect = require('gulp-connect'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	ngmin = require('gulp-ngmin'),
	uglify = require('gulp-uglify'),
	delfile = require('gulp-delete-file'),
	modRewrite = require('connect-modrewrite'),
	minimist = require('minimist'),
	gutil = require('gulp-util');

function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}

gulp.task('constants',function(){
	var envConfig = process.env.SERVICE_API_URL;
	var conConfig = 'module.exports = function(app){appconfig = ' + JSON.stringify(envConfig)+'}';
	return string_src("config.js", conConfig)
      .pipe(gulp.dest('./src/modules/'))
})


gulp.task('connect', function(cb){
	connect.server({
		root: '.',
		livereload: true,
		port:80,
		middleware: function(){
			return [
				modRewrite([
					'^/user_center.* /index.html',
					'^/order.* /index.html',
					'^/orders.* /index.html',
					'^/index.* /index.html',
					'^/freeIndex.* /index.html',			
					'^/recipes.* /index.html',
					'^/dishs.* /index.html',
				])
			];
		}
	});
	cb();
});


gulp.task('reload', ['less', 'browserify'], function(){
	return gulp.src(['./*.html', './assets/**/*', './src/**/*'])
		.pipe(connect.reload());
});

gulp.task('watch', ['watch-html', 'watch-less', 'watch-js']);

gulp.task('watch-html', function(){
	gulp.watch(['./*.html'], ['reload']);
});

gulp.task('watch-less', function(){
	gulp.watch(['./assets/less/*.less'], ['reload']);
});

gulp.task('watch-js', function(){
	gulp.watch(['./src/**/*.js'], ['reload']);
});

gulp.task('run', ['constants','compile', 'connect', 'watch']);

gulp.task('compile', ['less', 'browserify']);

gulp.task('prod',['constants','less','uglify']);

gulp.task('vendor', function(){
	return gulp.src('./vendor/**/*')
		.pipe(gulp.dest('./assets'));
});

gulp.task('browserify', function(){
	return browserify('./src/app.js', { debug: true })
		.transform(babelify)
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(rename({ basename: 'app', extname: '.js'}))
		.pipe(gulp.dest('./assets/js/'))
});

gulp.task('remove-min-files', function(){
	return gulp.src('./assets/js/**/*.min.js')
		.pipe(delfile({
			reg: /.*/,
			deleteMatch: true
		}));
});

gulp.task('uglify', ['browserify', 'remove-min-files'], function(){
	return gulp.src('./assets/js/*.js')
		.pipe(ngmin({dynamic: false}))
		//.pipe(uglify({outSourceMap: false}))
		.pipe(uglify({outSourceMap: true}))
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest('./assets/js/'));
});

gulp.task('less', function(){
	return gulp.src('./assets/less/*.less')
		.pipe(less())
		.pipe(gulp.dest('./assets/css'))
		.pipe(minifyCSS())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest('./assets/css'));
});
