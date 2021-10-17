import gulp from 'gulp';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
// gulp-imagemin8.x必须使用import来加载ES模块。https://github.com/imagemin/imagemin/issues/392
// 降级成7.x。
import clean from 'gulp-clean';
import { _SUCCESS, emoji } from './utils/chalkTip';

// const clean = require('gulp-clean');

gulp.task('clean-mini', (ok) => {
  const res = gulp
    .src(['../mini'], {
      allowEmpty: true,
    })
    .pipe(clean({ force: true })); // 不添加force:true属性不能删除上层目录，因此加上。
  res.on('finish', function () {
    console.log(_SUCCESS('清除旧文件成功！'), emoji.get('heavy_check_mark'));
    ok();
  });
});

gulp.task(
  'default',
  gulp.series('clean-mini', function mini() {
    return gulp
      .src('file/*', { cwd: '../' })
      .pipe(
        imagemin([
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 50, progressive: true }), // 压缩jpg
          optipng({ optimizationLevel: 5 }), // 压缩png
          imageminPngquant({ quality: [0.65, 0.9], speed: 4 }), // 压缩png
          imageminWebp({ quality: 75 }), // 值越大代表质量越高，文件越大。
        ])
      )
      .pipe(gulp.dest('../mini'));
  })
);
