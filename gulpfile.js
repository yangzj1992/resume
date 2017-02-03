var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var path = require('path');
var gls = require('gulp-live-server');

var server = gls.static('dist', 8500);

/**************** Utility **********************/
var reg = {
      code: /`(.+?)`/g,
      bold: /\*\*(.+?)\*\*/g,
      links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
}

function marked(str){
  return str.replace(reg.bold, '<strong>$1</strong>')
    .replace(reg.code, '<strong>$1</strong>')
    .replace(reg.links, '<a href="$2" target="_blank">$1</a>');
}

/******************* Jade to html ***********/
function getLocals() {
  var resumeData = require('./resume.json');
  var localePath = './i18n/' + resumeData.data_lang + '/dict.js';
  var locals = require(localePath);

  // remove cache
  delete require.cache[require.resolve('./resume.json')];
  delete require.cache[require.resolve(localePath)];

  // integrate the context
  for (var item in resumeData) {
    locals[item] = resumeData[item];
  }

  locals.marked = marked;

  return locals;
}

gulp.task('jade', function() {
  return gulp.src('./src/jade/index.jade')
    .pipe(plugins.jade({ locals: getLocals() }))
    .pipe(gulp.dest('./dist/'));
});

/************* less to css  ********************/
var lessPath = [path.join(__dirname, 'src', 'less', 'includes'),
                path.join(__dirname, 'src', 'less', 'components')];

function less2css(srcPath, destPath, debug) {
  if(!debug) {
    return gulp.src(srcPath)
      .pipe(plugins.less({ paths: lessPath }))
      .pipe(plugins.minifyCss({ compatibility: 'ie9' }))
      .pipe(gulp.dest(destPath));
  } else {
    return gulp.src(srcPath)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.less({ paths: lessPath }))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(destPath));
  }
}

gulp.task('less', function() {
  less2css('./src/less/index.less', './dist/');
});

gulp.task('less-debug', function() {
  less2css('./src/less/index.less', './dist/', true);
});

/************** Static assets **************/
gulp.task('static', function() {
  return gulp.src('./static/**/*', { base: 'static' })
    .pipe(gulp.dest('./dist/static/'));
});

/****************** Watch ****************/
gulp.task('watch', ['server'], function() {
  gulp.watch(['./src/**/*.jade', './resume.json', './i18n/**/*.js'],
             ['jade']);
  gulp.watch('./static/**/*', ['static']);
  gulp.watch('./src/**/*.less', ['less-debug']);
  gulp.watch('./dist/**/*', function() {
    server.notify.apply(server, arguments);
  });
});

/****************** Build ****************/
gulp.task('build', ['jade', 'less-debug', 'static']);
gulp.task('build-for-deploy', ['jade', 'less', 'static']);

/****************** Server ****************/
gulp.task('serve', function () {
  server.start();
});

gulp.task('server', ['build', 'serve']);
gulp.task('preview', ['build-for-deploy', 'serve']);

/****************** Deploy ****************/
gulp.task('deploy', ['build-for-deploy'], function() {
  return gulp.src('./dist/**/*')
    .pipe(plugins.ghPages());
});

/****************** Default ****************/
gulp.task('default', ['server', 'watch']);