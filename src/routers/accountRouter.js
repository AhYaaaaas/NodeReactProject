/*
 * @Date: 2022-10-20 17:55:07
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-21 21:52:17
 * @FilePath: \NodeReactProject-BE\src\routers\accountRouter.js
 */
const SECRETKEY = "gexuanyi";
const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  createUniqueUid,
  createUniqueAccount,
  verifyToken,
  cryptoPassword,
} = require("../utils/utils");
const {
  insertValue,
  closeDB,
  connectDb,
  selectValue
} = require('../utils/sql.utils')
Router.post("/register", (req, res) => {
  const conn = connectDb();
  const { userName, password,uEmail } = req.body;
  const uid = createUniqueUid();
  const uAccount = createUniqueAccount();
  const result = insertValue(conn, "userInfo", "(userName,password,uid,uAccount,uEmail)", `("${userName}","${cryptoPassword(password)}","${uid}","${uAccount}","${uEmail}")`);
  closeDB(conn);
  res.send({
    userName,
    uAccount,
    password,
    uid,
    uEmail
  })
})
// 登陆前验证token是否有效
Router.use("/login", verifyToken);
Router.post("/login", async (req, res) => {
  let uid,queryResult;
  let { password, uAccount } = req.body
  if (req.user) {
    uid = req.user.uid;
    uAccount = req.user.uAccount;
    queryResult = await selectValue(conn, "*", "userInfo", `uAccount = "${uAccount}"`);
  } else {
    const conn = connectDb();
    queryResult = await selectValue(conn, "*", "userInfo", `(uAccount = "${uAccount}" or uEmail = "${uAccount}") and password = "${cryptoPassword(password)}"`);
    closeDB(conn);
  }
  const token = jwt.sign({ uid, uAccount }, SECRETKEY, { expiresIn: 60 * 60 * 24 })
  if (queryResult) {
    const { password: _, ...rest } = queryResult
    res.send({
      status: 200,
      token,
      userInfo:rest
    })
  } else {
    res.send({
      status: 404,
      message:"账号或密码错误"
    })
  }
})
module.exports = Router