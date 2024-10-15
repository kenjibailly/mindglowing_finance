const {series, parallel, watch, src, dest, gulp} = require('gulp');
const pump = require('pump');
const nodemon = require('gulp-nodemon');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const gulpStylelint = require('gulp-stylelint');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const beeper = require('beeper');

// postcss plugins
const easyimport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// JS obfuscator
const javascriptObfuscator = require('gulp-javascript-obfuscator');

function serve(done) {
    livereload.listen();
    done();
}

function handleError(done) {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function startNodemon(cb) {
    let started = false;

    return nodemon({
        script: 'bin/www.js',
        watch: ["views", "routes", "models", "./", "bin"],
        ext: "js,hbs",
    }).on('start', () => {
        if (!started) {
            cb();
            started = true;
        }
    }).on('error', (err) => {
        console.error('Nodemon error:', err); // Log any errors
    });
}

// function hbs(done) {
//     pump([
//         src(['*.hbs', 'partials/**/*.hbs']),
//         livereload()
//     ], handleError(done));
// }

function css(done) {
    // pump([
    //     src('public/stylesheets/css/screen.css', {sourcemaps: true}),
    //     postcss([
    //         easyimport,
    //         autoprefixer(),
    //         cssnano()
    //     ]),
    //     dest('assets/built/', {sourcemaps: '.'}),
    //     livereload()
    // ], handleError(done));

    pump([
        src(['public/stylesheets/*.css', 'public/stylesheets/**/*.css'], {sourcemaps: true}),
        concat('main.css'),
        postcss([
            easyimport,
            autoprefixer(),
            cssnano()
        ]),
        dest('public/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));

}

function js(done) {
    // pump([
    //     src([
    //         'public/javascripts/sync/*.js',
    //         'public/javascripts/sync/**/*.js',
    //     ], {sourcemaps: true}),
    //     concat('main.min.js'),
    //     // uglify(),
    //     // javascriptObfuscator(),
    //     dest('public/built/', {sourcemaps: '.'}),
    //     livereload()
    // ], handleError(done));


    // pump([
    //     src([
    //         'public/javascripts/async/*.js',
    //         'public/javascripts/async/**/*.js',
    //     ], {sourcemaps: true}),
    //     concat('async-main.min.js'),
    //     // uglify(),
    //     // javascriptObfuscator(),
    //     dest('public/built/', {sourcemaps: '.'}),
    //     livereload()
    // ], handleError(done));

    pump([
        src([
            'public/javascripts/*.js',
            'public/javascripts/**/*.js',
        ], {sourcemaps: true}),
        concat('main.min.js'),
        // uglify(),
        // javascriptObfuscator(),
        dest('public/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));

}

function lint(done) {
    pump([
        src(['public/stylesheets/**/*.css']),
        gulpStylelint({
            fix: true,
            reporters: [
                {formatter: 'string', console: true}
            ]
        }),
        dest('public/stylesheets/')
    ], handleError(done));
}

// const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs', 'members/**/*.hbs'], hbs);
const cssWatcher = () => watch('public/stylesheets/**/*.css', css);
const jsWatcher = () => watch('public/javascripts/**/*.js', js);
// const watcher = parallel(hbsWatcher, cssWatcher, jsWatcher);
const watcher = parallel(cssWatcher, jsWatcher);
const build = series(css, js, startNodemon);

exports.build = build;
exports.lint = lint;
exports.default = series(build, serve, watcher);
