/*
 * @Date: 2022-10-29 20:47:36
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-29 21:17:15
 * @FilePath: \NodeReactProject-BE\src\routers\downLoadRouter.js
 */
const Router = require("express").Router();
const zlib = require('zlib'),
  path = require('path'),
  fs = require('fs');
const gzip = zlib.createGzip();
Router.get('/book', (req, res) => {
  console.log(1);
  const { bookName } = req.query;
  const filePath = path.join(__dirname, `../../public/books/${bookName}`);
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
})
module.exports = Router;