/*
 * @Date: 2022-10-20 17:55:07
 * @LastEditors: xuanyi_ge xuanyige87@gmail.com
 * @LastEditTime: 2022-10-22 09:44:03
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
  sendEmail,
} = require("../utils/utils");
const {
  insertValue,
  closeDB,
  connectDb,
  selectValue
} = require('../utils/sql.utils')
Router.post("/register", (req, res) => {
  const conn = connectDb();
  const { userName, password, uEmail } = req.body;
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
const userMap = new Map();
Router.post("/code", (req,res) => {
  const { uEmail, uCode } = req.body;
  if (uCode && userMap[uEmail] === +uCode) {
    delete userMap[uEmail];
    res.send({
      status: 200,
      message: "验证通过",
    })
  } else {
    res.send({
      status: 400,
      message: "验证失败",
    })
  }
})
Router.get("/code", (req,res) => {
  const { uEmail } = req.query;
  const code = parseInt(Math.random() * 8999 + 1000);
  userMap[uEmail] = code;
  sendEmail(uEmail, code);
  res.send({
    message: "生成验证码完成",
    status: 200,
    code
  })
})
module.exports = Router