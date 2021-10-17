// import gulp from 'gulp';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import imagemin from 'imagemin';

const path = require('path');
const { chdir } = require('process');
// import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';

console.log(imagemin);

chdir(path.resolve(__dirname)); // 修改node当前进程目录

// const files = imagemin(['file/*.{jpg,jpeg,png,gif}'], {
//   destination: 'mini',
//   plugins: [
//     // gifsicle({ interlaced: true }),
//     // mozjpeg({ quality: 75, progressive: true }),
//     // optipng({ optimizationLevel: 5 }),
//     imageminPngquant({ quality: [0.65, 0.9], speed: 4 }),
//     imageminWebp({ quality: 60 }), // 值越大代表质量越高，文件越大。
//   ],
// });

// files.then((res) => {
//   console.log(res);
// });
