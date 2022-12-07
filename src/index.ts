import path from 'path';
import fs from 'fs';
import request from 'request';
// const fs = require('fs');
// const path = require('path');
// const request = require('request');
// import { ajaxdata } from './data';

// 文件夹目录
const dirPath = path.resolve(__dirname, '../download');

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
 * 如：https://resource.hsslive.cn/1613141138717Billd.jpg ===> 613141138717Billd.jpg
 */
function judgeFileName(url: string) {
  const arr = url.split('/');
  return arr[arr.length - 1];
}

// const requestUrl = 'http://127.0.0.1:3300/qiniu/all_list';
const requestUrl =
  'https://api.hsslive.cn/prodapi/qiniu_data/list?nowPage=1&pageSize=10&orderName=created_at&orderBy=desc&prefix=image%2F&bucket=hssblog';

let num = 0;
let total = 0;

/**
 * 异步下载资源（并行）
 */
function downloadAsync() {
  console.log('异步下载资源（并行）');
  request(requestUrl, (err, response, body) => {
    if (!err) {
      const { data } = JSON.parse(body);
      const imglist = data.rows.map(
        (v) => `https://resource.hsslive.cn/${v.qiniu_key}`
      );
      total = imglist.length;
      imglist.forEach(async (item, index) => {
        const filename = judgeFileName(item);
        console.log(`第${index + 1}个文件：${filename}开始下载`);
        await downloadFile(item, filename, index, function (v) {
          num += 1;
          console.log(
            `第${v + 1}个文件：${filename}下载完毕，进度${num}/${total}`
          );
        });
      });
    }
  });
}

/**
 * 同步下载资源（串行）
 */
function downloadSync() {
  console.log('同步下载资源（串行）');
  request(requestUrl, async (err, response, body) => {
    if (!err) {
      const { data } = JSON.parse(body);
      const imglist = data.rows.map(
        (v) => `https://resource.hsslive.cn/${v.qiniu_key}`
      );
      total = imglist.length;
      for (let i = 0; i < imglist.length; i++) {
        const filename = judgeFileName(imglist[i]);
        console.log(`第${i + 1}个文件：${filename}开始下载`);
        await downloadFile(imglist[i], filename, i, function (v) {
          num += 1;
          console.log(
            `第${v + 1}个文件：${filename}下载完毕，进度${num}/${total}`
          );
        });
      }
    }
  });
}

downloadAsync();
// downloadSync();
