/*
 * @Date: 2022-10-23 19:09:36
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-26 22:22:30
 * @FilePath: \NodeReactProject-BE\src\routers\uploadRouter.js
 */
const Router = require("express").Router();
const { fileExist } = require("../utils/utils")
const path = require("path");
const fs = require("fs");
const { updateValue, connectDb, selectValue } = require("../utils/sql.utils");
const NOT_EXIST = require("../utils/sql.utils");
const BASEURL = "http://localhost:5000/"
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
  const result = await selectValue(conn, "avatar", "userinfo", `uid = "${uid}"`);
  if (result['avatar'] !== "default.jpeg") res.send(BASEURL + `avatar/${uid + result['avatar']}`);
  else res.send(BASEURL + `avatar/${ result['avatar']}`)

})


//上传书籍
Router.post("/book", (req, res) => {

})
//获得书籍
Router.get("/book", (req, res) => {
  const { bookName } = req.query;
  const filePath = path.join(__dirname, `../../public/books/${bookName}`);
  const buff = fs.readFileSync(filePath);
  res.send(buff);
})
module.exports = Router;