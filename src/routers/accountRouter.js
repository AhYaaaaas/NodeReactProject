/*
 * @Date: 2022-10-20 17:55:07
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-21 09:05:32
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
} = require("../utils");
const {
  insertValue,
  closeDB,
  connectDb,
  selectValue
} = require('../utils/sql.utils')
Router.post("/register", (req, res) => {
  const conn = connectDb();
  const { userName, password } = req.body;
  const uid = createUniqueUid();
  const uAccount = createUniqueAccount();
  const result = insertValue(conn, "userInfo", "(userName,password,uid,uAccount)", `("${userName}","${cryptoPassword(password)}","${uid}","${uAccount}")`);
  closeDB(conn);
  res.send({
    userName,
    uAccount,
    uid,
  })
})
// 登陆前验证token是否有效
Router.use("/login", verifyToken);
Router.post("/login", async (req, res) => {
  let uid;
  let { password, uAccount } = req.body
  if (req.user) {
    uid = req.user.uid;
    uAccount = req.user.uAccount;
  } else {
    const conn = connectDb();
    const res = await selectValue(conn, "uid", "userInfo", `uAccount = "${uAccount}"`);
    uid = res['uid'];
  }
  const token = jwt.sign({ uid, uAccount }, SECRETKEY, { expiresIn: 60 * 60 * 24 })
  res.send({
    status: 200,
    token,
    uid,
    uAccount
  })
})
module.exports = Router