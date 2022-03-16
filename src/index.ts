import path from 'path';
import fs from 'fs';
import request from 'request';
// const fs = require('fs');
// const path = require('path');
// const request = require('request');

// 文件夹目录
const dirPath = path.resolve(__dirname, '../file');

/**
 * 清空某个文件夹下的文件
 */
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); // 递归删除文件夹
      } else {
        fs.unlinkSync(curPath); // 删除文件
      }
    });
    // fs.rmdirSync(path); // tip:删除文件夹自身
  }
}

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  console.log('文件夹创建成功');
} else {
  console.log('文件夹已存在');
  delDir(`${dirPath}`);
}

/**
 * 下载网络资源
 */
function downloadFile(uri, filename, index, callback) {
  return new Promise((res, rej) => {
    const stream = fs.createWriteStream(path.join(dirPath, filename));
    request(encodeURI(uri))
      .pipe(stream)
      .on('finish', () => {
        res(callback(index));
      });
  });
}

/**
 * 获取资源名
 * 如：https://img.cdn.hsslive.cn/1613141138717Billd.jpg ===> 613141138717Billd.jpg
 */
function judgeFileName(url: string) {
  const arr = url.split('/');
  return arr[arr.length - 1];
}
const requestUrl =
  'http://live-2.preview.funnymamu.com/user/virtual-figure-prop/get-all-resource';
// const requestUrl =
//   'http://live-test5.funnymamu.com/user/virtual-figure-prop/get-all-resource';

/**
 * 异步下载资源（并行）
 */
function downloadAsync() {
  console.log('异步下载资源（并行）');
  request(requestUrl, (err, response, body) => {
    if (!err) {
      const { data } = JSON.parse(body);
      console.log(data.articles, '======');

      const uniqueData = Array.from(new Set(data)); // 去重
      console.log(`一共：${uniqueData.length}个文件`);
      uniqueData.forEach(async (item, index) => {
        const filename = judgeFileName(item);
        console.log(`第${index + 1}个文件：${filename}开始下载`);
        await downloadFile(item, filename, index, function (v) {
          console.log(`第${v + 1}个文件：${filename}下载完毕`);
        });
      });
    }
  });
}

/**
 * 同步下载资源（串行）
 */
// function downloadSync() {
//   console.log('同步下载资源（串行）');
//   request(requestUrl, async (err, response, body) => {
//     if (!err) {
//       const { data } = JSON.parse(body);
//       const uniqueData = Array.from(new Set(data.articles)); // 去重
//       console.log(`一共：${uniqueData.length}个文件`);
//       for (let i = 0; i < uniqueData.length; i++) {
//         const filename = judgeFileName(uniqueData[i]);
//         console.log(`第${i + 1}个文件：${filename}开始下载`);
//         await downloadFile(uniqueData[i], filename, i, function (v) {
//           console.log(`第${v + 1}个文件：${filename}下载完毕`);
//         });
//       }
//     }
//   });
// }

downloadAsync();
