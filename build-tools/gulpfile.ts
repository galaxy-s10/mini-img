import gulp from 'gulp';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import webp from 'gulp-webp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
// gulp-imagemin8.x必须使用import来加载ES模块。https://github.com/imagemin/imagemin/issues/392，因此降级成7.x。
import clean from 'gulp-clean';
import { chalkSUCCESS, emoji } from './utils/chalkTip';

gulp.task('clean-mini', (ok) => {
  const res = gulp
    .src(['../mini'], {
      allowEmpty: true,
    })
    .pipe(clean({ force: true })); // 不添加force:true属性不能删除上层目录，因此加上。
  res.on('finish', function () {
    console.log(
      chalkSUCCESS('清除旧文件成功！'),
      emoji.get('heavy_check_mark')
    );
    ok();
  });
});

gulp.task(
  'default',
  gulp.series('clean-mini', function mini() {
    return gulp
      .src('webp/**/*', { cwd: '../' })
      .pipe(
        imagemin([
          gifsicle({ interlaced: true, optimizationLevel: 2 }), // 压缩gif
          mozjpeg({ quality: 50, progressive: true }), // 压缩jpg（有损/无损都有可能）
          optipng({ optimizationLevel: 7 }), // 压缩png（无损）范围：0-7
          imageminPngquant({ quality: [0.65, 0.9], speed: 4 }), // 压缩png(有损)
          imageminWebp({ quality: 75 }), // 值越大代表质量越高，文件越大。范围：
        ])
      )
      .pipe(gulp.dest('../mini'));
  })
);

gulp.task(
  'to-webp',
  gulp.series(function toWebp() {
    return gulp
      .src('mini/**/*', { cwd: '../' })
      .pipe(webp())
      .pipe(gulp.dest('../webp'));
  })
);
