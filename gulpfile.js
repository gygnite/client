'use strict';
var gulp = require('gulp');
var path = require('path');

//css
var autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-cssnano'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    bs = require('browser-sync').create(),
    nodemon = require('gulp-nodemon'),
    fontello = require('gulp-fontello'),
    runSequence = require('run-sequence'),
    del = require('del'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');
var neat =  require('node-neat').includePaths;

const CSS_BUILD_DIR = path.resolve(__dirname, './public/css');
const CSS_SOURCE_DIR = './styles/**/*.*';

gulp.task('dev', function() {
    bs.init(null, {
		proxy: "http://localhost:3001",
        port: 3000,
        open: false,
        notify: false
	});
    runSequence('fonts', 'sass', 'watch');
});

gulp.task('watch', function() {
    gulp.watch(CSS_SOURCE_DIR, ['sass']);
});

gulp.task('fonts', function() {
    del(['fonts', 'public/fonts', 'styles/icons']);
    return gulp.src('fontello.json')
        .pipe(fontello({
            font: 'fonts',
            css: 'styles/icons'
        }))
        .pipe(rename(function(path) {
            if(path.extname === '.css') {
                path.extname = '.scss';
                if (path.basename[0] !== '_') {
                    path.basename = '_'+path.basename;
                }
            }

        }))
        .pipe(gulp.dest(''))
        .pipe(gulp.dest('./public'))
        .on('end', function() {
            // del(['public/styles', 'fonts']);
        });
});

gulp.task('sass', function() {
    return gulp.src(CSS_SOURCE_DIR)
        .pipe(sass({
            includePaths: ['sass'].concat(neat)
        }))
        .on('error', function(err) {
            gutil.log("[sass]", err.toString());
            this.emit('end');
        })
        // .pipe(autoprefixer())
        .pipe(gulp.dest(CSS_BUILD_DIR))
        .pipe(bs.stream());
});

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});


gulp.task('build-production', function() {
    return runSequence('fonts', 'production', 'minifyjs', 'complete');
});

gulp.task('minifyjs', function() {
    return gulp.src('./public/js/bundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('production', function() {
    return gulp.src([CSS_SOURCE_DIR])
        .pipe(sass({
            includePaths: ['sass'].concat(neat)
        }))
        .on('error', function(err) {
            gutil.log("[production]", err.toString());
        })
        .pipe(minifycss())
        .pipe(gulp.dest(CSS_BUILD_DIR));
});

gulp.task('complete', function() {
    console.log("Gulp Production Build Complete.");
});
