/* eslint-disable */
var gulp = require('gulp'),
    rollup = require('rollup'),
    rollupNodeResolve = require('@rollup/plugin-node-resolve'),
    rollupCommonjs = require('@rollup/plugin-commonjs'),
    rollupNodeBuiltins = require('rollup-plugin-node-builtins'),
    rollupNodeGlobals = require('rollup-plugin-node-globals'),
    rollupJson = require('@rollup/plugin-json'),
    del = require('del');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});


gulp.task('clean', function () {
    return del([
        './lib/**',
        './build/index.js'
    ]);
});

// couldn't get it working because it generates a bit different result than just run tsc
// var tsProject = $.typescript.createProject('tsconfig.json');
// gulp.task('transpile', ['clean'], function () {
//     return tsProject.src()
//         .pipe(tsProject())
//         .pipe(gulp.dest('lib'));
// });

gulp.task('rollup', function () {
    return rollup.rollup({
        input: "./build/index_src.js",
        onwarn: function (warning) {
            // Skip certain warnings

            // should intercept ... but doesn't in some rollup versions
            if (warning.code === 'THIS_IS_UNDEFINED') {
                return;
            }

            // console.warn everything else
            console.warn(warning.message);
        },
        plugins: [
            // rollupTypescript({
            //     tsconfig: false,
            //     target: 'ES5',
            // }),
            rollupNodeResolve({
                jsnext: true,
                module: true,
                browser: true,
                main: true,
                preferBuiltins: true
            }),
            rollupCommonjs({}),
            rollupJson(),
            rollupNodeGlobals(),
            rollupNodeBuiltins()
        ],
    }).then(function (bundle) {
        return bundle.write({
            format: "iife",
            file: "./build/index.js",
            name: "htmlparser2",
            sourcemap: false,
            strict: false
        });
    });
});
