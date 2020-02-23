var gulp = require('gulp'),
    babel = require("gulp-babel"),
    gulpif = require('gulp-if'),
    gulpIgnore = require('gulp-ignore'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    extend = require('gulp-html-extend'),
    merger = require('./merger');

var config = require('./config');

var browserSync = require('browser-sync').create();

var LessAutoprefix  = require('less-plugin-autoprefix'),
    autoprefix      = new LessAutoprefix({ browsers: ['last 2 versions'] });

var directory = {
    app: './app',
    pub: './public'
};

directory.views = directory.app.concat('/views');
directory.styles = directory.app.concat('/styles');
directory.scripts = directory.app.concat('/scripts');
directory.assets = directory.pub.concat('/assets');
directory.components = directory.assets.concat('/components');
directory.destination = {
    styles: directory.assets.concat('/css'),
    scripts: directory.assets.concat('/js')
};

var argv = require('yargs').argv;

// Start a web server for development environment
gulp.task('serve', ['default'], function(){

    // init browser sync
    browserSync.init({
        server: {
            baseDir: directory.pub
        }
    });

    // reload browser sync
    gulp.watch(directory.pub.concat('/**/*'), function(){

        if ( browserSync.active )
        {
            browserSync.reload();
        }

    });

});

// Merge all component files
gulp.task('components', function(){

    // Styles
    gulp.src(config.components.styles.files.map(function(path){ return directory.components.concat(path); }))
        .pipe(less({
            plugins : [autoprefix]
        }))
        .pipe(merger({
            destination: directory.destination.styles
        }))
        .pipe(concat(config.components.styles.concat))
        .pipe(gulp.dest(directory.destination.styles))
        // Production
        .pipe(gulpIgnore.exclude(!argv.production))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directory.destination.styles));

    // Scripts
    gulp.src(config.components.scripts.files.map(function(path){ return directory.components.concat(path); }))
        .pipe(concat(config.components.scripts.concat))
        .pipe(gulp.dest(directory.destination.scripts))
        // Production
        .pipe(gulpIgnore.exclude(!argv.production))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directory.destination.scripts));

});

gulp.task('views', function(){

    return gulp.src(directory.views.concat('/*.html'))
        .pipe(extend({
            annotations: false,
            verbose: false
        }))
        //.pipe(gulpif(argv.production, replace('default.css', 'default.min.css'))) // Production
        //.pipe(gulpif(argv.production, replace('default.js', 'default.min.js'))) // Production
        .pipe(gulp.dest(directory.pub));

});

gulp.task('scripts', function(){

    return gulp.src(config.application.scripts.files.map(function(path){ return directory.scripts.concat(path); }))
        .pipe(concat(config.application.scripts.concat))
        .pipe(gulp.dest(directory.destination.scripts))
        // Production
        .pipe(gulpIgnore.exclude(!argv.production))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directory.destination.scripts));

});

gulp.task('styles', function(){

    return gulp.src(config.application.styles.files.map(function(path){ return directory.styles.concat(path); }))
        .pipe(gulpif(argv.sourcemaps, sourcemaps.init()))
        .pipe(less({
            plugins : [autoprefix]
        }))
        .pipe(gulpif(argv.sourcemaps, sourcemaps.write()))
        .pipe(concat(config.application.styles.concat))
        .pipe(gulp.dest(directory.destination.styles))
        // Production
        .pipe(gulpIgnore.exclude(!argv.production))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(directory.destination.styles));
});

gulp.task('combine', ['views', 'styles', 'scripts', 'components']);

gulp.task('build', ['components', 'combine']);

gulp.task('watch', function(){

    // View Files
    gulp.watch(directory.views.concat('/**/*.html'), ['views']);

    // Stylesheet Files
    gulp.watch(directory.styles.concat('/**/*.less'), ['styles']);

    // JavaScript Files
    gulp.watch(directory.scripts.concat('/**/*.js'), ['scripts']);

});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['combine'], function(){

    // start watch
    gulp.start('watch');

});