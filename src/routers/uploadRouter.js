/*
 * @Date: 2022-10-23 19:09:36
 * @LastEditors: AhYaaaaas xuanyige87@gmail.com
 * @LastEditTime: 2022-10-23 20:09:51
 * @FilePath: \NodeReactProject-BE\src\routers\uploadRouter.js
 */
const Router = require("express").Router();
const { fileExist } = require("../utils/utils")
const path = require("path");
const fs = require("fs");
const { updateValue, connectDb } = require("../utils/sql.utils");
// 上传头像
Router.post("/avatar", async (req, res) => {
  const file = req.files.file,
    { uid } = req.body,
    filePath = path.join(__dirname, `../../public/user/${uid}/avatar`);
  const isNotExist = await fileExist(filePath);
  if (isNotExist) {
    await fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) throw err;
    })
  }
  file.mv(filePath + '/' + file.name);
  const conn = connectDb();
  await updateValue(conn, "userinfo", "avatar", `"user/${uid}/avatar/${file.name}"`, `uid = "${uid}"`);
  res.status(200).send("OK")
})

//上传书籍
Router.post("/book", (req, res) => {

})
module.exports = Router;