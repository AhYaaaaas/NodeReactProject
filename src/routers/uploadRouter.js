/*
 * @Date: 2022-10-23 19:09:36
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-29 20:47:48
 * @FilePath: \NodeReactProject-BE\src\routers\uploadRouter.js
 */
const Router = require("express").Router();
const { formatDate, createUniqueUid } = require("../utils/utils")
const path = require("path");
const fs = require("fs");
const { insertValue, updateValue, connectDb, selectValue, closeDB, fuzzyQuery, NOT_EXIST } = require("../utils/sql.utils");
const shell = require('shelljs');
const { baseUrl: BASEURL } = require('../../project.config')
// 上传头像
Router.post("/avatar", async (req, res) => {
  const { uid } = req.body,
    file = req.files.file,
    filePath = path.join(__dirname, `../../public/avatar`);
  // const isNotExist = await fileExist(filePath);
  // if (isNotExist) {
  //   await fs.mkdir(filePath, { recursive: true }, (err) => {
  //     if (err) throw err;
  //   })
  // }
  file.mv(filePath + '/' + uid + file.name, file);
  const conn = connectDb();
  // 数据库里的头像地址前缀不带uid
  // 文件夹里的头像地址带uid防止重复
  await updateValue(conn, "userinfo", "avatar", `"${file.name}"`, `uid = "${uid}"`);
  res.status(200).send("OK")
})
//获得头像
Router.get('/avatar', async (req, res) => {
  const { uid } = req.query;
  const conn = connectDb();
  let result = await selectValue(conn, "avatar", "userinfo", `uid = "${uid}"`);
  result = result[0];
  if (result['avatar'] !== "default.jpeg") res.send(BASEURL + `/avatar/${uid + result['avatar']}`);
  else res.send(BASEURL + `/avatar/${result['avatar']}`)
})


//上传书籍
Router.post("/book", async (req, res) => {
  let { uid, bookName } = req.body;
  // 书籍名：上传者的uid加上书名；
  // 路径:book/书籍名
  bookName = bookName.split(" ").join('');
  const filePath = path.join(__dirname, `../../public/books/${uid + bookName}`);
  fs.appendFileSync(filePath, req.files['chunk'].data, (err) => {
    console.log(err);
  })
  res.status(200).end("OK");
})
//上传书籍完成
Router.post('/success', async (req, res) => {
  let { uid, bookName } = req.body;
  bookName = bookName.split(" ").join('');
  //图片地址 public/images/书籍前缀.jpg
  const filePath = path.join(__dirname, `../../public/books/${uid + bookName}`);
  const imagePath = path.join(__dirname, `../../public/images/${uid + bookName.split('.')[0] + '.jpg'}`);
  shell.exec(`gm convert ${filePath}[0] ${imagePath}`, (code) => {
    if (!code) {
      console.log("success");
    }
  });
  //上传结束时间
  const uploadTime = formatDate();
  //生成书籍ID并返回给用户
  bookid = createUniqueUid();
  //保存书籍信息至数据库
  const conn = connectDb();
  await insertValue(conn, "bookinfo", "(bookid,bookname,uploaderid,uploadtime)", `("${bookid}","${bookName}","${uid}","${uploadTime}")`);
  closeDB(conn);
})

//获得书籍 模糊查询
Router.get("/book", async (req, res) => {
  const { keyWord } = req.query;
  const conn = connectDb();
  const result = await fuzzyQuery(conn, "bookinfo", keyWord);
  closeDB(conn);
  if (result !== NOT_EXIST) {
    const array = [];
    for (let key in result) {
      const item = result[key];
      array.push(Object.assign(item, {
        imgUrl: BASEURL + "/images/" + item['uploaderid'] + item['bookname'].split('.')[0] + '.jpg',
        bookUrl: BASEURL + "/books/" + item['uploaderid'] + item['bookname']
      }));
    }
    res.status(200).send(result);
  } else {
    res.status(404).send(NOT_EXIST);
  }
})
module.exports = Router;