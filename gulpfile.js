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
	modRewrite = require('connect-modrewrite');
	//imagemin = require('gulp imagemin'),

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

/*gulp.task('img',function(){
	return gulp.src('./assets/image/*')
	.pipe(imagemin({
		progressive:true,
		svgoPlugins:[{removeViewBox:false}],
		use:[pngcrush()]
	}))
	.pipe(gulp.dest('./assets/image/'))
	.pipe(notify({message:'img task ok'}));
});*/

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

gulp.task('run', ['compile', 'connect', 'watch']);

gulp.task('compile', ['less', 'browserify']);

gulp.task('vendor', function(){
	return gulp.src('./vendor/**/*')
		.pipe(gulp.dest('./assets'));
});

gulp.task('browserify', ['browserify-app'], function(){

});

gulp.task('browserify-app', function(){
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
