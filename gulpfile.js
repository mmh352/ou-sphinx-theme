const gulp = require('gulp'),
      pump = require('pump'),
      connect = require('gulp-connect'),
      { spawn } = require('child_process');

gulp.task('js.mathjax', function(cb) {
    pump([
        gulp.src('node_modules/mathjax/es5/**/*.*'),
        gulp.dest('ou_sphinx_theme/static/mathjax')
    ], cb);
});

gulp.task('js.build.production', function(cb) {
    const builder = spawn('rollup', ['-c'], {
        cwd: 'app',
        stdio: 'inherit'
    });
    builder.on('exit', cb);
});

gulp.task('js.build.development', function(cb) {
    const builder = spawn('rollup', ['-c', '-w'], {
        cwd: 'app',
        stdio: 'inherit'
    });
    builder.on('exit', cb);
});

gulp.task('js.deploy', function(cb) {
    pump([
        gulp.src('app/public/build/*.*'),
        gulp.dest('ou_sphinx_theme/static')
    ], cb);
});

gulp.task('js.production', gulp.series('js.build.production', 'js.deploy', 'js.mathjax'));

gulp.task('js.development', gulp.parallel('js.build.development'));

gulp.task('default', gulp.parallel('js.production'));

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

gulp.task('demo', gulp.series('js.production', 'demo.build', function(cb) {
    connect.server({
        root: 'demo/build/html',
        host: '0.0.0.0',
        port: '8080',
    });
    cb();
}));

gulp.task('dev', gulp.series('demo.build', gulp.parallel('js.development', (cb) => {
    gulp.watch('app/public/build/*.*', {delay: 1000, events: ['add', 'change']}, gulp.parallel('js.deploy'));
    gulp.watch(['ou_sphinx_theme/**/*.*', 'demo/**/*.*'], {delay: 1000, events: ['add', 'change']}, gulp.series('demo.build', 'demo.reload'));
    connect.server({
        root: 'demo/build/html',
        host: '0.0.0.0',
        port: '8080',
        livereload: true,
    });
    cb();
})));
