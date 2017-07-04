import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import es from 'event-stream';
import cleanCSS from 'gulp-clean-css';

const $ = gulpLoadPlugins();
const paths = {
  styles: {
    src: 'src/themes/',
    less: 'src/themes/**/*.{less,css}',
    dest: 'dist/themes/'
  },
  scripts: {
    src: 'src/utils/**/*.js',
    libs: 'src/libs/**/*.js',
    dest: 'dist/scripts/'
  },
  assets: {
    src: 'src/assets/**/*.{jpg,jpeg,png,ico}',
    dest: 'dist/assets/'
  },
  docs: {
    src: 'src/docs/',
    dest: 'dist/docs/'
  },
  html: {
    index: 'src/index.html',
    src: 'src/views/**/*.html',
    dest: 'dist/'
  }
};

/*
 * For small tasks you can use arrow functions and export
 */
const clean = () => del(['dist']);
export { clean };

const setMd = () => {
  return gulp.src(paths.docs.src)
    .pipe($.markdown())
    .pipe(gulp.dest(paths.docs.dist));
};

/**
 * html文件处理
 * 
 * @export
 * @returns 
 */
export function setHTML() {
  return gulp.src([paths.html.index, paths.html.src])
    .pipe($.preprocess())
    //如果不需要引入js、css文件，下行可以屏蔽
    .pipe($.inject(es.merge(setStyles(), setLibsScript(), setUtilsScript())))
    .pipe($.htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
  // .pipe($.notify({ message: 'htmlmin task done' }));  
}

/**
 * less样式处理，sass配置类似
 * 
 * @export
 * @returns 
 */
export function setStyles() {
  return gulp.src(paths.styles.less)
    .pipe($.less())
    .pipe(cleanCSS())
    .pipe($.autoprefixer('last 2 versions'))
    .pipe($.minifyCss())
    .pipe($.concat('layout.min.css'))
    .pipe($.rev())
    //加上mainfest后gulp-inject失效
    // .pipe(gulp.dest(paths.styles.dest))
    // .pipe(rev.manifest({
    //   base: paths.styles.dest,
    //   merge: true // merge with the existing manifest if one exists
    // }))
    .pipe(gulp.dest(paths.styles.dest))
  // .pipe($.notify({ message: 'style task done' }));  
}


/**
 * libs目录处理
 * 
 * @export
 * @returns 
 */
export function setLibsScript() {
  //打包时过滤vconsole文件
  const f = $.filter([paths.scripts.libs, '!src/libs/vconsole.min.js'], { restore: true });
  return gulp.src(paths.scripts.libs)
    .pipe(f)
    .pipe($.preprocess())
    //给合并的js文件添加map文件
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.changed(paths.scripts.dest))
    // .pipe($.cached())  //会过滤掉没有变化的文件,导致gulp-inject 引入js文件失效
    .pipe($.babel())
    .pipe($.uglify())
    // .pipe($.newer(paths.scripts.dest + 'libs.min.js'))
    .pipe($.concat('libs.min.js'))
    .pipe($.rev())
    //加上mainfest后gulp-inject失效
    // .pipe(gulp.dest(paths.scripts.dest))  
    // .pipe(rev.manifest({
    //   base: paths.scripts.dest,
    //   merge: true // merge with the existing manifest if one exists
    // }))
    .pipe($.sourcemaps.write('./'))
    .pipe(f.restore)
    .pipe(gulp.dest(paths.scripts.dest))
  // .pipe($.notify({ message: 'libsScript task done' }));  
}


/**
 * utils文件处理
 * 
 * @export
 * @returns 
 */
export function setUtilsScript() {
  return gulp.src(paths.scripts.src)
    .pipe($.preprocess())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.changed(paths.scripts.dest))
    // .pipe($.cached()) //会过滤掉没有变化的文件,导致gulp-inject 引入js文件失效
    .pipe($.babel())
    //若想查看编译后未压缩文件，打开下面一行
    // .pipe(gulp.dest(paths.scripts.dest))
    .pipe($.uglify())
    // .pipe($.remember())
    .pipe($.concat('utils.min.js'))
    .pipe($.rev())
    //加上mainfest后gulp-inject实效
    // .pipe(gulp.dest(paths.scripts.dest))
    // .pipe(rev.manifest({
    //   base: paths.scripts.dest,
    //   merge: true // merge with the existing manifest if one exists
    // }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest))
  // .pipe($.notify({ message: 'utilsScript task done' }));  
}

/**
 * images图片处理
 * npm run gulp setImgs 或 gulp setImgs
 * @export
 * @returns 
 */
export function setImgs() {
  return gulp.src(paths.assets.src, { since: gulp.lastRun(setImgs) })
    //下面一行 pass through newer images only
    .pipe($.newer(paths.assets.dest))
    .pipe($.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest(paths.assets.dest))
  // .pipe($.notify({ message: 'images task done' }));  
}


/**
 * 监听文件变化，gulp watch或 npm run gulp watch触发
 * 
 * @export
 */
export function watch() {
  // gulp.watch(paths.scripts.libs, setLibsScript);
  // gulp.watch(paths.scripts.src, setUtilsScript);
  // gulp.watch(paths.styles.src, setStyles);
  gulp.watch(paths.assets.imgs, setImgs);
  gulp.watch([paths.scripts.src, paths.scripts.libs, paths.styles.src, paths.html.index, paths.html.src], setHTML)
}

const build = gulp.series(clean, gulp.parallel(setHTML, setImgs));
export { build };

/*
 * Export a default task
 */
export default build;

/**
 * 通过将文件转换成流形式，然后写入当前环境变量配置
 * 
 * 
import minimist from 'minimist'
var opts = require('./config/index.js');
const opts={
  string: 'env',
  default: {
      env: process.env.NODE_ENV || 'development'
  }
}
const options = minimist(process.argv.slice(2), opts);

//生成filename文件，存入string内容
function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}

export function constants() {
  //读入config.json文件
  const myConfig = require('./config.json');
  //取出对应的配置信息
  const envConfig = myConfig[options.env];
  const conConfig = 'appconfig = ' + JSON.stringify(envConfig);
  //生成config.js文件
  return string_src("config.js", conConfig)
      .pipe(gulp.dest('app/scripts/'))
});

gulp constants --env production
 */