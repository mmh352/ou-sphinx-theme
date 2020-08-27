const gulp = require('gulp'),
      pump = require('pump'),
      connect = require('gulp-connect'),
      { spawn } = require('child_process'),
      sass = require('gulp-sass');

gulp.task('js.mathjax', function(cb) {
    pump([
        gulp.src('node_modules/mathjax/es5/**/*.*'),
        gulp.dest('ou_sphinx_theme/static/mathjax')
    ], cb);
});

gulp.task('js.build.production', function(cb) {
    const builder = spawn('yarn', ['build', '--mode', 'production'], {
        cwd: 'app',
        stdio: 'inherit'
    });
    builder.on('exit', cb);
});

gulp.task('js.build.development', function(cb) {
    const builder = spawn('yarn', ['build', '--mode', 'development', '--watch', '--no-clean'], {
        cwd: 'app',
        stdio: 'inherit'
    });
    builder.on('exit', cb);
});

gulp.task('js.deploy', function(cb) {
    pump([
        gulp.src('app/dist/js/*.*'),
        gulp.dest('ou_sphinx_theme/static')
    ], cb);
});

gulp.task('js.production', gulp.series('js.build.production', 'js.deploy', 'js.mathjax'));

gulp.task('js.development', gulp.parallel('js.build.development'));

gulp.task('css:sanitize', (cb) => {
    pump([
        gulp.src('node_modules/sanitize.css/sanitize.css'),
        gulp.dest('ou_sphinx_theme/static')
    ], cb);
});

gulp.task('css:theme', (cb) => {
    pump([
        gulp.src('styling/theme.scss'),
        sass(),
        gulp.dest('ou_sphinx_theme/static')
    ], cb);
});

gulp.task('css', gulp.parallel('css:sanitize', 'css:theme'));

gulp.task('default', gulp.parallel('css', 'js.production'));

gulp.task('watch', gulp.series('default', gulp.parallel('js.development', (cb) => {
    gulp.watch('styling/**/*.*', gulp.parallel('css'));
    gulp.watch('app/dist/js/*.*', {delay: 1000, events: ['add', 'change']}, gulp.parallel('js.deploy'));
    cb();
})));

gulp.task('demo.clean', function(cb) {
    const builder = spawn('make', ['clean'], {
        cwd: 'demo',
        stdio: 'inherit'
    });
    builder.on('exit', cb);
});

gulp.task('demo.build', gulp.series('demo.clean', function(cb) {
    const builder = spawn('make', ['html'], {
        cwd: 'demo',
        stdio: 'inherit'
    });
    builder.on('exit', cb);
}));

gulp.task('demo.reload', function(cb) {
    pump([
        gulp.src('demo/build/html/**/*.*'),
        connect.reload(),
    ], cb);
});

gulp.task('serve', gulp.series('default', 'demo.build', gulp.parallel('js.development', (cb) => {
    gulp.watch('styling/**/*.*', gulp.parallel('css'));
    gulp.watch('app/dist/js/*.*', {delay: 1000, events: ['add', 'change']}, gulp.parallel('js.deploy'));
    gulp.watch(['ou_sphinx_theme/**/*.*', 'demo/**/*.*'], {delay: 1000, events: ['add', 'change']}, gulp.series('demo.build', 'demo.reload'));
    connect.server({
        root: 'demo/build/html',
        host: '0.0.0.0',
        port: '8080',
        livereload: true,
    });
    cb();
})));
