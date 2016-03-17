/**
 * testing tasks (using karma to test in the browser). Requires a karma.conf.js for full config
 * single-run testing
 * continuous testing
 */

/** base deps, but you may need more specifically for your application */
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var path = require('path');
var karma = require('karma');
var karmaParseConfig = require('karma/lib/config').parseConfig;
var uglify = require('gulp-uglify');

var source = ['./src/click-to-edit.js'];

function runKarma(configFilePath, options, cb) {

    configFilePath = path.resolve(configFilePath);

    var server = karma.Server;
    var log=gutil.log, colors=gutil.colors;
    var config = karmaParseConfig(configFilePath, {});

    Object.keys(options).forEach(function(key) {
      config[key] = options[key];
    });

    server.start(config, function(exitCode) {
        log('Karma has exited with ' + colors.red(exitCode));
        cb();
        process.exit(exitCode);
    });
}

/** actual tasks */

gulp.task('lint', function(cb) {
    return gulp.src(source)
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));
});

/** single run */
gulp.task('test', ['lint'], function(cb) {
    runKarma('karma.conf.js', {
        autoWatch: false,
        singleRun: true
    }, cb);
});

/** continuous ... using karma to watch (feel free to circumvent that;) */
gulp.task('watch', ['lint'], function(cb) {
    runKarma('karma.conf.js', {
        autoWatch: true,
        singleRun: false
    }, cb);
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());    
});

gulp.task('build', function() {
    return gulp.src(source)
        .pipe(gulp.dest('dist'))
        .pipe(rename('click-to-edit.min.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['clean', 'lint', 'test', 'build']);